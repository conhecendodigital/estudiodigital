'use client';

import React, { useState, useMemo, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

/* ── Types ── */
type SubscriberStatus = 'Ativo' | 'Cancelado' | 'Inadimplente';
type PlanType = 'Mensal' | 'Anual';

interface Subscriber {
    id: string;
    name: string;
    email: string;
    initials: string;
    gradient: string;
    avatar: string | null;
    plan: string;
    planType: PlanType;
    monthlyValue: string;
    status: SubscriberStatus;
    startDate: string;
}

const clientGradients = [
    'from-primary to-purple-600', 'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600', 'from-emerald-500 to-teal-600',
    'from-blue-500 to-cyan-600', 'from-violet-500 to-fuchsia-600',
];

/* ── Status Badge ── */
function StatusBadge({ status }: { status: SubscriberStatus }) {
    const config: Record<SubscriberStatus, { bg: string; text: string; border: string; dot: string; pulse: boolean }> = {
        Ativo: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500', pulse: true },
        Cancelado: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', dot: 'bg-rose-500', pulse: false },
        Inadimplente: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20', dot: 'bg-yellow-500', pulse: false },
    };
    const c = config[status];
    return (
        <span className={`inline-flex items-center gap-1.5 ${c.bg} ${c.text} border ${c.border} px-2.5 py-1 rounded-full text-xs font-bold`}>
            <span className={`size-1.5 ${c.dot} rounded-full ${c.pulse ? 'animate-pulse' : ''}`}></span>
            {status}
        </span>
    );
}

/* ── Plan Badge ── */
function PlanBadge({ plan }: { plan: string }) {
    const isAnual = plan.toLowerCase().includes('anual');
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${isAnual
            ? 'bg-primary/10 text-primary border-primary/20'
            : 'bg-white/5 text-slate-300 border-white/10'
            }`}>
            <span className="material-symbols-outlined text-[14px]">
                {isAnual ? 'workspace_premium' : 'calendar_today'}
            </span>
            {plan}
        </span>
    );
}

/* ── Filter Dropdown (simulated) ── */
function FilterDropdown({
    label,
    icon,
    options,
    value,
    onChange,
}: {
    label: string;
    icon: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${value
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
            >
                <span className="material-symbols-outlined text-lg">{icon}</span>
                {value || label}
                <span className={`material-symbols-outlined text-lg transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <button
                            onClick={() => { onChange(''); setOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors ${!value ? 'text-primary bg-primary/10 font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            Todos
                        </button>
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => { onChange(opt.value); setOpen(false); }}
                                className={`w-full text-left px-4 py-3 text-sm transition-colors border-t border-white/5 ${value === opt.value ? 'text-primary bg-primary/10 font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════
   ASSINANTES PAGE
   ═══════════════════════════════════════════ */
export default function AssinantesPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [kpis, setKpis] = useState([
        { label: 'Total Assinantes', value: '...', icon: 'group', iconBg: 'bg-primary/20', iconColor: 'text-primary' },
        { label: 'Ativos', value: '...', icon: 'check_circle', iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-400' },
        { label: 'Inadimplentes', value: '...', icon: 'warning', iconBg: 'bg-yellow-500/20', iconColor: 'text-yellow-400' },
        { label: 'Cancelados', value: '...', icon: 'cancel', iconBg: 'bg-rose-500/20', iconColor: 'text-rose-400' },
    ]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [planFilter, setPlanFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<Subscriber | null>(null);
    const perPage = 5;

    useEffect(() => {
        fetch('/api/admin/clientes')
            .then((r) => r.json())
            .then((data) => {
                if (data.clients) {
                    const mapped: Subscriber[] = data.clients.map((c: Record<string, unknown>, i: number) => {
                        const subs = (c.subscriptions as Array<Record<string, unknown>>) || [];
                        const activeSub = subs[0] || {} as Record<string, unknown>;
                        const plan = activeSub.plans as Record<string, string> | null;
                        const name = (c.full_name as string) || 'Usu\u00e1rio';
                        const statusRaw = (activeSub.status as string) || 'ativo';
                        const statusMap: Record<string, SubscriberStatus> = { ativo: 'Ativo', cancelado: 'Cancelado', inadimplente: 'Inadimplente' };
                        return {
                            id: (c.id as string)?.slice(0, 8) || `SUB-${i}`,
                            name,
                            email: (c.email as string) || '',
                            initials: name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
                            gradient: clientGradients[i % clientGradients.length],
                            avatar: (c.avatar_url as string) || null,
                            plan: plan?.name || (activeSub.plan_type as string) || 'Plano',
                            planType: ((activeSub.plan_type as string) || '').includes('anual') ? 'Anual' as PlanType : 'Mensal' as PlanType,
                            monthlyValue: `R$ ${Number(activeSub.monthly_value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                            status: statusMap[statusRaw] || 'Ativo',
                            startDate: activeSub.start_date ? new Date(activeSub.start_date as string).toLocaleDateString('pt-BR') : '\u2014',
                        };
                    });
                    setSubscribers(mapped);
                }
                if (data.kpis) {
                    const k = data.kpis;
                    setKpis([
                        { label: 'Total Assinantes', value: String(k.total), icon: 'group', iconBg: 'bg-primary/20', iconColor: 'text-primary' },
                        { label: 'Ativos', value: String(k.ativos), icon: 'check_circle', iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-400' },
                        { label: 'Inadimplentes', value: String(k.inadimplentes), icon: 'warning', iconBg: 'bg-yellow-500/20', iconColor: 'text-yellow-400' },
                        { label: 'Cancelados', value: String(k.cancelados), icon: 'cancel', iconBg: 'bg-rose-500/20', iconColor: 'text-rose-400' },
                    ]);
                }
            })
            .catch(() => { });
    }, []);

    /* ── Filtered Data ── */
    const filtered = useMemo(() => {
        return subscribers.filter((sub) => {
            const matchesSearch =
                !search ||
                sub.name.toLowerCase().includes(search.toLowerCase()) ||
                sub.email.toLowerCase().includes(search.toLowerCase()) ||
                sub.id.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = !statusFilter || sub.status === statusFilter;
            const matchesPlan = !planFilter || sub.planType === planFilter;

            return matchesSearch && matchesStatus && matchesPlan;
        });
    }, [search, statusFilter, planFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

    const activeFilters = [statusFilter, planFilter].filter(Boolean).length;

    /* ── Actions ── */
    const handleToggleStatus = async (sub: Subscriber) => {
        const newStatus = sub.status === 'Ativo' ? 'cancelado' : 'ativo';
        if (!confirm(`Deseja alterar o status de ${sub.name} para ${newStatus}?`)) return;

        try {
            const res = await fetch('/api/admin/clientes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: sub.id, action: 'update_status', status: newStatus })
            });
            if (res.ok) {
                setSubscribers(prev => prev.map(s => s.id === sub.id ? { ...s, status: newStatus === 'ativo' ? 'Ativo' : 'Cancelado' } : s));
            } else {
                alert("Erro ao atualizar status do cliente.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (sub: Subscriber) => {
        if (!confirm(`TEM CERTEZA ABSOLUTA que deseja excluir a conta de ${sub.name} permanentemente? Isso não pode ser desfeito.`)) return;

        try {
            const res = await fetch(`/api/admin/clientes?id=${sub.id}`, { method: 'DELETE' });
            if (res.ok) {
                setSubscribers(prev => prev.filter(s => s.id !== sub.id));
            } else {
                alert("Erro ao excluir cliente.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen bg-background-dark font-display text-slate-100">
            <AdminSidebar />

            <main className="flex-1 ml-72 p-10 overflow-y-auto w-full relative">

                {/* ─── HEADER ─── */}
                <header className="flex items-center justify-between mb-8 z-10 relative">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/15 p-3 rounded-xl border border-primary/20 shadow-[0_0_20px_rgba(123,97,255,0.15)]">
                            <span className="material-symbols-outlined text-primary text-2xl">group</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-sora text-white tracking-tight">Assinantes</h1>
                            <p className="text-slate-400 mt-0.5 text-sm">Gerencie os assinantes da sua plataforma.</p>
                        </div>
                    </div>
                    <button className="btn-magnetic bg-primary hover:bg-primary-dark text-white font-sora font-semibold px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all shadow-[0_0_15px_rgba(123,97,255,0.3)] hover:shadow-[0_0_30px_rgba(123,97,255,0.5)] border border-white/10">
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        Adicionar Assinante
                    </button>
                </header>

                {/* ─── KPI MINI CARDS ─── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {kpis.map((kpi) => (
                        <div
                            key={kpi.label}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all duration-500 group"
                        >
                            <div className={`${kpi.iconBg} p-2.5 rounded-xl ${kpi.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                <span className="material-symbols-outlined">{kpi.icon}</span>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{kpi.label}</p>
                                <p className="text-2xl font-bold font-sora text-white">{kpi.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── SEARCH & FILTERS BAR ─── */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="material-symbols-outlined text-slate-500 text-xl">search</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome, email ou ID..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block w-px h-10 bg-white/10" />

                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <FilterDropdown
                            label="Status"
                            icon="filter_list"
                            options={[
                                { value: 'Ativo', label: 'Ativo' },
                                { value: 'Cancelado', label: 'Cancelado' },
                                { value: 'Inadimplente', label: 'Inadimplente' },
                            ]}
                            value={statusFilter}
                            onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
                        />
                        <FilterDropdown
                            label="Plano"
                            icon="credit_card"
                            options={[
                                { value: 'Mensal', label: 'Mensal' },
                                { value: 'Anual', label: 'Anual' },
                            ]}
                            value={planFilter}
                            onChange={(v) => { setPlanFilter(v); setCurrentPage(1); }}
                        />

                        {activeFilters > 0 && (
                            <button
                                onClick={() => { setStatusFilter(''); setPlanFilter(''); setSearch(''); setCurrentPage(1); }}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                            >
                                <span className="material-symbols-outlined text-[14px]">clear_all</span>
                                Limpar ({activeFilters})
                            </button>
                        )}
                    </div>
                </div>

                {/* ─── DATA TABLE ─── */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:shadow-[0_0_15px_rgba(123,97,255,0.08)] transition-all duration-500">

                    {/* Table Header Info */}
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                        <p className="text-sm text-slate-400">
                            Mostrando <span className="text-white font-semibold">{paginated.length}</span> de{' '}
                            <span className="text-white font-semibold">{filtered.length}</span> assinantes
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="material-symbols-outlined text-[16px]">info</span>
                            Clique nas ações para gerenciar
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/20 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Usuário</th>
                                    <th className="px-6 py-4">Plano</th>
                                    <th className="px-6 py-4">Valor Mensal</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Data de Início</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {paginated.length > 0 ? (
                                    paginated.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors duration-300 group">
                                            {/* Avatar + Name + Email */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {sub.avatar ? (
                                                        <img
                                                            src={sub.avatar}
                                                            alt={sub.name}
                                                            className="size-10 rounded-full border border-white/10 object-cover"
                                                        />
                                                    ) : (
                                                        <div
                                                            className={`size-10 rounded-full bg-gradient-to-tr ${sub.gradient} flex items-center justify-center font-bold text-white text-xs border border-white/10 shadow-lg`}
                                                        >
                                                            {sub.initials}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-white group-hover:text-primary transition-colors duration-300">
                                                            {sub.name}
                                                        </p>
                                                        <p className="text-[11px] text-slate-500">{sub.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Plan */}
                                            <td className="px-6 py-4">
                                                <PlanBadge plan={sub.plan} />
                                            </td>

                                            {/* Monthly Value */}
                                            <td className="px-6 py-4 font-mono font-bold text-white">{sub.monthlyValue}</td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <StatusBadge status={sub.status} />
                                            </td>

                                            {/* Start Date */}
                                            <td className="px-6 py-4 text-slate-400">{sub.startDate}</td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => { setEditingSub(sub); setIsEditModalOpen(true); }}
                                                        className="text-slate-500 hover:text-primary hover:bg-primary/10 p-2 rounded-lg transition-all duration-300"
                                                        title="Ver / Editar assinante"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(sub)}
                                                        className="text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 p-2 rounded-lg transition-all duration-300"
                                                        title={sub.status === 'Ativo' ? "Pausar Assinatura" : "Reativar Assinatura"}
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">
                                                            {sub.status === 'Ativo' ? 'pause_circle' : 'play_circle'}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(sub)}
                                                        className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg transition-all duration-300"
                                                        title="Excluir assinante"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="bg-white/5 p-4 rounded-2xl">
                                                    <span className="material-symbols-outlined text-slate-600 text-4xl">search_off</span>
                                                </div>
                                                <p className="text-slate-400 font-semibold">Nenhum assinante encontrado</p>
                                                <p className="text-slate-600 text-sm">Tente ajustar os filtros ou o termo de pesquisa.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ─── PAGINATION ─── */}
                    {filtered.length > 0 && (
                        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Página <span className="text-white font-semibold">{currentPage}</span> de{' '}
                                <span className="text-white font-semibold">{totalPages}</span>
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border ${currentPage === 1
                                        ? 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed'
                                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                    Anterior
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`size-9 rounded-lg text-sm font-semibold transition-all duration-300 ${page === currentPage
                                                ? 'bg-primary text-white shadow-[0_0_12px_rgba(123,97,255,0.4)]'
                                                : 'text-slate-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border ${currentPage === totalPages
                                        ? 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed'
                                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    Próxima
                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* MODAL VER / EDITAR */}
                {isEditModalOpen && editingSub && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
                        <div className="bg-background-dark border border-white/10 rounded-2xl w-full max-w-md relative z-10 p-6 md:p-8 shadow-2xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    {editingSub.avatar ? (
                                        <img src={editingSub.avatar} alt="Avatar" className="size-14 rounded-full border border-white/10 object-cover" />
                                    ) : (
                                        <div className={`size-14 rounded-full bg-gradient-to-tr ${editingSub.gradient} flex items-center justify-center font-bold text-white text-lg border border-white/10 shadow-lg`}>
                                            {editingSub.initials}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-sora font-bold text-white leading-tight">{editingSub.name}</h3>
                                        <p className="text-sm text-slate-400">{editingSub.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">ID Único</label>
                                    <p className="font-mono text-slate-300 text-sm">{editingSub.id}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-white/5 border border-white/5 rounded-xl p-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status Atual</label>
                                        <StatusBadge status={editingSub.status} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Data de Início</label>
                                        <p className="text-white font-medium text-sm">{editingSub.startDate}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Plano Base</label>
                                        <PlanBadge plan={editingSub.plan} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Cobrança</label>
                                        <p className="text-white font-mono font-bold text-sm">{editingSub.monthlyValue}</p>
                                    </div>
                                </div>

                                <p className="text-xs text-rose-400 mt-4 leading-relaxed bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                                    <span className="font-bold uppercase block mb-1">Nota Administrativa</span>
                                    Edições de valores de cobrança, email ou migrações de plano complexas devem ser realizadas diretamente no dashboard do provedor de pagamento (Stripe/MercadoPago).
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                                <button onClick={() => setIsEditModalOpen(false)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all">
                                    Fechar Aba
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
