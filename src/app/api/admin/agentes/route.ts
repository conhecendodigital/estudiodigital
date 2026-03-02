import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// GET /api/admin/agentes — Listar agentes
export async function GET(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    let query = supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

    if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agents: data });
}

// POST /api/admin/agentes — Criar agente
export async function POST(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase, user } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>>; user: { id: string } };

    const body = await request.json();
    const {
        name,
        description,
        category,
        ai_provider,
        ai_model,
        system_prompt,
        temperature = 0.7,
        max_tokens = 4096,
        icon,
        icon_gradient,
        status = 'ativo',
        is_global = true,
        required_plan_slug,
        is_locked = false,
    } = body;

    if (!name) {
        return NextResponse.json({ error: 'Nome do agente é obrigatório' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('agents')
        .insert({
            name,
            description,
            category,
            ai_provider,
            ai_model,
            system_prompt,
            temperature,
            max_tokens,
            icon,
            icon_gradient,
            status,
            is_global,
            required_plan_slug,
            is_locked,
            created_by: user.id,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agent: data }, { status: 201 });
}
