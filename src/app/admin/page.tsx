'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';

/* ── Types ── */
interface KPIItem {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: string;
    iconBg: string;
    iconColor: string;
    sparkline: number[];
    sparkColor: string;
    subtitle?: string;
}

interface ActivityItem {
    name: string;
    email: string;
    initials: string;
    gradient: string;
    status: string;
    plan: string;
    value: string;
    time: string;
    avatar: string | null;
}

/* ── Defaults (visual fallback enquanto carrega) ── */
const defaultSparklines = {
    faturamento: [0, 0, 0, 0, 0, 0, 0, 0],
    alunos: [0, 0, 0, 0, 0, 0, 0, 0],
    churn: [0, 0, 0, 0, 0, 0, 0, 0],
    mrr: [0, 0, 0, 0, 0, 0, 0, 0],
};

const gradients = [
    'from-primary to-purple-600', 'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600', 'from-emerald-500 to-teal-600',
    'from-blue-500 to-cyan-600', 'from-violet-500 to-fuchsia-600',
];

/* ── Helper: Sparkline SVG ── */
function Sparkline({ data, color, width = 80, height = 32 }: { data: number[]; color: string; width?: number; height?: number }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `0,${height} ${points} ${width},${height}`;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            <defs>
                <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={areaPoints} fill={`url(#spark-${color.replace('#', '')})`} />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 4px ${color}80)` }} />
            {/* Dot on last point */}
            {(() => {
                const lastX = width;
                const lastY = height - ((data[data.length - 1] - min) / range) * (height - 4) - 2;
                return <circle cx={lastX} cy={lastY} r="3" fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />;
            })()}
        </svg>
    );
}

/* ── Helper: Status Badge ── */
function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { bg: string; text: string; border: string; dot: string; pulse: boolean }> = {
        Ativo: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500', pulse: true },
        Cancelado: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', dot: 'bg-rose-500', pulse: false },
        Inadimplente: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20', dot: 'bg-yellow-500', pulse: false },
    };
    const c = config[status] ?? config.Ativo;
    return (
        <span className={`inline-flex items-center gap-1.5 ${c.bg} ${c.text} border ${c.border} px-2.5 py-1 rounded-full text-xs font-bold`}>
            <span className={`size-1.5 ${c.dot} rounded-full ${c.pulse ? 'animate-pulse' : ''}`}></span>
            {status}
        </span>
    );
}

/* ═══════════════════════════════════════════
   ADMIN DASHBOARD PAGE
   ═══════════════════════════════════════════ */
export default function AdminDashboard() {
    const [kpiData, setKpiData] = useState<KPIItem[]>([
        { label: 'Faturamento Mensal', value: '...', change: '—', trend: 'up', icon: 'payments', iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-400', sparkline: defaultSparklines.faturamento, sparkColor: '#34d399' },
        { label: 'Alunos Ativos', value: '...', change: '—', trend: 'up', icon: 'group', iconBg: 'bg-primary/20', iconColor: 'text-primary', sparkline: defaultSparklines.alunos, sparkColor: '#7b61ff' },
        { label: 'Taxa de Churn', value: '...', change: '—', trend: 'down', icon: 'person_off', iconBg: 'bg-rose-500/20', iconColor: 'text-rose-400', sparkline: defaultSparklines.churn, sparkColor: '#f43f5e' },
        { label: 'MRR Atual', value: '...', change: '—', trend: 'up', icon: 'attach_money', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400', sparkline: defaultSparklines.mrr, sparkColor: '#60a5fa' },
    ]);
    const [tableData, setTableData] = useState<ActivityItem[]>([]);
    const [chartData, setChartData] = useState<{ month: string, revenue: number, students: number }[]>([]);

    const [originalKpis, setOriginalKpis] = useState<any>(null);

    useEffect(() => {
        fetch('/api/admin/dashboard')
            .then((r) => r.json())
            .then((data) => {
                if (data.kpis) {
                    const k = data.kpis;
                    setOriginalKpis(k);
                    const apiSparks = k.sparklines || defaultSparklines;
                    setKpiData([
                        { label: 'Faturamento Mensal', value: `R$ ${Number(k.faturamento_mensal).toLocaleString('pt-BR')}`, change: `${k.mrr_change >= 0 ? '+' : ''}${k.mrr_change}%`, trend: k.mrr_change >= 0 ? 'up' : 'down', icon: 'payments', iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-400', sparkline: apiSparks.faturamento, sparkColor: '#34d399' },
                        { label: 'Alunos Ativos', value: String(k.alunos_ativos).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), change: `${k.alunos_change >= 0 ? '+' : ''}${k.alunos_change}%`, trend: k.alunos_change >= 0 ? 'up' : 'down', icon: 'group', iconBg: 'bg-primary/20', iconColor: 'text-primary', sparkline: apiSparks.alunos, sparkColor: '#7b61ff', subtitle: `${k.mensagens_hoje} mensagens hoje` },
                        { label: 'Taxa de Churn', value: `${k.taxa_churn}%`, change: `${k.taxa_churn}%`, trend: 'down', icon: 'person_off', iconBg: 'bg-rose-500/20', iconColor: 'text-rose-400', sparkline: apiSparks.churn, sparkColor: '#f43f5e' },
                        { label: 'MRR Atual', value: `R$ ${Number(k.mrr).toLocaleString('pt-BR')}`, change: `${k.mrr_change >= 0 ? '+' : ''}${k.mrr_change}%`, trend: k.mrr_change >= 0 ? 'up' : 'down', icon: 'attach_money', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400', sparkline: apiSparks.mrr, sparkColor: '#60a5fa' },
                    ]);
                    if (k.barChartData) {
                        setChartData(k.barChartData);
                    }
                }
                if (data.recent_activity) {
                    const activity = data.recent_activity.map((item: Record<string, unknown>, i: number) => {
                        const profile = item.profiles as Record<string, string> | null;
                        const plan = item.plans as Record<string, string> | null;
                        const name = profile?.full_name || 'Usuário';
                        const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
                        return {
                            name,
                            email: profile?.email || '',
                            initials,
                            gradient: gradients[i % gradients.length],
                            status: (item.status as string) === 'ativo' ? 'Ativo' : (item.status as string) === 'cancelado' ? 'Cancelado' : 'Inadimplente',
                            plan: plan?.name || (item.plan_type as string) || 'Plano',
                            value: `R$ ${Number(item.monthly_value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                            time: new Date(item.created_at as string).toLocaleDateString('pt-BR'),
                            avatar: profile?.avatar_url || null,
                        };
                    });
                    setTableData(activity);
                }
            })
            .catch(() => { });
    }, []);

    const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1000); // minimum scale
    const maxStudents = Math.max(...chartData.map(d => d.students), 10); // minimum scale
    const retentionRate = originalKpis ? Math.max(0, 100 - (Number(originalKpis.taxa_churn) || 0)) : 100;

    const circumference = 2 * Math.PI * 40;

    return (
        <div className="flex min-h-screen bg-background-dark font-display text-slate-100">
            <AdminSidebar />

            <main className="flex-1 ml-72 p-10 overflow-y-auto w-full relative">

                {/* ─── 1. HEADER ─── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 z-10 relative">
                    <div>
                        <h1 className="text-4xl font-bold font-sora text-white tracking-tight">Visão Geral</h1>
                        <p className="text-slate-400 mt-2 text-sm">Acompanhe as métricas e o desempenho da sua plataforma em tempo real.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href="/admin/custos" className="bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl flex items-center gap-2.5 transition-all border border-white/10 text-sm font-semibold">
                            <span className="material-symbols-outlined text-[18px]">trending_up</span>
                            Custos de IA
                        </Link>
                        <Link href="/admin/faturamento" className="bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl flex items-center gap-2.5 transition-all border border-white/10 text-sm font-semibold">
                            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                            Faturamento
                        </Link>
                        <button
                            onClick={async () => {
                                try {
                                    const res = await fetch('/api/admin/dashboard');
                                    const data = await res.json();
                                    const k = data.kpis;
                                    const now = new Date();
                                    const monthName = now.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

                                    let csv = `Relatório Mensal - ${monthName}\n\n`;
                                    csv += `MÉTRICAS PRINCIPAIS\n`;
                                    csv += `Faturamento Mensal,R$ ${Number(k.faturamento_mensal).toLocaleString('pt-BR')}\n`;
                                    csv += `MRR,R$ ${Number(k.mrr).toLocaleString('pt-BR')}\n`;
                                    csv += `Alunos Ativos,${k.alunos_ativos}\n`;
                                    csv += `Taxa de Churn,${k.taxa_churn}%\n`;
                                    csv += `Retidos,${k.retidos}\n`;
                                    csv += `Cancelados,${k.cancelados}\n`;
                                    csv += `Variação MRR,${k.mrr_change}%\n`;
                                    csv += `Variação Alunos,${k.alunos_change}%\n`;
                                    csv += `Agentes Ativos,${k.agentes_ativos}\n`;
                                    csv += `Mensagens Hoje,${k.mensagens_hoje}\n\n`;

                                    if (k.barChartData?.length) {
                                        csv += `EVOLUÇÃO MENSAL\nMês,Faturamento,Novos Alunos\n`;
                                        k.barChartData.forEach((d: any) => {
                                            csv += `${d.month},R$ ${d.revenue},${d.students}\n`;
                                        });
                                        csv += `\n`;
                                    }

                                    if (data.recent_activity?.length) {
                                        csv += `ÚLTIMAS MOVIMENTAÇÕES\nNome,Email,Status,Plano,Valor,Data\n`;
                                        data.recent_activity.forEach((item: any) => {
                                            const profile = item.profiles || {};
                                            const plan = item.plans || {};
                                            csv += `${profile.full_name || 'N/A'},${profile.email || ''},${item.status},${plan.name || item.plan_type || ''},R$ ${Number(item.monthly_value || 0).toFixed(2)},${new Date(item.created_at).toLocaleDateString('pt-BR')}\n`;
                                        });
                                    }

                                    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = `relatorio_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}.csv`;
                                    link.click();
                                    URL.revokeObjectURL(url);
                                } catch {
                                    alert('Erro ao gerar relatório. Tente novamente.');
                                }
                            }}
                            className="btn-magnetic bg-primary hover:bg-primary-dark text-white font-sora font-semibold px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all shadow-[0_0_15px_rgba(123,97,255,0.3)] hover:shadow-[0_0_30px_rgba(123,97,255,0.5)] border border-white/10"
                        >
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            Baixar Relatório Mensal
                        </button>
                    </div>
                </header>

                {/* ─── 2. KPI CARDS ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    {kpiData.map((kpi) => (
                        <div
                            key={kpi.label}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(123,97,255,0.2)] hover:border-primary/40 transition-all duration-500 group hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${kpi.iconBg} p-2.5 rounded-xl ${kpi.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="material-symbols-outlined">{kpi.icon}</span>
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${kpi.trend === 'up'
                                    ? 'text-emerald-400 bg-emerald-500/10'
                                    : 'text-rose-400 bg-rose-500/10'
                                    }`}>
                                    <span className="material-symbols-outlined text-[14px]">
                                        {kpi.trend === 'up' ? 'trending_up' : 'trending_down'}
                                    </span>
                                    {kpi.change}
                                </div>
                            </div>

                            <div className="flex items-end justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">{kpi.label}</h3>
                                    <p className="text-3xl font-bold font-sora text-white leading-none">
                                        {kpi.value}
                                    </p>
                                    {kpi.subtitle && (
                                        <span className="text-xs text-slate-500 mt-1 block">{kpi.subtitle}</span>
                                    )}
                                </div>
                                <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                                    <Sparkline data={kpi.sparkline} color={kpi.sparkColor} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── 3. CHARTS ROW ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                    {/* LEFT: Dual Bar Chart — Revenue vs New Students */}
                    <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(123,97,255,0.08)] transition-all duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-bold font-sora text-white">Evolução: Faturamento vs Novos Alunos</h3>
                            <div className="flex gap-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(123,97,255,0.5)]"></div>
                                    <span className="text-xs text-slate-400">Faturamento</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                    <span className="text-xs text-slate-400">Novos Alunos</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="relative w-full h-72">
                            {/* Y-Axis labels */}
                            <div className="absolute left-0 top-0 bottom-8 w-14 flex flex-col justify-between text-right pr-3 pointer-events-none">
                                <span className="text-[10px] text-slate-500 font-mono">{(maxRevenue / 1000).toFixed(0)}k</span>
                                <span className="text-[10px] text-slate-500 font-mono">{((maxRevenue * 0.75) / 1000).toFixed(0)}k</span>
                                <span className="text-[10px] text-slate-500 font-mono">{((maxRevenue * 0.5) / 1000).toFixed(0)}k</span>
                                <span className="text-[10px] text-slate-500 font-mono">{((maxRevenue * 0.25) / 1000).toFixed(0)}k</span>
                                <span className="text-[10px] text-slate-500 font-mono">0</span>
                            </div>

                            {/* Grid + Bars */}
                            <div className="ml-14 h-full flex flex-col">
                                {/* Grid lines */}
                                <div className="flex-1 relative flex items-end">
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                        {[0, 1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-full h-px bg-white/[0.04]"></div>
                                        ))}
                                    </div>

                                    {/* Bars */}
                                    <div className="w-full h-full flex items-end justify-around gap-2 relative z-10 pb-1">
                                        {chartData.map((d) => {
                                            const revH = (d.revenue / maxRevenue) * 100;
                                            const stuH = (d.students / maxStudents) * 100;
                                            return (
                                                <div key={d.month} className="flex-1 flex items-end justify-center gap-1.5 h-full group/bar relative">
                                                    {/* Tooltip */}
                                                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 bg-background-dark/95 border border-white/10 px-3 py-2 rounded-lg text-[11px] whitespace-nowrap shadow-xl backdrop-blur-sm z-20 pointer-events-none">
                                                        <p className="text-primary font-bold">R$ {(d.revenue / 1000).toFixed(1)}k</p>
                                                        <p className="text-emerald-400 font-bold">+{d.students} alunos</p>
                                                    </div>

                                                    {/* Revenue bar */}
                                                    <div
                                                        className="w-5 bg-gradient-to-t from-primary/60 to-primary rounded-t-md transition-all duration-500 cursor-pointer hover:from-primary/80 hover:to-primary-light hover:shadow-[0_0_12px_rgba(123,97,255,0.4)]"
                                                        style={{ height: `${Math.max(revH, 2)}%` }} /* min 2% visible height */
                                                    ></div>
                                                    {/* Students bar */}
                                                    <div
                                                        className="w-5 bg-gradient-to-t from-emerald-500/60 to-emerald-400 rounded-t-md transition-all duration-500 cursor-pointer hover:from-emerald-500/80 hover:to-emerald-300 hover:shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                                                        style={{ height: `${Math.max(stuH, 2)}%` }} /* min 2% visible height */
                                                    ></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* X-Axis */}
                                <div className="flex justify-around h-8 items-center">
                                    {chartData.map((d) => (
                                        <span key={d.month} className="text-[11px] text-slate-500 font-mono">{d.month}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Donut Chart — Retention vs Churn */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(123,97,255,0.08)] transition-all duration-500 flex flex-col items-center">
                        <h3 className="text-lg font-bold font-sora text-white w-full text-left mb-6">Retenção vs Churn</h3>

                        {/* Donut SVG */}
                        <div className="relative size-52 my-auto flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(123,97,255,0.15)]">
                                {/* Background ring */}
                                <circle
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    stroke="rgba(244, 63, 94, 0.25)"
                                    strokeWidth="12"
                                />
                                {/* Retention arc */}
                                <circle
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    stroke="url(#donutGradient)"
                                    strokeWidth="12"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference - (circumference * retentionRate / 100)}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(123,97,255,0.6))' }}
                                />
                                <defs>
                                    <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#7b61ff" />
                                        <stop offset="100%" stopColor="#9682ff" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            {/* Center */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black font-sora text-white leading-none">{retentionRate}%</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Retenção</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="w-full flex justify-between mt-6 pt-6 border-t border-white/5">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <div className="size-2 rounded-full bg-primary shadow-[0_0_6px_rgba(123,97,255,0.5)]"></div>
                                    <p className="text-[11px] text-slate-400">Retidos</p>
                                </div>
                                <p className="text-xl font-bold text-primary font-sora">{originalKpis?.retidos ?? 0}</p>
                            </div>
                            <div className="w-px bg-white/5"></div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <div className="size-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]"></div>
                                    <p className="text-[11px] text-slate-400">Cancelados</p>
                                </div>
                                <p className="text-xl font-bold text-rose-400 font-sora">{originalKpis?.cancelados ?? 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── 4. TABLE: Últimas Movimentações ─── */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:shadow-[0_0_15px_rgba(123,97,255,0.08)] transition-all duration-500">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
                            </div>
                            <h3 className="text-lg font-bold font-sora text-white">Últimas Movimentações</h3>
                        </div>
                        <Link href="/admin/faturamento" className="text-sm font-semibold text-primary hover:text-white transition-colors flex items-center gap-1.5 hover-lift">
                            Ver todas
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/20 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Plano</th>
                                    <th className="px-6 py-4">Valor</th>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {tableData.map((row) => (
                                    <tr key={row.email} className="hover:bg-white/[0.03] transition-colors duration-300 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {row.avatar ? (
                                                    <img src={row.avatar} alt={row.name} className="size-10 rounded-full border border-white/10 object-cover" />
                                                ) : (
                                                    <div className={`size-10 rounded-full bg-gradient-to-tr ${row.gradient} flex items-center justify-center font-bold text-white text-xs border border-white/10 shadow-lg`}>
                                                        {row.initials}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-white group-hover:text-primary transition-colors duration-300">{row.name}</p>
                                                    <p className="text-[11px] text-slate-500">{row.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={row.status} />
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{row.plan}</td>
                                        <td className="px-6 py-4 font-mono font-bold text-white">{row.value}</td>
                                        <td className="px-6 py-4 text-slate-500">{row.time}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-500 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all duration-300">
                                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
}
