import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Permitir que a function rode por mais tempo (vídeos demoram)
export const maxDuration = 120; // 120 segundos

// ─── Helpers ───────────────────────────────────────────────

function detectPlatform(url: string): string {
    const u = url.toLowerCase();
    if (u.includes('tiktok.com')) return 'TikTok';
    if (u.includes('instagram.com/reel')) return 'Instagram Reels';
    if (u.includes('youtube.com/shorts')) return 'YouTube Shorts';
    return 'Outros';
}

function cleanUrl(rawUrl: string): string {
    try {
        const parsed = new URL(rawUrl);
        parsed.search = ''; // remove tracking params
        return parsed.toString();
    } catch {
        return rawUrl;
    }
}

/** Busca thumbnail via oEmbed (server-side, sem CORS) */
async function fetchThumbnail(url: string): Promise<{ thumbnail: string; title: string }> {
    const platform = detectPlatform(url);
    const result = { thumbnail: '', title: '' };

    try {
        if (platform === 'Instagram Reels') {
            const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}`;
            const res = await fetch(oembedUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
                signal: AbortSignal.timeout(8000)
            });
            if (res.ok) {
                const data = await res.json();
                result.thumbnail = data.thumbnail_url || '';
                result.title = data.title || '';
            }
        }

        if (platform === 'YouTube Shorts') {
            const match = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
            if (match) {
                result.thumbnail = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
            }
            // YouTube oEmbed para título
            const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(8000) });
            if (res.ok) {
                const data = await res.json();
                result.title = data.title || '';
            }
        }

        if (platform === 'TikTok') {
            const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
            const res = await fetch(oembedUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
                signal: AbortSignal.timeout(8000)
            });
            if (res.ok) {
                const data = await res.json();
                result.thumbnail = data.thumbnail_url || '';
                result.title = data.title || '';
            }
        }
    } catch (e) {
        console.warn('[VAULT PROCESS] oEmbed fallback:', e);
    }

    return result;
}

/** Tenta baixar o vídeo direto (funciona para TikTok/YouTube, não para Instagram) */
async function downloadVideo(url: string, platform: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    // 🔌 PLUG POINT: Quando tiver uma API de download (RapidAPI, Cobalt self-hosted, etc.)
    // adicione a chamada aqui antes do fallback de download direto.
    // Exemplo:
    // const apiResult = await callDownloadAPI(url, platform);
    // if (apiResult) return apiResult;

    // Fallback: download direto (funciona para TikTok e YouTube Shorts)
    try {
        console.log(`[VAULT PROCESS] Tentando download direto da URL...`);
        const res = await fetch(url, {
            headers: {
                'User-Agent': userAgent,
                'Accept': 'video/mp4,video/*,*/*',
                'Referer': url,
            },
            redirect: 'follow',
            signal: AbortSignal.timeout(30000),
        });

        if (res.ok) {
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('video') || contentType.includes('octet-stream')) {
                const buffer = Buffer.from(await res.arrayBuffer());
                if (buffer.length > 10000) { // mínimo 10KB para ser um vídeo real
                    console.log(`[VAULT PROCESS] Download direto OK! ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
                    return { buffer, mimeType: 'video/mp4' };
                }
            }
        }
    } catch (e) {
        console.warn('[VAULT PROCESS] Download direto falhou:', (e as Error).message);
    }

    return null;
}

// ─── Main Route ────────────────────────────────────────────

