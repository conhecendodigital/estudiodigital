import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// GET /api/admin/clientes — Listar profiles + subscriptions
export async function GET(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const plan = searchParams.get('plan') || '';

    // Buscar profiles com subscription ativa
    let query = supabase
        .from('profiles')
        .select(`
            id, full_name, email, avatar_url, phone, created_at,
            subscriptions (
                id, status, plan_type, monthly_value, start_date, end_date,
                plans (name, slug)
            )
        `)
        .order('created_at', { ascending: false });

    if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: profiles, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filtrar por status/plan client-side (Supabase não filtra em relações aninhadas facilmente)
    let filtered = profiles || [];

    if (status) {
        filtered = filtered.filter((p) => {
            const subs = (p.subscriptions as Array<{ status: string }>) || [];
            return subs.some((s) => s.status === status);
        });
    }

    if (plan) {
        filtered = filtered.filter((p) => {
            const subs = (p.subscriptions as unknown as Array<{ plans: { slug: string } | null }>) || [];
            return subs.some((s) => s.plans?.slug === plan);
        });
    }

    // KPIs
    const allProfiles = profiles || [];
    const allSubs = allProfiles.flatMap(
        (p) => (p.subscriptions as Array<{ status: string }>) || []
    );

    const kpis = {
        total: allProfiles.length,
        ativos: allSubs.filter((s) => s.status === 'ativo').length,
        inadimplentes: allSubs.filter((s) => s.status === 'inadimplente').length,
        cancelados: allSubs.filter((s) => s.status === 'cancelado').length,
    };

    return NextResponse.json({ clients: filtered, kpis });
}

// PUT /api/admin/clientes — Atualizar status/plano da subscription ou admin data
export async function PUT(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const body = await request.json();
    const { id, action, status } = body;

    if (!id || !action) {
        return NextResponse.json({ error: 'ID e Action são obrigatórios' }, { status: 400 });
    }

    if (action === 'update_status') {
        // Find the active/main subscription
        const { data: subs, error: subErr } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', id)
            .order('created_at', { ascending: false })
            .limit(1);

        if (subErr || !subs?.length) return NextResponse.json({ error: 'Assinatura não encontrada' }, { status: 404 });

        const { error: updateErr } = await supabase
            .from('subscriptions')
            .update({ status: status })
            .eq('id', subs[0].id);

        if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

        return NextResponse.json({ success: true, message: 'Status atualizado com sucesso' });
    }

    return NextResponse.json({ error: 'Ação não suportada' }, { status: 400 });
}

// DELETE /api/admin/clientes — Excluir conta
export async function DELETE(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    // Nota: Em cenários reais, auth.users é gerido pelo Admin API do Supabase com service_role key.
    // Assumindo que RLS tem on delete cascade para related records (profiles, etc).
    const { error } = await supabase.auth.admin.deleteUser(id);

    // Como fallback let's hard delete from profiles if RPC auth fails due to lack of service role
    if (error) {
        const { error: profileErr } = await supabase.from('profiles').delete().eq('id', id);
        if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Usuário excluído com sucesso' });
}
