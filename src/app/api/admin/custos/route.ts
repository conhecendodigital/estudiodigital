import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// GET /api/admin/custos — Monitoramento financeiro de IA (tokens/custos)
export async function GET(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    const now = new Date();
    let startDate: Date;
    let daysToFetch = 30;
    switch (period) {
        case '1d':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            daysToFetch = 1;
            break;
        case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            daysToFetch = 7;
            break;
        default:
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            daysToFetch = 30;
    }

    // Logs no período
    const { data: logs, error } = await supabase
        .from('api_logs')
        .select(`
            id, provider, model, tokens_input, tokens_output, estimated_cost,
            status_code, latency_ms, created_at,
            agents (name, icon),
            profiles (full_name, email, avatar_url)
        `)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const allLogs = logs || [];

    // KPIs
    const totalCost = allLogs.reduce((sum, l) => sum + (Number(l.estimated_cost) || 0), 0);
    const totalRequests = allLogs.length;

    // Consumo por agente
    const agentConsumption: Record<string, {
        name: string;
        model: string;
        requests: number;
        total_tokens: number;
        total_cost: number;
    }> = {};

    for (const log of allLogs) {
        const agentName = (log.agents as unknown as { name: string } | null)?.name || 'Sem Agente';
        if (!agentConsumption[agentName]) {
            agentConsumption[agentName] = {
                name: agentName,
                model: log.model,
                requests: 0,
                total_tokens: 0,
                total_cost: 0,
            };
        }
        agentConsumption[agentName].requests += 1;
        agentConsumption[agentName].total_tokens += (log.tokens_input || 0) + (log.tokens_output || 0);
        agentConsumption[agentName].total_cost += Number(log.estimated_cost) || 0;
    }

    // Top 5 contas por consumo
    const userConsumption: Record<string, {
        full_name: string;
        avatar_url: string | null;
        total_tokens: number;
        total_cost: number;
    }> = {};

    for (const log of allLogs) {
        const profile = log.profiles as unknown as { full_name: string, avatar_url: string | null } | null;
        const userName = profile?.full_name || 'Desconhecido';
        if (!userConsumption[userName]) {
            userConsumption[userName] = {
                full_name: userName,
                avatar_url: profile?.avatar_url || null,
                total_tokens: 0,
                total_cost: 0
            };
        }
        userConsumption[userName].total_tokens += (log.tokens_input || 0) + (log.tokens_output || 0);
        userConsumption[userName].total_cost += Number(log.estimated_cost) || 0;
    }

    const topUsers = Object.values(userConsumption)
        .sort((a, b) => b.total_cost - a.total_cost)
        .slice(0, 5);

    /* --- CHARTS AGGREGATION --- */
    const chartData = [];
    const pts = period === '1d' ? 6 : (period === '7d' ? 7 : 14); // Points granularity depending on period
    const intervalMs = (daysToFetch * 24 * 60 * 60 * 1000) / pts;
    const baseDate = new Date();

    for (let i = pts - 1; i >= 0; i--) {
        const pointDateStart = new Date(baseDate.getTime() - ((i + 1) * intervalMs));
        const pointDateEnd = new Date(baseDate.getTime() - (i * intervalMs));

        let label = '';
        if (period === '1d') {
            label = pointDateEnd.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else {
            label = pointDateEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        }

        // Calculate Cost for this interval
        let intervalCost = 0;
        allLogs?.forEach(log => {
            const logDate = new Date(log.created_at);
            if (logDate >= pointDateStart && logDate < pointDateEnd) {
                intervalCost += Number(log.estimated_cost || 0);
            }
        });

        chartData.push({
            date: label,
            cost: intervalCost
        });
    }

    return NextResponse.json({
        kpis: {
            total_cost: Number(totalCost.toFixed(2)),
            total_requests: totalRequests,
            cost_per_user: topUsers.length > 0 ? Number((totalCost / topUsers.length).toFixed(2)) : 0,
            margin: 68 // static until revenue is combined precisely
        },
        consumption_by_agent: Object.values(agentConsumption),
        top_users: topUsers,
        chartData
    });
}
