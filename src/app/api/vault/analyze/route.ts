import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Configuração para Vercel (permitir a function rodar mais tempo, videos demoram a analisar)
export const maxDuration = 60; // 60 segundos 

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { reference_id } = body;

        if (!reference_id) {
            return NextResponse.json({ error: 'ID da referência ausente' }, { status: 400 });
        }

        console.log(`\n==============================================`);
        console.log(`[VAULT AI ENGINE] Iniciando Análise para ID: ${reference_id}`);
        console.log(`==============================================`);

        // 1. Validar autenticação (Usuário deve estar logado)
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        // 2. Buscar a referência no banco de dados para garantir que tem o video_path
        const { data: reference, error: refError } = await supabase
            .from('vault_references')
            .select('*')
            .eq('id', reference_id)
            .eq('user_id', user.id)
            .single();

        if (refError || !reference) {
            console.error('[VAULT AI ENGINE] Referência não encontrada ou sem permissão:', refError);
            return NextResponse.json({ error: 'Referência não encontrada.' }, { status: 404 });
        }

        if (!reference.file_url) {
            console.error('[VAULT AI ENGINE] file_url está vazio.');
            return NextResponse.json({ error: 'Vídeo ainda não foi processado/baixado pelo extrator.' }, { status: 422 });
        }

        // 3. Baixar o arquivo de vídeo do Supabase Storage para o cache local (/tmp) da Vercel/Node
        console.log(`[VAULT AI ENGINE] Baixando vídeo do Storage: ${reference.file_url}`);

        // Aqui assumimos que file_url é a PUBLIC URL e garantimos que acessa internamente
        const videoRes = await fetch(reference.file_url);
        if (!videoRes.ok) {
            console.error(`[VAULT AI ENGINE] Erro ao baixar Storage local. Status HTTP:`, videoRes.status);
            return NextResponse.json({ error: 'Falha ao recuperar o vídeo do Storage Interno.' }, { status: 500 });
        }

        const videoBuffer = await videoRes.arrayBuffer();
        const tmpFilePath = path.join(os.tmpdir(), `gemini_${Date.now()}.mp4`);
        fs.writeFileSync(tmpFilePath, Buffer.from(videoBuffer));

        // 4. Conectar à Google AI File API
        console.log(`[VAULT AI ENGINE] Fazendo upload para Gemini File API...`);
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set');
        }

        const fileManager = new GoogleAIFileManager(apiKey);
        const uploadResult = await fileManager.uploadFile(tmpFilePath, {
            mimeType: "video/mp4",
            displayName: `Vault Reference ${reference_id}`,
        });

        // Loop de espera nativo exigido pelo Gemini para arquivos de Vídeo pesados
        let fileInfo = await fileManager.getFile(uploadResult.file.name);
        while (fileInfo.state === "PROCESSING") {
            process.stdout.write(".");
            await new Promise((resolve) => setTimeout(resolve, 3000));
            fileInfo = await fileManager.getFile(uploadResult.file.name);
        }

        if (fileInfo.state === "FAILED") {
            return NextResponse.json({ error: 'A inteligência artificial falhou em processar o vídeo.' }, { status: 500 });
        }

        console.log(`\n[VAULT AI ENGINE] Gemini processando o conteúdo estrutural...`);

        // 5. Chamar o Gemini 1.5 Pro Multimodal pedindo JSON rigoroso
        const genAI = new GoogleGenerativeAI(apiKey);
        const generativeModel = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const systemPrompt = `Você é um brilhante especialista em vídeos virais e neuromarketing.
Analise meticulosamente este vídeo e extraia os elementos de forma técnica e objetiva.

VOCÊ DEVE RESPONDER EXCLUSIVAMENTE COM UM OBJETO JSON VALIDO NESTE EXATO FORMATO (SEM MARKDOWN WRAPPERS!):
{
  "titulo": "Um título curto, chamativo e em português descrevendo a essência do vídeo (max 60 chars).",
  "gancho": "Frase falada ou ação visual inicial (primeiros 3 segundos) que prendeu a atenção.",
  "roteiro": "(Transcrição integral com ações físicas do autor entre parênteses. Ex: '(ele sorri e aponta) blabla.')",
  "estrutura": "Modelo estrutural clássico (ex: Problema -> Solução/Inspiração, História -> Lição, Curiosidade -> Revelação, etc).",
  "por_que_funcionou": "Análise profunda dos gatilhos mentais aplicados e do ritmo/energia.",
  "emocao": "A emoção/sensação principal transmitida.",
  "sugestoes": "Uma ou duas frases de como esse vídeo poderia se sair ainda melhor ou os formatos adequados para replicação."
}`;

        const chatResult = await generativeModel.generateContent([
            {
                fileData: {
                    mimeType: uploadResult.file.mimeType,
                    fileUri: uploadResult.file.uri
                }
            },
            { text: systemPrompt }
        ]);

        let responseText = chatResult.response.text();

        // Limpar possíveis escapes Markdown (```json) para decodificar limpo
        responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        let analiseIA: any = {};
        try {
            analiseIA = JSON.parse(responseText);
        } catch (err) {
            console.error('[VAULT AI ENGINE] Falha ao parsear JSON nativo do Gemini:', err, responseText);
            throw new Error('O Gemini retornou um formato inválido.');
        }

        // 6. Cleanup do arquivo temp local e limpar também o Google API
        try {
            fs.unlinkSync(tmpFilePath);
            await fileManager.deleteFile(uploadResult.file.name);
        } catch (e) { }

        // 7. Atualizar a linha principal no DB (cravando status FINALIZADO)
        console.log(`[VAULT AI ENGINE] Salvando análise e concluindo workflow (FINALIZADO)...`);
        const { data: dbData, error: dbError } = await supabase
            .from('vault_references')
            .update({
                title: analiseIA.titulo || 'Referência sem título',
                analise_ia: analiseIA,
                status: 'FINALIZADO'
            })
            .eq('id', reference_id)
            .select()
            .single();

        if (dbError) {
            console.error('[VAULT AI ENGINE] Erro no update do Database:', dbError);
            return NextResponse.json({ error: 'Video analisado mas erro ao setar status FINALIZADO no banco' }, { status: 500 });
        }

        console.log(`[VAULT AI ENGINE] Análise completa concluída com sucesso!`);
        return NextResponse.json({ success: true, vaultReference: dbData }, { status: 200 });

    } catch (error: any) {
        console.error('[VAULT AI ENGINE] Error Fatal:', error);

        // Em caso de erro, tenta marcar como ERRO se for viável (opcional)
        // Isso evita que o frontend trave pra sempre no state "IA Assistindo"
        return NextResponse.json({ error: error.message || 'Erro inesperado' }, { status: 500 });
    }
}
