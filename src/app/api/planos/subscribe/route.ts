import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// POST /api/planos/subscribe — Subscribe to a plan or upgrade
export async function POST(request: NextRequest) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { planId, billing = 'monthly' } = await request.json();

    if (!planId) {
        return NextResponse.json({ error: 'planId é obrigatório' }, { status: 400 });
    }

    // Fetch the target plan
    const { data: plan, error: planErr } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .eq('is_active', true)
        .single();

    if (planErr || !plan) {
        return NextResponse.json({ error: 'Plano não encontrado ou inativo' }, { status: 404 });
    }

    const price = billing === 'yearly' ? plan.price_yearly : plan.price_monthly;
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + (billing === 'yearly' ? 365 : 30));

    // Check if user already has an active subscription
    const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .in('status', ['ativo', 'trial'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    let subscription;

    if (existingSub) {
        // Update existing subscription (upgrade/downgrade)
        const { data: updated, error: updateErr } = await supabase
            .from('subscriptions')
            .update({
                plan_id: planId,
                plan_type: billing,
                monthly_value: price,
                status: 'ativo',
                start_date: now.toISOString(),
                end_date: endDate.toISOString(),
            })
            .eq('id', existingSub.id)
            .select()
            .single();

        if (updateErr) {
            return NextResponse.json({ error: updateErr.message }, { status: 500 });
        }
        subscription = updated;
    } else {
        // Create new subscription
        const { data: created, error: createErr } = await supabase
            .from('subscriptions')
            .insert({
                user_id: user.id,
                plan_id: planId,
                plan_type: billing,
                monthly_value: price,
                status: 'ativo',
                start_date: now.toISOString(),
                end_date: endDate.toISOString(),
            })
            .select()
            .single();

        if (createErr) {
            return NextResponse.json({ error: createErr.message }, { status: 500 });
        }
        subscription = created;
    }

    // Update user's credits based on the plan
    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + 30);

    await supabase
        .from('profiles')
        .update({
            credits_total: plan.credits_quota < 0 ? 999999 : plan.credits_quota,
            credits_available: plan.credits_quota < 0 ? 999999 : plan.credits_quota,
            credits_renewal_date: renewalDate.toISOString(),
            role: plan.tier === 'enterprise' ? 'premium' : (plan.tier === 'pro' ? 'premium' : 'cliente'),
        })
        .eq('id', user.id);

    return NextResponse.json({ subscription, plan });
}

// DELETE /api/planos/subscribe — Cancel subscription
export async function DELETE() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { data: sub, error: subErr } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .in('status', ['ativo', 'trial'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (subErr || !sub) {
        return NextResponse.json({ error: 'Nenhuma assinatura ativa encontrada' }, { status: 404 });
    }

    const { error: cancelErr } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelado' })
        .eq('id', sub.id);

    if (cancelErr) {
        return NextResponse.json({ error: cancelErr.message }, { status: 500 });
    }

    // Reset credits to free tier
    await supabase
        .from('profiles')
        .update({
            credits_total: 2000,
            credits_available: 2000,
            role: 'cliente',
        })
        .eq('id', user.id);

    return NextResponse.json({ success: true, message: 'Assinatura cancelada com sucesso' });
}
