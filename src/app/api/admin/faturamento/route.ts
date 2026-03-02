import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// GET /api/admin/faturamento — Transações + KPIs financeiros
export async function GET(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    // Calcular data de início baseada no período
    const now = new Date();
    let startDate: Date;
    let daysToFetch = 30;
    switch (period) {
        case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            daysToFetch = 7;
            break;
        case '90d':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            daysToFetch = 90;
            break;
        case '12m':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            daysToFetch = 12; // Will group by month for 12m, but keeping simple for now
            break;
        default:
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            daysToFetch = 30;
    }

    // Subscriptions no período (como "transações")
    const { data: subs } = await supabase
        .from('subscriptions')
        .select(`
            id, status, plan_type, monthly_value, start_date, created_at, gateway,
            profiles (full_name, email, avatar_url),
            plans (name, slug)
        `)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

    // KPIs
    const { data: allActiveSubs } = await supabase
        .from('subscriptions')
        .select('monthly_value')
        .eq('status', 'ativo');

    const mrr = allActiveSubs?.reduce((sum, s) => sum + (Number(s.monthly_value) || 0), 0) || 0;
    const ticketMedio = allActiveSubs?.length
        ? mrr / allActiveSubs.length
        : 0;

    const { count: totalSubs } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true });

    const { count: cancelledCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'cancelado');

    const churnRate = totalSubs
        ? ((cancelledCount || 0) / totalSubs * 100).toFixed(1)
        : '0';

    /* --- CHARTS AGGREGATION --- */
    // Generate daily chart points for the selected period
    const chartData = [];
    const pts = period === '12m' ? 12 : (period === '7d' ? 7 : (period === '90d' ? 12 : 14)); // Simplified points count depending on period for UI aesthetics
    const intervalDays = period === '12m' ? 30 : (daysToFetch / pts);

    for (let i = pts - 1; i >= 0; i--) {
        const pointDateStart = new Date(now.getTime() - ((i + 1) * intervalDays) * 24 * 60 * 60 * 1000);
        const pointDateEnd = new Date(now.getTime() - (i * intervalDays) * 24 * 60 * 60 * 1000);

        const label = period === '12m'
            ? pointDateEnd.toLocaleString('pt-BR', { month: 'short' })
            : pointDateEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

        // Calculate Revenue for this interval slice
        let intervalGross = 0;
        subs?.forEach(sub => {
            const subDate = new Date(sub.created_at || sub.start_date || new Date());
            if (subDate >= pointDateStart && subDate < pointDateEnd) {
                intervalGross += Number(sub.monthly_value || 0);
            }
        });

        // Simulating net revenue (85% of gross to account for taxes/fees)
        const intervalNet = intervalGross * 0.85;

        chartData.push({
            date: label,
            gross: intervalGross,
            net: intervalNet
        });
    }

    return NextResponse.json({
        transactions: subs || [],
        kpis: {
            mrr,
            ticket_medio: Number(ticketMedio.toFixed(2)),
            total_assinantes: totalSubs || 0,
            churn_rate: Number(churnRate),
        },
        chartData
    });
}