export async function POST(req: NextRequest) {
    let referenceId: string | null = null;

    try {
        const body = await req.json();
        const { url: rawUrl } = body;

        if (!rawUrl || typeof rawUrl !== 'string') {
            return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 });
        }

        console.log(`\n══════════════════════════════════════════════`);
        console.log(`[VAULT PROCESS] Iniciando processamento`);
        console.log(`[VAULT PROCESS] URL: ${rawUrl}`);
        console.log(`══════════════════════════════════════════════`);

        // 1. Autenticação
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const url = cleanUrl(rawUrl);
        const platform = detectPlatform(url);
        const isTikTok = platform === 'TikTok';
        const isInstagram = platform === 'Instagram Reels';
        const isReferenceOnly = isInstagram || isTikTok;
        console.log(`[VAULT PROCESS] Plataforma: ${platform} ${isReferenceOnly ? '(modo referência — download bloqueado)' : '(análise completa)'}`);

        // 2. Buscar thumbnail via oEmbed
        const metadata = await fetchThumbnail(url);
        console.log(`[VAULT PROCESS] oEmbed: thumb=${metadata.thumbnail ? 'OK' : 'VAZIO'}, title="${metadata.title.substring(0, 40)}"`);

        // 3. Inserir registro no banco
        const { data: newRef, error: insertError } = await supabase
            .from('vault_references')
            .insert({
                user_id: user.id,
                title: metadata.title || 'Nova Referência',
                url: url,
                file_url: url, // Para Instagram, o file_url é o link original
                thumbnail_url: metadata.thumbnail,
                status: 'PENDENTE',
            })
            .select()
            .single();

        if (insertError || !newRef) {
            console.error('[VAULT PROCESS] Erro no insert:', insertError);
            return NextResponse.json({ error: `Erro ao salvar referência: ${insertError?.message}` }, { status: 400 });
        }

        referenceId = newRef.id;
        console.log(`[VAULT PROCESS] Referência criada: ${referenceId}`);

        // ──────────────────────────────────────────────────
        // 🟣 INSTAGRAM / TIKTOK: Salvar como referência (sem IA)
        // Thumbnail + link original. Análise será habilitada
        // quando uma API de download for configurada.
        // ──────────────────────────────────────────────────
        if (isReferenceOnly) {
            console.log(`[VAULT PROCESS] ${platform} → Salvando como referência visual`);

            // Salvar com thumbnail proxy (baixar e guardar no Supabase Storage para evitar CORS)
            if (metadata.thumbnail) {
                try {
                    const thumbRes = await fetch(metadata.thumbnail, {
                        headers: { 'User-Agent': 'Mozilla/5.0' },
                        signal: AbortSignal.timeout(10000),
                    });
                    if (thumbRes.ok) {
                        const thumbBuffer = Buffer.from(await thumbRes.arrayBuffer());
                        const thumbFilename = `thumb_${referenceId}.jpg`;
                        const { error: thumbUploadError } = await supabase.storage
                            .from('vault_videos')
                            .upload(thumbFilename, thumbBuffer, {
                                contentType: 'image/jpeg',
                                upsert: true,
                            });

                        if (!thumbUploadError) {
                            const { data: { publicUrl } } = supabase.storage
                                .from('vault_videos')
                                .getPublicUrl(thumbFilename);

                            await supabase
                                .from('vault_references')
                                .update({ thumbnail_url: publicUrl })
                                .eq('id', referenceId);

                            console.log(`[VAULT PROCESS] Thumbnail salva no Storage (sem CORS)`);
                        }
                    }
                } catch (e) {
                    console.warn('[VAULT PROCESS] Falha ao salvar thumbnail no Storage:', e);
                }
            }

            // Marcar como FINALIZADO sem análise IA
            const { data: finalRef, error: updateError } = await supabase
                .from('vault_references')
                .update({
                    status: 'FINALIZADO',
                    analise_ia: {
                        titulo: metadata.title || `Vídeo do ${platform}`,
                        info: `Análise de IA indisponível para ${platform}. Esta plataforma bloqueia o download direto de vídeos. Configure uma API de download (ex: Cobalt, RapidAPI) para habilitar análise completa.`,
                        plataforma: platform,
                        tipo: 'referencia_visual'
                    },
                })
                .eq('id', referenceId)
                .select()
                .single();

            if (updateError) {
                throw new Error(`Erro ao salvar referência do ${platform}.`);
            }

            console.log(`[VAULT PROCESS] ✅ Referência ${platform} salva com sucesso!`);
            return NextResponse.json({ success: true, reference: finalRef, mode: 'reference_only' }, { status: 200 });
        }

        // ──────────────────────────────────────────────────
        // 🟢 TIKTOK / YOUTUBE SHORTS: Análise completa
        // Download do vídeo → Upload Gemini → Análise IA
        // ──────────────────────────────────────────────────
        console.log(`[VAULT PROCESS] Iniciando análise completa Gemini...`);

        // 4. Tentar baixar o vídeo
        const videoData = await downloadVideo(url, platform);

        // 5. Configurar Gemini
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY não configurada no servidor');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const fileManager = new GoogleAIFileManager(apiKey);

        let analysisContent: any[];
        let tmpFilePath: string | null = null;
        let uploadedFileName: string | null = null;

        if (videoData) {
            // ── Rota A: Temos o vídeo → análise multimodal real ──
            console.log(`[VAULT PROCESS] Rota A: Análise multimodal com vídeo real`);

            tmpFilePath = path.join(os.tmpdir(), `vault_${Date.now()}.mp4`);
            fs.writeFileSync(tmpFilePath, videoData.buffer);

            // Upload para Supabase Storage
            const filename = `${platform.toLowerCase().replace(/\s/g, '_')}_${referenceId}_${Date.now()}.mp4`;
            const { error: uploadError } = await supabase.storage
                .from('vault_videos')
                .upload(filename, videoData.buffer, {
                    contentType: 'video/mp4',
                    upsert: true,
                });

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('vault_videos')
                    .getPublicUrl(filename);

                await supabase
                    .from('vault_references')
                    .update({ file_url: publicUrl })
                    .eq('id', referenceId);

                console.log(`[VAULT PROCESS] Vídeo salvo no Storage`);
            }

            // Upload para Gemini File API
            const uploadResult = await fileManager.uploadFile(tmpFilePath, {
                mimeType: "video/mp4",
                displayName: `Vault Reference ${referenceId}`,
            });

            uploadedFileName = uploadResult.file.name;

            // Aguardar processamento
            let fileInfo = await fileManager.getFile(uploadResult.file.name);
            let waitCount = 0;
            while (fileInfo.state === "PROCESSING" && waitCount < 20) {
                process.stdout.write(".");
                await new Promise((resolve) => setTimeout(resolve, 3000));
                fileInfo = await fileManager.getFile(uploadResult.file.name);
                waitCount++;
            }

            if (fileInfo.state === "FAILED") {
                throw new Error('O Gemini não conseguiu processar o vídeo.');
            }

            analysisContent = [
                {
                    fileData: {
                        mimeType: uploadResult.file.mimeType,
                        fileUri: uploadResult.file.uri
                    }
                }
            ];
        } else if (platform === 'YouTube Shorts') {
            // ── Rota C: YouTube → passar URL direto ao Gemini (suporte nativo) ──
            console.log(`[VAULT PROCESS] Rota C: YouTube URL nativa → Gemini pode acessar diretamente`);

            // Converter YouTube Shorts URL para URL padrão que o Gemini aceita
            const match = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
            const youtubeUrl = match
                ? `https://www.youtube.com/watch?v=${match[1]}`
                : url;

            analysisContent = [
                {
                    fileData: {
                        mimeType: "video/mp4",
                        fileUri: youtubeUrl
                    }
                }
            ];
        } else {
            // ── Rota B: Download falhou e não é YouTube → análise contextual ──
            console.log(`[VAULT PROCESS] Rota B: Download falhou, análise contextual com metadados`);

            const contextParts = [
                `CONTEXTO DO VÍDEO:`,
                `- Plataforma: ${platform}`,
                `- URL original: ${url}`,
                metadata.title ? `- Título do vídeo: "${metadata.title}"` : '',
                ``,
                `IMPORTANTE: Não foi possível baixar o vídeo diretamente.`,
                `Tente analisar com base no título e contexto disponível.`,
                `Se não conseguir fazer uma análise real, informe nas respostas que a análise é limitada sem acesso ao vídeo.`
            ].filter(Boolean).join('\n');

            analysisContent = [{ text: contextParts }];
        }

        // 6. Chamar Gemini
        console.log(`[VAULT PROCESS] Enviando para Gemini 2.0 Flash...`);

        await supabase
            .from('vault_references')
            .update({ status: 'DOWNLOAD_COMPLETE' })
            .eq('id', referenceId);

        const generativeModel = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const systemPrompt = `Você é um brilhante especialista em vídeos virais e neuromarketing.
Analise meticulosamente este vídeo e extraia os elementos de forma técnica e objetiva.

VOCÊ DEVE RESPONDER EXCLUSIVAMENTE COM UM OBJETO JSON VÁLIDO NESTE EXATO FORMATO (SEM MARKDOWN WRAPPERS!):
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
            ...analysisContent,
            { text: systemPrompt }
        ]);

        let responseText = chatResult.response.text();
        responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        let analiseIA: any = {};
        try {
            analiseIA = JSON.parse(responseText);
        } catch (err) {
            console.error('[VAULT PROCESS] Falha ao parsear JSON do Gemini:', responseText);
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analiseIA = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('O Gemini retornou um formato inválido.');
            }
        }

        // 7. Cleanup
        if (tmpFilePath) {
            try { fs.unlinkSync(tmpFilePath); } catch { }
        }
        if (uploadedFileName) {
            try { await fileManager.deleteFile(uploadedFileName); } catch { }
        }

        // 8. Salvar resultado final
        console.log(`[VAULT PROCESS] Salvando análise no banco (FINALIZADO)...`);
        const { data: finalRef, error: updateError } = await supabase
            .from('vault_references')
            .update({
                title: analiseIA.titulo || metadata.title || 'Referência sem título',
                analise_ia: analiseIA,
                status: 'FINALIZADO',
            })
            .eq('id', referenceId)
            .select()
            .single();

        if (updateError) {
            console.error('[VAULT PROCESS] Erro ao salvar resultado:', updateError);
            return NextResponse.json({ error: 'Análise concluída mas erro ao salvar.' }, { status: 500 });
        }

        console.log(`[VAULT PROCESS] ✅ Workflow completo com sucesso!`);
        return NextResponse.json({ success: true, reference: finalRef, mode: 'full_analysis' }, { status: 200 });

    } catch (error: any) {
        console.error('[VAULT PROCESS] ❌ Erro fatal:', error);

        // Se já criamos a referência, marca como ERRO
        if (referenceId) {
            try {
                const supabase = await createClient();
                await supabase
                    .from('vault_references')
                    .update({ status: 'ERRO' })
                    .eq('id', referenceId);
            } catch { }
        }

        return NextResponse.json(
            { error: error.message || 'Erro inesperado no processamento' },
            { status: 500 }
        );
    }
}
