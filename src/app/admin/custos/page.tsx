'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

/* ── Types ── */
interface AgentCost {
    name: string;
    model: string;
    requests: number;
    tokens: string;
    cost: number;
    usage_pct: number;
    icon: string;
    iconBg: string;
    iconColor: string;
}

interface TopUser {
    name: string;
    tokens: string;
    cost: number;
    avatar_url?: string;
    online: boolean;
}

export default function MonitoramentoCustosAdminPage() {
    const [period, setPeriod] = useState('30d');
    const [kpis, setKpis] = useState({ total_cost: 0, total_requests: 0, cost_per_user: 0, margin: 0 });
    const [agents, setAgents] = useState<AgentCost[]>([]);
    const [topUsers, setTopUsers] = useState<TopUser[]>([]);
    const [chartData, setChartData] = useState<{ date: string; cost: number; }[]>([
        { date: '...', cost: 0 }
    ]);

    useEffect(() => {
        fetch(`/api/admin/custos?period=${period}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.kpis) setKpis(data.kpis);
                if (data.consumption_by_agent) {
                    const icons = ['support_agent', 'point_of_sale', 'code', 'campaign', 'psychology'];
                    const colors = [
                        { bg: 'bg-primary/20', color: 'text-primary' },
                        { bg: 'bg-emerald-500/20', color: 'text-emerald-400' },
                        { bg: 'bg-indigo-500/20', color: 'text-indigo-400' },
                        { bg: 'bg-pink-500/20', color: 'text-pink-400' },
                        { bg: 'bg-amber-500/20', color: 'text-amber-400' },
                    ];
                    setAgents(
                        (data.consumption_by_agent as Array<Record<string, unknown>>).map((a, i) => ({
                            name: (a.name as string) || `Agente ${i + 1}`,
                            model: (a.model as string) || '—',
                            requests: Number(a.requests || 0),
                            tokens: `${(Number(a.total_tokens || 0) / 1_000_000).toFixed(1)}M`,
                            cost: Number(a.total_cost || 0),
                            usage_pct: Math.min(100, Math.round((Number(a.total_cost || 0) / Math.max(1, data.kpis.total_cost)) * 100)),
                            icon: icons[i % icons.length],
                            iconBg: colors[i % colors.length].bg,
                            iconColor: colors[i % colors.length].color,
                        }))
                    );
                }
                if (data.top_users) {
                    setTopUsers(
                        (data.top_users as Array<Record<string, unknown>>).map((u) => ({
                            name: (u.full_name as string) || 'Usuário',
                            tokens: `${(Number(u.total_tokens || 0) / 1000).toFixed(0)}k Tks`,
                            cost: Number(u.total_cost || 0),
                            avatar_url: (u.avatar_url as string) || undefined,
                            online: true,
                        }))
                    );
                }
                if (data.chartData) {
                    setChartData(data.chartData);
                }
            })
            .catch(() => { });
    }, [period]);

    // Chart SVG Calculations
    const maxCost = Math.max(...chartData.map(d => d.cost), 1); // fallback to 1 to avoid div by zero
    const chartW = 1000;
    const chartH = 150; // Use 150 of the 200px viewBox height
    const startY = 180; // Baseline

    // Generate SVG path dynamically
    let pathD = '';
    let fillD = '';
    if (chartData.length > 0) {
        const points = chartData.map((d, i) => {
            const x = (i / (chartData.length - 1)) * chartW;
            const y = startY - (d.cost / maxCost) * chartH;
            return { x, y };
        });

        // Simple linear interpolation
        pathD = `M${points[0].x},${points[0].y} ` + points.slice(1).map(p => `L${p.x},${p.y}`).join(' ');

        // Closed path for the gradient
        fillD = `${pathD} L${chartW},200 L0,200 Z`;
    }

    const periodButtons = [
        { value: '1d', label: 'Hoje' },
        { value: '7d', label: '7 dias' },
        { value: '30d', label: '30 dias' },
    ];

    return (
        <div className="flex min-h-screen bg-background-dark font-display text-slate-100">
            <AdminSidebar />

            <main className="flex-1 ml-72 p-6 md:p-10 relative z-10 w-full min-h-screen overflow-x-hidden mb-[80px] lg:mb-0">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Monitoramento Financeiro</h2>
                        <p className="text-slate-400 text-sm md:text-base">Visão geral do consumo de tokens e infraestrutura.</p>
                    </div>

                    {/* Time Filters */}
                    <div className="flex flex-wrap items-center gap-2 bg-slate-800/40 p-1.5 rounded-full border border-slate-700/50 backdrop-blur-md w-full md:w-auto">
                        {periodButtons.map((p) => (
                            <button
                                key={p.value}
                                onClick={() => setPeriod(p.value)}
                                className={`flex-1 md:flex-none px-4 md:px-5 py-2 text-xs font-bold rounded-full transition-all ${period === p.value ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'font-medium text-slate-400 hover:text-white'}`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </header>

                {/* KPI Row (4 Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Custo Total */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Custo Total</p>
                            <h3 className="text-2xl font-bold text-white tracking-tight">$ {kpis.total_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                                <span className="material-symbols-outlined text-xs">trending_up</span> +12%
                            </span>
                            <span className="text-xs text-slate-500">vs. mês anterior</span>
                        </div>
                    </div>

                    {/* Requisições */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Requisições</p>
                            <h3 className="text-2xl font-bold text-white tracking-tight">{kpis.total_requests >= 1000 ? `${(kpis.total_requests / 1000).toFixed(0)}k` : kpis.total_requests}</h3>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold">
                                <span className="material-symbols-outlined text-xs">trending_down</span> -3%
                            </span>
                            <span className="text-xs text-slate-500">vs. ontem</span>
                        </div>
                    </div>

                    {/* Custo por Conta */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Custo por Conta</p>
                            <h3 className="text-2xl font-mono font-medium text-white tracking-tight">$ {kpis.cost_per_user.toFixed(2)}</h3>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">Estável</span>
                        </div>
                    </div>

                    {/* Margem Estimada */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-20 -mr-16 -mt-16 group-hover:opacity-40 transition-opacity" style={{ background: 'linear-gradient(135deg, #6d51fb 0%, #00f5ff 100%)' }}></div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-slate-400 mb-1">Margem Estimada</p>
                            <h3 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #6d51fb 0%, #00f5ff 100%)' }}>{kpis.margin}%</h3>
                        </div>
                        <div className="mt-4 flex items-center gap-2 relative z-10">
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div className="h-1.5 rounded-full" style={{ width: `${kpis.margin}%`, background: 'linear-gradient(135deg, #6d51fb 0%, #00f5ff 100%)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Chart Section (static SVG chart) */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 mb-8 border-t-2 border-t-primary/40 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h4 className="text-xl font-bold text-white">Custo Diário</h4>
                            <p className="text-sm text-slate-400">Análise temporal de gastos de infraestrutura.</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-400 bg-black/20 px-4 py-2 rounded-full border border-white/5">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-primary"></span> Atual
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-slate-600"></span> Projetado
                            </div>
                        </div>
                    </div>
                    <div className="h-[200px] md:h-[300px] w-full relative">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#6d51fb" stopOpacity="0.5"></stop>
                                    <stop offset="100%" stopColor="#00f5ff" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            {chartData.length > 1 && (
                                <>
                                    <path d={fillD} fill="url(#chartGradient)"></path>
                                    <path d={pathD} fill="none" stroke="#6d51fb" strokeLinecap="round" strokeWidth="3"></path>
                                    <circle cx="1000" cy={startY - (chartData[chartData.length - 1].cost / maxCost) * chartH} fill="#6d51fb" r="6"></circle>
                                    <circle cx="1000" cy={startY - (chartData[chartData.length - 1].cost / maxCost) * chartH} fill="#6d51fb" fillOpacity="0.3" r="12" className="animate-pulse"></circle>
                                </>
                            )}
                        </svg>
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pt-4 border-t border-slate-800 text-[9px] md:text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                            {chartData.map((d, i) => {
                                // hide some elements on mobile if there are too many points
                                const isHiddenOnMobile = chartData.length > 7 && i % 2 !== 0 && i !== 0 && i !== chartData.length - 1;
                                return (
                                    <span key={i} className={isHiddenOnMobile ? "hidden sm:inline" : ""}>
                                        {d.date}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                    {/* Consumo por Agente Table */}
                    <div className="lg:col-span-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-lg font-bold text-white">Consumo por Agente</h4>
                            <button className="text-sm text-primary font-medium hover:underline">Ver todos</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[700px]">
                                <thead>
                                    <tr className="text-[11px] uppercase tracking-widest text-slate-500 border-b border-white/10">
                                        <th className="pb-4 font-bold px-2">Agente</th>
                                        <th className="pb-4 font-bold px-2">Modelo</th>
                                        <th className="pb-4 font-bold px-2">Requisições</th>
                                        <th className="pb-4 font-bold text-right px-2">Tokens</th>
                                        <th className="pb-4 font-bold text-right px-2">Custo</th>
                                        <th className="pb-4 font-bold w-[120px] px-2 text-center">% Uso</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-white/5">
                                    {agents.length === 0 && (
                                        <tr><td colSpan={6} className="py-8 text-center text-slate-500">Nenhum dado de consumo encontrado.</td></tr>
                                    )}
                                    {agents.map((agent, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="py-4 font-semibold text-slate-200 px-2 flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg ${agent.iconBg} ${agent.iconColor} flex items-center justify-center border border-current/20`}>
                                                    <span className="material-symbols-outlined text-[16px]">{agent.icon}</span>
                                                </div>
                                                {agent.name}
                                            </td>
                                            <td className="py-4 px-2">
                                                <span className="px-2 py-1 rounded-md bg-white/5 text-slate-300 text-[10px] font-mono border border-white/10 uppercase tracking-widest">{agent.model}</span>
                                            </td>
                                            <td className="py-4 text-slate-400 px-2">{agent.requests.toLocaleString()}</td>
                                            <td className="py-4 font-mono text-slate-400 text-right px-2">{agent.tokens}</td>
                                            <td className="py-4 font-bold text-white text-right px-2">$ {agent.cost.toFixed(2)}</td>
                                            <td className="py-4 px-2">
                                                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                    <div className="h-1.5 rounded-full" style={{ width: `${agent.usage_pct}%`, background: 'linear-gradient(135deg, #6d51fb 0%, #00f5ff 100%)' }}></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top 5 Contas */}
                    <div className="lg:col-span-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-lg font-bold text-white">Top 5 Contas</h4>
                            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined text-slate-500 text-[20px]">more_vert</span>
                            </button>
                        </div>

                        <div className="space-y-4 flex-1">
                            {topUsers.length === 0 && (
                                <p className="text-sm text-slate-500 text-center py-4">Nenhum dado.</p>
                            )}
                            {topUsers.map((user, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/40 to-purple-500/40 border border-primary/30 flex items-center justify-center text-sm font-bold text-white">
                                                {user.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 ${user.online ? 'bg-emerald-500' : 'bg-slate-500'} border-2 border-background-dark rounded-full`}></div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-100 group-hover:text-primary transition-colors">{user.name}</p>
                                            <p className="text-[10px] text-slate-500 font-mono tracking-wider">{user.tokens}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-white bg-black/30 px-2 py-1 rounded-md">$ {user.cost.toFixed(1)}</p>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-4 py-3 bg-[rgba(255,255,255,0.02)] border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                            Relatório Completo
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
