'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

/* ── Types ── */
type TransactionStatus = 'Aprovado' | 'Recusado' | 'Estornado';
type PaymentMethod = 'Cartão' | 'Pix';

interface Transaction {
    id: string;
    date: string;
    clientName: string;
    clientEmail: string;
    clientInitials: string;
    clientGradient: string;
    clientAvatar: string | null;
    plan: string;
    method: PaymentMethod;
    value: string;
    status: TransactionStatus;
}

/* ── Period Options ── */
const periodOptions = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: '12m', label: 'Últimos 12 meses' },
];

/* ── Mock KPI Data ── */
const kpiData = [
    {
        label: 'MRR',
        subtitle: 'Receita Recorrente Mensal',
        value: 'R$ 38.150',
        change: '+5.2%',
        trend: 'up' as const,
        icon: 'trending_up',
        iconBg: 'bg-primary/20',
        iconColor: 'text-primary',
        highlight: true,
    },
    {
        label: 'Receita Bruta',
        subtitle: 'Total acumulado no período',
        value: 'R$ 127.840',
        change: '+18.3%',
        trend: 'up' as const,
        icon: 'account_balance',
        iconBg: 'bg-emerald-500/20',
        iconColor: 'text-emerald-400',
        highlight: false,
    },
    {
        label: 'Ticket Médio',
        subtitle: 'ARPU por assinante',
        value: 'R$ 168,42',
        change: '+3.7%',
        trend: 'up' as const,
        icon: 'confirmation_number',
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-400',
        highlight: false,
    },
    {
        label: 'Taxa de Churn',
        subtitle: 'Cancelamentos no período',
        value: '3.4%',
        change: '-0.8%',
        trend: 'down' as const,
        icon: 'person_off',
        iconBg: 'bg-rose-500/20',
        iconColor: 'text-rose-400',
        highlight: false,
    },
];

/* ── Mock Chart Data (weekly revenue) ── */
const chartData = [
    { label: 'Sem 1', value: 8200, secondary: 6800 },
    { label: 'Sem 2', value: 9450, secondary: 7200 },
    { label: 'Sem 3', value: 7800, secondary: 6500 },
    { label: 'Sem 4', value: 11200, secondary: 8900 },
    { label: 'Sem 5', value: 10500, secondary: 8100 },
    { label: 'Sem 6', value: 9800, secondary: 7600 },
    { label: 'Sem 7', value: 12400, secondary: 9200 },
    { label: 'Sem 8', value: 11800, secondary: 8800 },
    { label: 'Sem 9', value: 13200, secondary: 10100 },
    { label: 'Sem 10', value: 12600, secondary: 9500 },
    { label: 'Sem 11', value: 14100, secondary: 10800 },
    { label: 'Sem 12', value: 15300, secondary: 11400 },
];

/* ── Mock Transactions ── */
const transactions: Transaction[] = [
    {
        id: 'TXN-4821',
        date: '27 Fev 2026',
        clientName: 'João Pereira',
        clientEmail: 'joao.pereira@email.com',
        clientInitials: 'JP',
        clientGradient: 'from-primary to-purple-600',
        clientAvatar: null,
        plan: 'Anual Premium',
        method: 'Cartão',
        value: 'R$ 997,00',
        status: 'Aprovado',
    },
    {
        id: 'TXN-4820',
        date: '27 Fev 2026',
        clientName: 'Carla Mendes',
        clientEmail: 'carla.mendes@email.com',
        clientInitials: 'CM',
        clientGradient: 'from-rose-500 to-pink-600',
        clientAvatar: 'https://i.pravatar.cc/150?img=47',
        plan: 'Mensal Básico',
        method: 'Pix',
        value: 'R$ 97,00',
        status: 'Aprovado',
    },
    {
        id: 'TXN-4819',
        date: '26 Fev 2026',
        clientName: 'Roberto Silva',
        clientEmail: 'roberto.silva@email.com',
        clientInitials: 'RS',
        clientGradient: 'from-amber-500 to-orange-600',
        clientAvatar: null,
        plan: 'Mensal Pro',
        method: 'Cartão',
        value: 'R$ 197,00',
        status: 'Recusado',
    },
    {
        id: 'TXN-4818',
        date: '25 Fev 2026',
        clientName: 'Ana Lúcia Ferreira',
        clientEmail: 'ana.lucia@email.com',
        clientInitials: 'AL',
        clientGradient: 'from-emerald-500 to-teal-600',
        clientAvatar: 'https://i.pravatar.cc/150?img=32',
        plan: 'Anual VIP',
        method: 'Pix',
        value: 'R$ 1.997,00',
        status: 'Aprovado',
    },
    {
        id: 'TXN-4817',
        date: '24 Fev 2026',
        clientName: 'Fernando Costa',
        clientEmail: 'fernando.costa@email.com',
        clientInitials: 'FC',
        clientGradient: 'from-blue-500 to-cyan-600',
        clientAvatar: null,
        plan: 'Mensal Pro',
        method: 'Cartão',
        value: 'R$ 197,00',
        status: 'Estornado',
    },
    {
        id: 'TXN-4816',
        date: '23 Fev 2026',
        clientName: 'Mariana Rocha',
        clientEmail: 'mariana.rocha@email.com',
        clientInitials: 'MR',
        clientGradient: 'from-violet-500 to-fuchsia-600',
        clientAvatar: 'https://i.pravatar.cc/150?img=5',
        plan: 'Anual Premium',
        method: 'Pix',
        value: 'R$ 997,00',
        status: 'Aprovado',
    },
];

