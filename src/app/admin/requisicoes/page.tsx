'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

/* ── Types ── */
interface LogEntry {
    id: string;
    created_at: string;
    provider: string;
    model: string;
    tokens_input: number;
    tokens_output: number;
    estimated_cost: number;
    status_code: number;
    latency_ms: number;
    error_message?: string;
    agents?: { name: string; icon?: string } | null;
    profiles?: { full_name: string } | null;
}

function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
}

function statusLabel(code: number) {
    if (code === 200) return { text: '200 OK', cls: 'bg-green-500/10 text-green-400 border-green-500/30' };
    if (code === 429) return { text: '429 RATE LIMIT', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/30' };
    return { text: `${code} ERROR`, cls: 'bg-red-500/10 text-red-400 border-red-500/30' };
}

function rowBg(code: number) {
    if (code === 429) return 'bg-amber-500/5 border-l-2 border-l-amber-500';
    if (code >= 400) return 'bg-red-500/10 border-l-2 border-l-red-500';
    return '';
}

export default function RequisicoesAdminPage() {
    const [currentTab, setCurrentTab] = useState('overview'); // 'overview', 'metrics', 'alerts'
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [alerts, setAlerts] = useState<LogEntry[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [kpis, setKpis] = useState({ total_requests: 0, avg_latency_ms: 0, error_rate: 0 });
    const [statusFilter, setStatusFilter] = useState('');
    const [expandedError, setExpandedError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams();
        if (currentTab !== 'overview') params.set('tab', currentTab);
        if (statusFilter && currentTab === 'overview') params.set('status', statusFilter);

        fetch(`/api/admin/requisicoes?${params.toString()}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.logs) setLogs(data.logs);
                if (data.kpis) setKpis(data.kpis);
                if (data.chartData) setChartData(data.chartData);
                if (data.alerts) setAlerts(data.alerts);
            })
            .catch(() => { });
    }, [statusFilter, currentTab]);

    const successRate = kpis.total_requests > 0 ? (100 - kpis.error_rate).toFixed(2) : '0.00';

    return (
        <div className="flex min-h-screen w-full flex-row bg-background-dark font-display text-slate-100">
            <AdminSidebar />

            <main className="flex-1 ml-72 p-6 md:p-8 relative z-10 w-full min-h-screen overflow-x-hidden mb-[80px] lg:mb-0 flex flex-col">

                {/* Header Navbar */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="font-sora font-bold text-2xl tracking-tight text-white">Telemetria do Sistema</h2>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22C55E]"></span>
                            <span className="text-[10px] font-bold text-green-500 tracking-widest uppercase">● AO VIVO</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="flex items-center gap-6 text-sm font-medium text-slate-400 whitespace-nowrap">
                            <button
                                onClick={() => setCurrentTab('overview')}
                                className={`transition-colors pb-2 ${currentTab === 'overview' ? 'text-white border-b-2 border-primary' : 'hover:text-primary'}`}
                            >Visão Geral</button>
                            <button
                                onClick={() => setCurrentTab('metrics')}
                                className={`transition-colors pb-2 ${currentTab === 'metrics' ? 'text-white border-b-2 border-primary' : 'hover:text-primary'}`}
                            >Métricas</button>
                            <button
                                onClick={() => setCurrentTab('alerts')}
                                className={`transition-colors pb-2 ${currentTab === 'alerts' ? 'text-white border-b-2 border-primary' : 'hover:text-primary'}`}
                            >Alertas</button>
                        </div>
                        <div className="hidden md:block h-6 w-px bg-white/10 mx-2"></div>
                        <button className="material-symbols-outlined text-slate-400 hover:text-white transition-colors cursor-not-allowed opacity-50" title="Sem novas notificações">notifications</button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto space-y-6">
                    {/* Content Router */}
                    {currentTab === 'overview' && (
                        <>
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg flex items-center px-3 py-2 gap-3 min-w-[160px] flex-1 sm:flex-none hover:bg-white/10 transition-colors">
                                    <span className="material-symbols-outlined text-slate-400 text-lg">rule</span>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Status HTTP</p>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="bg-transparent border-none p-0 text-sm font-medium text-white focus:ring-0 w-full cursor-pointer outline-none appearance-none"
                                        >
                                            <option className="bg-background-dark text-white" value="">Todos Status</option>
                                            <option className="bg-background-dark text-white" value="ok">200 OK</option>
                                            <option className="bg-background-dark text-white" value="rate_limit">429 Rate Limit</option>
                                            <option className="bg-background-dark text-white" value="error">500 Error</option>
                                        </select>
                                    </div>
                                </div>
                                <button className="w-full lg:w-auto bg-primary text-white font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined text-lg">download</span>
                                    Exportar Relatório
                                </button>
                            </div>

                            {/* Console Table Container */}
                            <div className="bg-[#050505] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse font-mono text-xs min-w-[900px]">
                                        <thead>
                                            <tr className="bg-white/5 border-b border-white/10">
                                                <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest">Timestamp</th>
                                                <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest">Usuário</th>
                                                <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest">Agente</th>
                                                <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest">Modelo</th>
                                                <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest text-right">Tokens</th>
                                                <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest text-right">Custo ($)</th>
                                                <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest text-right">Latência</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {logs.length === 0 && (
                                                <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-500">Nenhuma requisição encontrada.</td></tr>
                                            )}
                                            {logs.map((log) => {
                                                const st = statusLabel(log.status_code || 200);
                                                const totalTokens = (log.tokens_input || 0) + (log.tokens_output || 0);
                                                return (
                                                    <React.Fragment key={log.id}>
                                                        <tr
                                                            className={`hover:bg-white/5 transition-colors cursor-pointer ${rowBg(log.status_code || 200)}`}
                                                            onClick={() => log.error_message && setExpandedError(expandedError === log.id ? null : log.id)}
                                                        >
                                                            <td className="px-6 py-4 text-slate-400">{formatTime(log.created_at)}</td>
                                                            <td className="px-6 py-4 text-primary font-bold">{log.profiles?.full_name || '—'}</td>
                                                            <td className="px-6 py-4 text-slate-200">{log.agents?.name || '—'}</td>
                                                            <td className="px-6 py-4">
                                                                <span className="bg-white/10 border border-white/5 px-2 py-1 rounded text-white text-[10px]">{log.model}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right text-slate-400">{totalTokens}</td>
                                                            <td className="px-6 py-4 text-right text-slate-400">{(Number(log.estimated_cost) || 0).toFixed(4)}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`${st.cls} border px-2 py-1 rounded font-bold text-[10px] tracking-wider`}>{st.text}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right text-slate-400">{log.latency_ms || 0}ms</td>
                                                        </tr>
                                                        {expandedError === log.id && log.error_message && (
                                                            <tr className="bg-black/50">
                                                                <td className="px-6 py-6" colSpan={8}>
                                                                    <div className="bg-[#0A0A14] rounded-xl border border-red-500/20 p-6 overflow-hidden">
                                                                        <div className="flex items-center gap-2 mb-4">
                                                                            <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                                                                            <h4 className="text-slate-100 font-bold text-sm">Detalhes do Erro</h4>
                                                                        </div>
                                                                        <pre className="text-[12px] leading-relaxed overflow-x-auto p-4 bg-black rounded-lg border border-white/5 text-slate-300 font-mono whitespace-pre-wrap">
                                                                            {log.error_message}
                                                                        </pre>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                                    <p>Exibindo últimos {logs.length} registros</p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* METRICS TAB */}
                    {currentTab === 'metrics' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Volume Chart */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="font-sora font-bold text-white mb-1">Volume de Requisições</h3>
                                            <p className="text-sm text-slate-400">Tráfego diário dos últimos 14 dias</p>
                                        </div>
                                    </div>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                                <Area type="monotone" dataKey="volume" name="Chamadas" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVol)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Latency Chart */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="font-sora font-bold text-white mb-1">Latência Média</h3>
                                            <p className="text-sm text-slate-400">Tempo de resposta em milissegundos</p>
                                        </div>
                                    </div>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                                <Area type="monotone" dataKey="avgLatency" name="Latência (ms)" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorLat)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Errors Chart */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:col-span-2">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="font-sora font-bold text-white mb-1">Falhas Críticas / Taxa de Retenção</h3>
                                            <p className="text-sm text-slate-400">Contagem de erros diários (Status 4xx e 5xx)</p>
                                        </div>
                                    </div>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                                    itemStyle={{ color: '#ef4444' }}
                                                    cursor={{ fill: '#ffffff05' }}
                                                />
                                                <Bar dataKey="errors" name="Erros Diários" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ALERTS TAB */}
                    {currentTab === 'alerts' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-[#100505] rounded-2xl border border-red-500/20 overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.05)]">
                                <div className="p-6 border-b border-red-500/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                            <span className="material-symbols-outlined text-red-500">warning</span>
                                        </div>
                                        <div>
                                            <h3 className="font-sora font-bold text-red-400 mb-1">Incidentes Críticos</h3>
                                            <p className="text-sm text-red-500/70">Acompanhamento das últimas requisições que retornaram erro (4xx/5xx).</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="divide-y divide-red-500/10">
                                    {alerts.length === 0 ? (
                                        <div className="p-12 text-center text-slate-500">
                                            Nenhum alerta recente. A infraestrutura está saudável.
                                        </div>
                                    ) : alerts.map((alert) => {
                                        const st = statusLabel(alert.status_code || 500);
                                        return (
                                            <div key={alert.id} className="p-6 hover:bg-black/20 transition-colors">
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <span className={`${st.cls} border px-2 py-1 rounded font-bold text-[10px] tracking-wider`}>{st.text}</span>
                                                            <span className="text-xs text-slate-400 font-mono">{formatTime(alert.created_at)}</span>
                                                            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] text-white">Modelo: {alert.model || 'Desconhecido'}</span>
                                                        </div>
                                                        <div className="bg-black/60 rounded-xl border border-red-500/20 p-4">
                                                            <pre className="text-xs text-red-300/80 font-mono whitespace-pre-wrap break-all leading-relaxed">
                                                                {alert.error_message || 'Erro não especificado no payload de resposta.'}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                    <div className="md:w-[250px] shrink-0 bg-black/40 rounded-xl p-4 border border-white/5 space-y-3">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Afetado</p>
                                                            <p className="text-sm text-white font-medium">{alert.profiles?.full_name || 'Usuário Anônimo'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Agente</p>
                                                            <p className="text-sm text-slate-300">{alert.agents?.name || 'Agente Genérico'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Stats Grid - Only show in Overview */}
                    {currentTab === 'overview' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 pb-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Taxa de Sucesso</p>
                                <div className="flex items-end gap-3">
                                    <h3 className="text-2xl font-bold text-white">{successRate}%</h3>
                                </div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Taxa de Erro</p>
                                <div className="flex items-end gap-3">
                                    <h3 className="text-2xl font-bold text-white">{kpis.error_rate}%</h3>
                                </div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Latência Média</p>
                                <div className="flex items-end gap-3">
                                    <h3 className="text-2xl font-bold text-white">{kpis.avg_latency_ms}ms</h3>
                                </div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Total Requisições</p>
                                <div className="flex items-end gap-3">
                                    <h3 className="text-2xl font-bold text-white">{kpis.total_requests.toLocaleString()}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
