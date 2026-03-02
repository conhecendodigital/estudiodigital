import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;

    try {
        const body = await request.json();
        const { messages, system_prompt, model } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY não configurada no servidor' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Em preview sempre usamos o gemini-2.5-flash ou pro, independente do selecionado na UI (openrouter, etc) pra fins de demo
        // Mas se o modelo for gemini, tentamos usar o específico, caso contrário usamos um default
        const modelName = model && model.includes('gemini') ? model : 'gemini-2.5-flash';

        const generativeModel = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: system_prompt || 'Você é um assistente prestativo.',
        });

        // Convert messages to Gemini format (history)
        // O chat do Gemini espera "user" ou "model" em construtores específicos de history, ou chamadas diretas com contents

        // Se a mensagem for só a última do usuário
        const lastMessage = messages[messages.length - 1];

        // Formatar histórico se houver mais de uma mensagem
        const history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const chatSession = generativeModel.startChat({
            history: history,
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 4096,
            }
        });

        const result = await chatSession.sendMessage(lastMessage.content);
        const responseText = result.response.text();

        return NextResponse.json({
            response: responseText,
            model_used: modelName
        });

    } catch (error: any) {
        console.error('Erro no preview do agente:', error);
        return NextResponse.json({ error: error.message || 'Erro inesperado na IA' }, { status: 500 });
    }
}
