import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase-server';

const CREDIT_COST_PER_MESSAGE = 1;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, system_prompt, model, provider } = body;

        // ── Auth & Credits ──
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let creditsRemaining: number | null = null;

        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('credits_available, is_admin')
                .eq('id', user.id)
                .single();

            if (profile && !profile.is_admin) {
                if ((profile.credits_available ?? 0) < CREDIT_COST_PER_MESSAGE) {
                    return NextResponse.json(
                        { error: 'Créditos insuficientes. Faça upgrade do seu plano para continuar.' },
                        { status: 403 }
                    );
                }
                creditsRemaining = profile.credits_available - CREDIT_COST_PER_MESSAGE;
            }
        }

        if (provider && provider !== 'google') {
            console.warn(`[CHAT API] Provider '${provider}' no momento mapeia para Google (fallback). Em breve suporte nativo.`);
        }

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const modelName = model || 'gemini-2.0-flash';

        const generativeModel = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: system_prompt || 'Você é um assistente prestativo focado em criação de conteúdo, copywriting e IA. Responda de forma direta e profissional.',
        });

        // Convert messages to Gemini format (history)
        // Gemini requires: first message must be 'user', turns must alternate user/model
        const lastMessage = messages[messages.length - 1];

        const allHistory = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Drop leading 'model' messages (welcome messages) — Gemini requires first = 'user'
        const firstUserIdx = allHistory.findIndex((m: any) => m.role === 'user');
        const history = firstUserIdx >= 0 ? allHistory.slice(firstUserIdx) : [];

        const chatSession = generativeModel.startChat({
            history: history,
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
            }
        });

        const result = await chatSession.sendMessageStream(lastMessage.content);

        // Transform the async generator into a ReadableStream
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        controller.enqueue(new TextEncoder().encode(chunkText));
                    }

                    // ── Deduct credits after successful stream ──
                    if (user && creditsRemaining !== null) {
                        await supabase
                            .from('profiles')
                            .update({ credits_available: creditsRemaining })
                            .eq('id', user.id);
                    }

                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });

    } catch (error: any) {
        console.error('Erro na rota de chat:', error);
        return NextResponse.json({ error: error.message || 'Erro inesperado' }, { status: 500 });
    }
}
