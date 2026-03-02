import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// GET /api/admin/integracoes — Buscar API keys salvas
export async function GET() {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { data, error } = await supabase
        .from('api_settings')
        .select('*')
        .order('created_at');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Mascarar as API keys (mostrar apenas últimos 4 chars)
    const masked = data?.map((setting) => ({
        ...setting,
        api_key: setting.api_key
            ? '••••••••' + setting.api_key.slice(-4)
            : null,
        api_key_set: !!setting.api_key,
    }));

    return NextResponse.json({ settings: masked });
}

// PUT /api/admin/integracoes — Salvar/atualizar API keys
export async function PUT(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const body = await request.json();
    const { provider, api_key, is_enabled } = body;

    if (!provider) {
        return NextResponse.json({ error: 'Provider é obrigatório' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (api_key !== undefined) updateData.api_key = api_key;
    if (is_enabled !== undefined) updateData.is_enabled = is_enabled;

    const { data, error } = await supabase
        .from('api_settings')
        .update(updateData)
        .eq('provider', provider)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        setting: {
            ...data,
            api_key: data.api_key ? '••••••••' + data.api_key.slice(-4) : null,
            api_key_set: !!data.api_key,
        },
    });
}

// POST /api/admin/integracoes — Testar conexão com provider
export async function POST(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const body = await request.json();
    const { provider } = body;

    // Buscar a API key real do banco
    const { data: setting, error } = await supabase
        .from('api_settings')
        .select('api_key, provider')
        .eq('provider', provider)
        .single();

    if (error || !setting?.api_key) {
        return NextResponse.json(
            { success: false, error: 'API key não configurada para este provider' },
            { status: 400 }
        );
    }

    let connected = false;
    let errorMessage = '';

    try {
        switch (provider) {
            case 'openai': {
                const res = await fetch('https://api.openai.com/v1/models', {
                    headers: { Authorization: `Bearer ${setting.api_key}` },
                });
                connected = res.ok;
                if (!res.ok) errorMessage = `Status ${res.status}`;
                break;
            }
            case 'anthropic': {
                const res = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'x-api-key': setting.api_key,
                        'anthropic-version': '2023-06-01',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'claude-3-5-haiku-latest',
                        max_tokens: 1,
                        messages: [{ role: 'user', content: 'test' }],
                    }),
                });
                // 200 ou 400 (bad request mas autenticado) = key válida
                connected = res.status !== 401 && res.status !== 403;
                if (!connected) errorMessage = `Status ${res.status}`;
                break;
            }
            case 'google': {
                const res = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models?key=${setting.api_key}`
                );
                connected = res.ok;
                if (!res.ok) errorMessage = `Status ${res.status}`;
                break;
            }
            case 'openrouter': {
                const res = await fetch('https://openrouter.ai/api/v1/models', {
                    headers: { Authorization: `Bearer ${setting.api_key}` },
                });
                connected = res.ok;
                if (!res.ok) errorMessage = `Status ${res.status}`;
                break;
            }
            default:
                errorMessage = 'Provider não suportado';
        }
    } catch (err) {
        errorMessage = err instanceof Error ? err.message : 'Erro de conexão';
    }

    // Atualizar resultado do teste
    await supabase
        .from('api_settings')
        .update({
            last_tested_at: new Date().toISOString(),
            last_test_result: connected,
        })
        .eq('provider', provider);

    return NextResponse.json({ success: connected, error: errorMessage || undefined });
}
