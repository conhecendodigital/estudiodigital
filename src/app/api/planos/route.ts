import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/planos — List active plans (public) + user's current subscription
export async function GET() {
    const supabase = await createClient();

    // Get active plans
    const { data: plans, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Try to get current user's subscription (if logged in)
    let currentSubscription = null;
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data: sub } = await supabase
            .from('subscriptions')
            .select('id, status, plan_type, monthly_value, start_date, end_date, plan_id, plans(name, slug, tier)')
            .eq('user_id', user.id)
            .in('status', ['ativo', 'trial'])
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        currentSubscription = sub;
    }

    return NextResponse.json({ plans: plans || [], currentSubscription });
}
