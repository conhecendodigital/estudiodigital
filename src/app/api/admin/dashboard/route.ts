import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// GET /api/admin/dashboard — KPIs do dashboard admin
export async function GET() {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    // 1. Basic counts
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    // 2. Active Agents
    const { count: activeAgents } = await supabase.from('agents').select('*', { count: 'exact', head: true }).eq('status', 'ativo');

    // 3. Messages Today
    const todayStr = new Date().toISOString().split('T')[0];
    const { count: messagesToday } = await supabase.from('chat_messages').select('*', { count: 'exact', head: true }).gte('created_at', todayStr);

    // 4. Activity & Subscriptions
    const { data: activeSubs } = await supabase.from('subscriptions').select('monthly_value').eq('status', 'ativo');
    const mrr = activeSubs?.reduce((sum, s) => sum + (Number(s.monthly_value) || 0), 0) || 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: cancelledThisMonth } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'cancelado')
        .gte('cancelled_at', startOfMonth.toISOString());

    const totalSubs = activeSubs?.length || 1;
    const churnRate = ((cancelledThisMonth || 0) / totalSubs * 100).toFixed(1);

    const { data: recentActivity } = await supabase
        .from('subscriptions')
        .select(`
            id, status, plan_type, monthly_value, start_date, created_at,
            profiles (full_name, email, avatar_url),
            plans (name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

    /* --- CHARTS AGGREGATION --- */
    const now = new Date();

    // 5. Sparklines Data (Last 8 days)
    const sparklines = {
        faturamento: Array(8).fill(0),
        alunos: Array(8).fill(0),
        churn: Array(8).fill(0),
        mrr: Array(8).fill(0),
    };

    // Calculate daily active metrics for the sparkline (simple approach due to DB limitations)
    for (let i = 0; i < 8; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - (7 - i));
        const dayStr = d.toISOString().split('T')[0];

        // Fetch subscriptions active before or on this day
        const { data: dailySubs } = await supabase
            .from('subscriptions')
            .select('monthly_value, status, created_at, cancelled_at')
            .lte('created_at', dayStr + 'T23:59:59.999Z');

        let dailyMrr = 0;
        let dailyActive = 0;
        let dailyChurn = 0;

        dailySubs?.forEach(sub => {
            const isCancelledObj = sub.status === 'cancelado' && sub.cancelled_at && new Date(sub.cancelled_at) <= new Date(dayStr + 'T23:59:59.999Z');
            if (!isCancelledObj) {
                dailyActive++;
                dailyMrr += Number(sub.monthly_value || 0);
            } else if (sub.cancelled_at && sub.cancelled_at.startsWith(dayStr)) {
                // if cancelled on exactly this day
                dailyChurn++;
            }
        });

        sparklines.faturamento[i] = dailyMrr; // simplified: treating MRR as daily cumulative faturamento proxy
        sparklines.alunos[i] = dailyActive;
        sparklines.churn[i] = dailyChurn;
        sparklines.mrr[i] = dailyMrr;
    }

    // 6. Bar Chart Data (Last 6 Months: Revenue vs New Students)
    const barChartData = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const monthLabel = d.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
        const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

        const { data: monthSubs } = await supabase
            .from('subscriptions')
            .select('monthly_value, created_at')
            .gte('created_at', d.toISOString())
            .lt('created_at', nextMonth.toISOString());

        const monthlyRevenue = monthSubs?.reduce((sum, s) => sum + (Number(s.monthly_value) || 0), 0) || 0;
        const newStudents = monthSubs?.length || 0;

        barChartData.push({ month: capitalizedMonth, revenue: monthlyRevenue, students: newStudents });
    }

    return NextResponse.json({
        kpis: {
            faturamento_mensal: mrr,
            alunos_ativos: totalUsers || 0,
            taxa_churn: Number(churnRate),
            mrr,
            agentes_ativos: activeAgents || 0,
            mensagens_hoje: messagesToday || 0,
            sparklines,
            barChartData
        },
        recent_activity: recentActivity || [],
    });
}
