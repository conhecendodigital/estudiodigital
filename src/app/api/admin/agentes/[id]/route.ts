import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// GET /api/admin/agentes/[id] — Buscar agente por ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { id } = await params;

    const { data: agent, error } = await supabase
        .from('agents')
        .select('*, agent_files(*)')
        .eq('id', id)
        .single();

    if (error || !agent) {
        return NextResponse.json({ error: 'Agente não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ agent });
}

// PUT /api/admin/agentes/[id] — Atualizar agente
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { id } = await params;
    const body = await request.json();

    // Campos atualizáveis
    const updateData: Record<string, unknown> = {};
    const allowedFields = [
        'name', 'description', 'category', 'ai_provider', 'ai_model',
        'system_prompt', 'temperature', 'max_tokens', 'icon', 'icon_gradient',
        'avatar_url', 'status', 'version', 'is_global', 'required_plan_slug', 'is_locked',
    ];

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            updateData[field] = body[field];
        }
    }

    const { data, error } = await supabase
        .from('agents')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agent: data });
}

// DELETE /api/admin/agentes/[id] — Deletar agente
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { id } = await params;

    const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}

// PATCH /api/admin/agentes/[id] — Toggle status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
        .from('agents')
        .update({ status: body.status })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agent: data });
}
