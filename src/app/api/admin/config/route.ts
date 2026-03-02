import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// GET /api/admin/config — Buscar configurações gerais
export async function GET() {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { data, error } = await supabase
        .from('platform_config')
        .select('*')
        .order('key');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Converter array de {key, value, value_json} para objeto
    const config: Record<string, unknown> = {};
    data?.forEach((item) => {
        config[item.key] = item.value_json || item.value;
    });

    return NextResponse.json({ config, raw: data });
}

// PUT /api/admin/config — Salvar configurações
export async function PUT(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const body = await request.json();
    const { configs } = body; // Array de { key, value?, value_json? }

    if (!Array.isArray(configs)) {
        return NextResponse.json({ error: 'configs deve ser um array' }, { status: 400 });
    }

    const results = [];
    for (const item of configs) {
        const { key, value, value_json } = item;

        const { data, error } = await supabase
            .from('platform_config')
            .upsert(
                {
                    key,
                    value: value || null,
                    value_json: value_json || null,
                },
                { onConflict: 'key' }
            )
            .select()
            .single();

        if (error) {
            results.push({ key, error: error.message });
        } else {
            results.push({ key, success: true, data });
        }
    }

    return NextResponse.json({ results });
}
