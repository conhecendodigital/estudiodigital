import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// Helper to format date as DD/MM
function formatShortDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
}

// GET /api/admin/requisicoes — Logs de requisições de IA
export async function GET(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'overview'; // 'overview', 'metrics', 'alerts'
    const status = searchParams.get('status') || ''; // 'ok', 'error', 'rate_limit'
    const model = searchParams.get('model') || '';
    const limit = Math.min(Number(searchParams.get('limit') || 50), 200);

    // ────────────────────────────────────────────────────────────
    // TAB: ALERTS
    // ────────────────────────────────────────────────────────────
    if (tab === 'alerts') {
        const { data: alertsData, error: alertsError } = await supabase
            .from('api_logs')
            .select(`
                id, provider, model, tokens_input, tokens_output, estimated_cost,
                status_code, latency_ms, error_message, created_at,
                agents (name, icon),
                profiles (full_name)
            `)
            .gte('status_code', 400)
            .order('created_at', { ascending: false })
            .limit(100);

        if (alertsError) return NextResponse.json({ error: alertsError.message }, { status: 500 });
        return NextResponse.json({ alerts: alertsData || [] });
    }

    // ────────────────────────────────────────────────────────────
    // TAB: METRICS
    // ────────────────────────────────────────────────────────────
    if (tab === 'metrics') {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - 14);

        const { data: metricsData, error: metricsError } = await supabase
            .from('api_logs')
            .select('created_at, status_code, latency_ms')
            .gte('created_at', dateLimit.toISOString())
            .order('created_at', { ascending: true }); // chronological

        if (metricsError) return NextResponse.json({ error: metricsError.message }, { status: 500 });

        const aggMap: Record<string, { date: string, rawDate: Date, volume: number, errors: number, latencySum: number }> = {};

        // Populate last 14 days baseline
        for (let i = 13; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
            aggMap[key] = { date: formatShortDate(d.toISOString()), rawDate: d, volume: 0, errors: 0, latencySum: 0 };
        }

        // Aggregate data
        (metricsData || []).forEach(log => {
            const d = new Date(log.created_at);
            const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

            if (aggMap[key]) {
                aggMap[key].volume += 1;
                if ((log.status_code || 200) >= 400) aggMap[key].errors += 1;
                aggMap[key].latencySum += (log.latency_ms || 0);
            }
        });

        // Convert to array
        const chartData = Object.values(aggMap).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime()).map(item => ({
            date: item.date,
            volume: item.volume,
            errors: item.errors,
            avgLatency: item.volume > 0 ? Math.round(item.latencySum / item.volume) : 0,
            successRate: item.volume > 0 ? Math.round(((item.volume - item.errors) / item.volume) * 100) : 100
        }));

        return NextResponse.json({ chartData });
    }

    // ────────────────────────────────────────────────────────────
    // TAB: OVERVIEW (Default)
    // ────────────────────────────────────────────────────────────
    let query = supabase
        .from('api_logs')
        .select(`
            id, provider, model, tokens_input, tokens_output, estimated_cost,
            status_code, latency_ms, error_message, created_at,
            agents (name, icon),
            profiles (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (status) {
        switch (status) {
            case 'ok': query = query.eq('status_code', 200); break;
            case 'error': query = query.gte('status_code', 500); break;
            case 'rate_limit': query = query.eq('status_code', 429); break;
        }
    }

    if (model) {
        query = query.eq('model', model);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const logs = data || [];

    // KPIs
    let fallbackLatency = 0;

    // Quick overall KPI calculation
    const overallQuery = await supabase.from('api_logs').select('status_code, latency_ms');
    const allLogs = overallQuery.data || [];
    const totalEver = allLogs.length;

    if (totalEver > 0) {
        fallbackLatency = allLogs.reduce((sum, l) => sum + (l.latency_ms || 0), 0) / totalEver;
    }

    const errorRate = totalEver > 0
        ? (allLogs.filter((l) => (l.status_code || 200) >= 400).length / totalEver * 100)
        : 0;

    return NextResponse.json({
        kpis: {
            total_requests: totalEver,
            avg_latency_ms: Math.round(fallbackLatency),
            error_rate: Number(errorRate.toFixed(1)),
        },
        logs,
    });
}
