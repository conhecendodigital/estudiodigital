import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, format, platform } = body;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `Você é um especialista em criação de conteúdo para redes sociais.

Gere um roteiro/conteúdo completo para a seguinte publicação:

- **Título/Tema**: ${title || 'Conteúdo para redes sociais'}
- **Formato**: ${format || 'Reels'}
- **Plataforma**: ${platform || 'Instagram'}

Regras:
1. Comece com um GANCHO forte (primeiros 3 segundos)
2. Desenvolva o conteúdo de forma envolvente
3. Termine com um CTA (call to action) claro
4. Se for vídeo (Reels/TikTok/YouTube), inclua indicações como [CORTE], [TEXTO NA TELA], [ZOOM]
5. Se for carrossel, numere os slides
6. Se for story, divida em frames
7. Mantenha o tom adequado para a plataforma

Formate o roteiro de maneira clara e pronta para uso. Responda APENAS com o roteiro, sem introduções.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ content: text });

    } catch (error: any) {
        console.error('Erro na geração de conteúdo:', error);
        return NextResponse.json({ error: error.message || 'Erro ao gerar conteúdo' }, { status: 500 });
    }
}