/* ── Transaction Status Badge ── */
function TransactionBadge({ status }: { status: TransactionStatus }) {
    const config: Record<TransactionStatus, { bg: string; text: string; border: string; dot: string; icon: string }> = {
        Aprovado: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500', icon: 'check_circle' },
        Recusado: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', dot: 'bg-rose-500', icon: 'cancel' },
        Estornado: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500', icon: 'undo' },
    };
    const c = config[status];
    return (
        <span className={`inline-flex items-center gap-1.5 ${c.bg} ${c.text} border ${c.border} px-2.5 py-1 rounded-full text-xs font-bold`}>
            <span className="material-symbols-outlined text-[14px]">{c.icon}</span>
            {status}
        </span>
    );
}

/* ── Payment Method Badge ── */
function MethodBadge({ method }: { method: PaymentMethod }) {
    const isPix = method === 'Pix';
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${isPix
                ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                : 'bg-white/5 text-slate-300 border-white/10'
            }`}>
            <span className="material-symbols-outlined text-[14px]">
                {isPix ? 'qr_code_2' : 'credit_card'}
            </span>
            {method}
        </span>
    );
}

/* ── Area Chart SVG ── */
function RevenueChart({ data }: { data: typeof chartData }) {
    const maxVal = Math.max(...data.map(d => d.value));
    const width = 900;
    const height = 220;
    const padding = { top: 10, bottom: 5, left: 0, right: 0 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const points = data.map((d, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        const y = padding.top + chartH - (d.value / maxVal) * chartH;
        return { x, y };
    });

    const secPoints = data.map((d, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        const y = padding.top + chartH - (d.secondary / maxVal) * chartH;
        return { x, y };
    });

    const lineMain = points.map(p => `${p.x},${p.y}`).join(' ');
    const areaMain = `${padding.left},${padding.top + chartH} ${lineMain} ${padding.left + chartW},${padding.top + chartH}`;

    const lineSec = secPoints.map(p => `${p.x},${p.y}`).join(' ');
    const areaSec = `${padding.left},${padding.top + chartH} ${lineSec} ${padding.left + chartW},${padding.top + chartH}`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="areaGradMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7b61ff" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#7b61ff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="areaGradSec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGradMain" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7b61ff" />
                    <stop offset="100%" stopColor="#9682ff" />
                </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => {
                const y = padding.top + (i / 4) * chartH;
                return <line key={i} x1={padding.left} y1={y} x2={width} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
            })}

            {/* Secondary area + line */}
            <polygon points={areaSec} fill="url(#areaGradSec)" />
            <polyline points={lineSec} fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />

            {/* Main area + line */}
            <polygon points={areaMain} fill="url(#areaGradMain)" />
            <polyline points={lineMain} fill="none" stroke="url(#lineGradMain)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px rgba(123,97,255,0.5))' }} />

            {/* Dots on main line */}
            {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#7b61ff" stroke="#1a1a2e" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px rgba(123,97,255,0.6))' }} />
            ))}
        </svg>
    );
}

/* ═══════════════════════════════════════════
   FATURAMENTO PAGE
   ═══════════════════════════════════════════ */
export default function FaturamentoPage() {
    const [period, setPeriod] = useState('30d');
    const [periodOpen, setPeriodOpen] = useState(false);

    const selectedPeriod = periodOptions.find(p => p.value === period);

    return (
        <div className="flex min-h-screen bg-background-dark font-display text-slate-100">
            <AdminSidebar />

            <main className="flex-1 ml-72 p-10 overflow-y-auto w-full relative">

                {/* ─── HEADER ─── */}
                <header className="flex items-center justify-between mb-8 z-10 relative">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-500/15 p-3 rounded-xl border border-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                            <span className="material-symbols-outlined text-emerald-400 text-2xl">receipt_long</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-sora text-white tracking-tight">Faturamento</h1>
                            <p className="text-slate-400 mt-0.5 text-sm">Acompanhe a receita e as transações da plataforma.</p>
                        </div>
                    </div>

                    {/* Period Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setPeriodOpen(!periodOpen)}
                            className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all duration-300"
                        >
                            <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                            {selectedPeriod?.label}
                            <span className={`material-symbols-outlined text-lg transition-transform duration-200 ${periodOpen ? 'rotate-180' : ''}`}>
                                expand_more
                            </span>
                        </button>

                        {periodOpen && (
                            <>
                                <div className="fixed inset-0 z-30" onClick={() => setPeriodOpen(false)} />
                                <div className="absolute top-full right-0 mt-2 w-56 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-40 overflow-hidden">
                                    {periodOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setPeriod(opt.value); setPeriodOpen(false); }}
                                            className={`w-full text-left px-5 py-3 text-sm transition-colors border-b last:border-b-0 border-white/5 ${period === opt.value
                                                    ? 'text-primary bg-primary/10 font-semibold'
                                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* ─── KPI CARDS ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    {kpiData.map((kpi) => (
                        <div
                            key={kpi.label}
                            className={`bg-white/5 backdrop-blur-md border rounded-2xl p-6 transition-all duration-500 group hover:-translate-y-1 ${kpi.highlight
                                    ? 'border-primary/30 shadow-[0_0_25px_rgba(123,97,255,0.15)] hover:shadow-[0_0_35px_rgba(123,97,255,0.25)]'
                                    : 'border-white/10 hover:shadow-[0_0_20px_rgba(123,97,255,0.1)] hover:border-primary/30'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${kpi.iconBg} p-2.5 rounded-xl ${kpi.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="material-symbols-outlined">{kpi.icon}</span>
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${kpi.label === 'Taxa de Churn'
                                        ? (kpi.trend === 'down' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10')
                                        : (kpi.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10')
                                    }`}>
                                    <span className="material-symbols-outlined text-[14px]">
                                        {kpi.label === 'Taxa de Churn'
                                            ? (kpi.trend === 'down' ? 'trending_down' : 'trending_up')
                                            : (kpi.trend === 'up' ? 'trending_up' : 'trending_down')
                                        }
                                    </span>
                                    {kpi.change}
                                </div>
                            </div>

                            <h3 className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">{kpi.label}</h3>
                            <p className={`text-3xl font-bold font-sora leading-none ${kpi.highlight ? 'text-primary' : 'text-white'}`}>
                                {kpi.value}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-1.5">{kpi.subtitle}</p>

                            {/* Highlight glow bar */}
                            {kpi.highlight && (
                                <div className="mt-4 h-1 rounded-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 shadow-[0_0_12px_rgba(123,97,255,0.5)]" />
                            )}
                        </div>
                    ))}
                </div>

                {/* ─── REVENUE CHART ─── */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 hover:shadow-[0_0_15px_rgba(123,97,255,0.08)] transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <span className="material-symbols-outlined text-primary text-xl">bar_chart</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold font-sora text-white">Evolução do Faturamento</h3>
                                <p className="text-xs text-slate-500">Receita semanal — período selecionado</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(123,97,255,0.5)]" />
                                <span className="text-xs text-slate-400">Receita Bruta</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                <span className="text-xs text-slate-400">Receita Líquida</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="relative w-full h-56">
                        {/* Y axis labels */}
                        <div className="absolute left-0 top-0 bottom-8 w-14 flex flex-col justify-between text-right pr-3 pointer-events-none z-10">
                            {['15k', '12k', '9k', '6k', '0'].map((label) => (
                                <span key={label} className="text-[10px] text-slate-500 font-mono">{label}</span>
                            ))}
                        </div>

                        {/* Chart area */}
                        <div className="ml-14 h-full flex flex-col">
                            <div className="flex-1 relative">
                                <RevenueChart data={chartData} />
                            </div>

                            {/* X axis labels */}
                            <div className="flex justify-between h-8 items-center px-1">
                                {chartData.map((d) => (
                                    <span key={d.label} className="text-[10px] text-slate-500 font-mono">{d.label}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary bar below chart */}
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
                        <div className="text-center">
                            <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">Maior Receita</p>
                            <p className="text-lg font-bold font-sora text-primary">R$ 15.300</p>
                            <p className="text-[10px] text-slate-600">Semana 12</p>
                        </div>
                        <div className="text-center border-x border-white/5">
                            <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">Média Semanal</p>
                            <p className="text-lg font-bold font-sora text-white">R$ 11.375</p>
                            <p className="text-[10px] text-slate-600">Últimas 12 semanas</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">Crescimento</p>
                            <p className="text-lg font-bold font-sora text-emerald-400">+86.6%</p>
                            <p className="text-[10px] text-slate-600">vs primeiro período</p>
                        </div>
                    </div>
                </div>

                {/* ─── TRANSACTIONS TABLE ─── */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:shadow-[0_0_15px_rgba(123,97,255,0.08)] transition-all duration-500">

                    {/* Table Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/10 p-2 rounded-lg">
                                <span className="material-symbols-outlined text-emerald-400 text-xl">swap_horiz</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold font-sora text-white">Últimas Transações</h3>
                                <p className="text-xs text-slate-500">Movimentações financeiras recentes</p>
                            </div>
                        </div>
                        <button className="text-sm font-semibold text-primary hover:text-white transition-colors flex items-center gap-1.5">
                            Exportar CSV
                            <span className="material-symbols-outlined text-[16px]">download</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/20 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Plano</th>
                                    <th className="px-6 py-4">Método</th>
                                    <th className="px-6 py-4">Valor</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {transactions.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors duration-300 group">
                                        {/* Date */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-slate-300 font-medium">{txn.date}</p>
                                                <p className="text-[10px] text-slate-600 font-mono">{txn.id}</p>
                                            </div>
                                        </td>

                                        {/* Client */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {txn.clientAvatar ? (
                                                    <img
                                                        src={txn.clientAvatar}
                                                        alt={txn.clientName}
                                                        className="size-9 rounded-full border border-white/10 object-cover"
                                                    />
                                                ) : (
                                                    <div className={`size-9 rounded-full bg-gradient-to-tr ${txn.clientGradient} flex items-center justify-center font-bold text-white text-[10px] border border-white/10 shadow-lg`}>
                                                        {txn.clientInitials}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-white group-hover:text-primary transition-colors duration-300">{txn.clientName}</p>
                                                    <p className="text-[11px] text-slate-500">{txn.clientEmail}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Plan */}
                                        <td className="px-6 py-4 text-slate-300">{txn.plan}</td>

                                        {/* Payment Method */}
                                        <td className="px-6 py-4">
                                            <MethodBadge method={txn.method} />
                                        </td>

                                        {/* Value */}
                                        <td className="px-6 py-4">
                                            <span className={`font-mono font-bold ${txn.status === 'Estornado' ? 'text-amber-400 line-through decoration-amber-400/40' :
                                                    txn.status === 'Recusado' ? 'text-slate-500' :
                                                        'text-white'
                                                }`}>
                                                {txn.value}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <TransactionBadge status={txn.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-black/10">
                        <p className="text-sm text-slate-500">
                            Mostrando <span className="text-white font-semibold">{transactions.length}</span> transações recentes
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-xs">
                                <span className="inline-flex items-center gap-1 text-emerald-400">
                                    <span className="size-1.5 bg-emerald-500 rounded-full" />
                                    {transactions.filter(t => t.status === 'Aprovado').length} Aprovadas
                                </span>
                                <span className="text-slate-600">•</span>
                                <span className="inline-flex items-center gap-1 text-rose-400">
                                    <span className="size-1.5 bg-rose-500 rounded-full" />
                                    {transactions.filter(t => t.status === 'Recusado').length} Recusadas
                                </span>
                                <span className="text-slate-600">•</span>
                                <span className="inline-flex items-center gap-1 text-amber-400">
                                    <span className="size-1.5 bg-amber-500 rounded-full" />
                                    {transactions.filter(t => t.status === 'Estornado').length} Estornadas
                                </span>
                            </div>
                            <button className="text-sm font-semibold text-primary hover:text-white transition-colors flex items-center gap-1.5">
                                Ver todas
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
