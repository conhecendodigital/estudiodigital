import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// GET /api/admin/planos — Listar planos
export async function GET() {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('sort_order');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ plans: data });
}

// PUT /api/admin/planos — Atualizar plano
export async function PUT(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
        return NextResponse.json({ error: 'ID do plano é obrigatório' }, { status: 400 });
    }

    const allowedFields = [
        'name', 'slug', 'tier', 'description',
        'price_monthly', 'price_yearly', 'credits_quota',
        'features', 'is_active', 'is_popular', 'sort_order',
        'max_webhooks', 'api_access', 'white_label',
    ];

    const filtered: Record<string, unknown> = {};
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            filtered[field] = updateData[field];
        }
    }

    const { data, error } = await supabase
        .from('plans')
        .update(filtered)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ plan: data });
}

// POST /api/admin/planos — Criar novo plano
export async function POST(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const body = await request.json();

    const allowedFields = [
        'name', 'slug', 'tier', 'description',
        'price_monthly', 'price_yearly', 'credits_quota',
        'features', 'is_active', 'is_popular', 'sort_order',
        'max_webhooks', 'api_access', 'white_label',
    ];

    const filtered: Record<string, unknown> = {};
    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            filtered[field] = body[field];
        }
    }

    // Default some required fields if they are missing
    if (!filtered.name) return NextResponse.json({ error: 'Nome do plano é obrigatório' }, { status: 400 });
    if (!filtered.slug) return NextResponse.json({ error: 'Slug do plano é obrigatório' }, { status: 400 });

    const { data, error } = await supabase
        .from('plans')
        .insert(filtered)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ plan: data });
}
