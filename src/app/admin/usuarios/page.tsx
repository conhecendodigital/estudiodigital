'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

/* ── Types ── */
interface UserRow {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    plan_name?: string;
    plan_tier?: string;
    credits_remaining?: number;
    total_requests?: number;
    status: string;
    created_at: string;
}

const planBadge: Record<string, string> = {
    pro: 'bg-primary text-white',
    enterprise: 'bg-slate-100 text-background-dark',
    starter: 'bg-white/10 text-slate-300',
    free: 'bg-white/10 text-slate-300',
};

export default function GestaoUsuariosAdminPage() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [search, setSearch] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserRow | null>(null);

    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        fetch(`/api/admin/clientes?${params.toString()}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.clients) {
                    setUsers(
                        (data.clients as Array<Record<string, unknown>>).map((s) => {
                            const subs = (s.subscriptions as Array<Record<string, unknown>>) || [];
                            const activeSub = subs.find((sub) => sub.status === 'ativo') || subs[0];
                            const planObj = activeSub?.plans as Record<string, string> | null;
                            return {
                                id: (s.id as string) || '',
                                full_name: (s.full_name as string) || 'Usuário',
                                email: (s.email as string) || '',
                                avatar_url: (s.avatar_url as string) || undefined,
                                plan_name: planObj?.name || 'Free',
                                plan_tier: (planObj?.slug || 'free').toLowerCase(),
                                credits_remaining: 0,
                                total_requests: 0,
                                status: activeSub ? String(activeSub.status || 'inactive') : 'inactive',
                                created_at: (s.created_at as string) || new Date().toISOString(),
                            };
                        })
                    );
                }
            })
            .catch(() => { });
    }, [search]);

    const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR');

    /* ── Actions ── */
    const handleToggleStatus = async (user: UserRow) => {
        const newStatus = user.status === 'ativo' ? 'cancelado' : 'ativo';
        if (!confirm(`Deseja alterar o status de ${user.full_name} para ${newStatus}?`)) return;

        try {
            const res = await fetch('/api/admin/clientes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: user.id, action: 'update_status', status: newStatus })
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
            } else {
                alert("Erro ao atualizar status do usuário.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (user: UserRow) => {
        if (!confirm(`TEM CERTEZA ABSOLUTA que deseja excluir a conta de ${user.full_name} permanentemente? Isso não pode ser desfeito.`)) return;

        try {
            const res = await fetch(`/api/admin/clientes?id=${user.id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== user.id));
            } else {
                alert("Erro ao excluir usuário.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-row bg-background-dark font-sans text-slate-100">
            <AdminSidebar />

            <main className="flex-1 ml-72 p-6 md:p-10 relative z-10 w-full min-h-screen mb-[80px] lg:mb-0">
                {/* Header Section */}
                <header className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="font-sora text-3xl md:text-4xl font-bold tracking-tight text-slate-100 mb-1">Usuários</h2>
                        <p className="text-slate-500 text-sm">Gerencie o ecossistema de usuários da plataforma.</p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 px-6 py-3 border border-white/10 rounded-full hover:bg-white/5 text-slate-300 font-medium transition-all">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Exportar CSV
                    </button>
                    <button className="md:hidden flex items-center justify-center p-3 border border-white/10 rounded-full hover:bg-white/5 text-slate-300 font-medium transition-all">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                    </button>
                </header>

                {/* Control Bar */}
                <section className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="w-full md:flex-1 md:max-w-md">
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm"
                                placeholder="Pesquisar por nome, email ou ID..."
                                type="text"
                            />
                        </div>
                    </div>
                </section>

                {/* Table Container */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden relative mb-8 shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Usuário</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plano</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Créditos</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Requisições</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Data Cadastro</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.length === 0 && (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">Nenhum usuário encontrado.</td></tr>
                                )}
                                {users.map((user) => {
                                    const badge = planBadge[user.plan_tier || 'free'] || planBadge.free;
                                    const isActive = user.status === 'active';
                                    return (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full border border-white/10 bg-gradient-to-tr from-primary/30 to-purple-500/30 flex items-center justify-center text-sm font-bold text-white">
                                                        {user.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-100">{user.full_name}</p>
                                                        <p className="text-xs text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase ${badge} tracking-wider`}>
                                                    {(user.plan_name || 'FREE').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <code className="font-mono text-sm text-primary">
                                                    {(user.credits_remaining ?? 0) < 0 ? '∞' : (user.credits_remaining ?? 0).toLocaleString('pt-BR')}
                                                </code>
                                            </td>
                                            <td className="px-6 py-5">
                                                <code className="font-mono text-sm text-slate-300">{(user.total_requests ?? 0).toLocaleString('pt-BR')}</code>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`}></div>
                                                    <span className={`text-xs font-medium ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>{isActive ? 'Ativo' : 'Inativo'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-slate-500 font-sora">{formatDate(user.created_at)}</td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => { setEditingUser(user); setIsEditModalOpen(true); }}
                                                        className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                                        title="Ver Detalhes">
                                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(user)}
                                                        className="p-2 text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 rounded-full transition-all"
                                                        title={isActive ? "Pausar Usuário" : "Reativar"}>
                                                        <span className="material-symbols-outlined text-[18px]">{isActive ? 'pause' : 'play_arrow'}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user)}
                                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                                        title="Excluir Definitivamente">
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL VER / EDITAR */}
                {isEditModalOpen && editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
                        <div className="bg-background-dark border border-white/10 rounded-2xl w-full max-w-md relative z-10 p-6 md:p-8 shadow-2xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    {editingUser.avatar_url ? (
                                        <img src={editingUser.avatar_url} alt="Avatar" className="size-14 rounded-full border border-white/10 object-cover" />
                                    ) : (
                                        <div className="size-14 rounded-full bg-gradient-to-tr from-primary/30 to-purple-500/30 flex items-center justify-center text-lg font-bold text-white border border-white/10 shadow-lg">
                                            {editingUser.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-sora font-bold text-white leading-tight">{editingUser.full_name}</h3>
                                        <p className="text-sm text-slate-400">{editingUser.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">ID Único</label>
                                    <p className="font-mono text-slate-300 text-sm break-all">{editingUser.id}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-white/5 border border-white/5 rounded-xl p-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status Atual</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`w-2 h-2 rounded-full ${editingUser.status === 'ativo' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`}></div>
                                            <span className={`text-sm font-medium ${editingUser.status === 'ativo' ? 'text-slate-300' : 'text-slate-500'}`}>{editingUser.status === 'ativo' ? 'Ativo' : 'Inativo'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Data de Cadastro</label>
                                        <p className="text-white font-medium text-sm mt-1">{formatDate(editingUser.created_at)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Plano Base</label>
                                        <p className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 tracking-wider bg-white/10 text-slate-300">
                                            {editingUser.plan_name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Requisições</label>
                                        <p className="text-white font-mono font-bold text-sm mt-1">{editingUser.total_requests}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                                <button onClick={() => setIsEditModalOpen(false)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all">
                                    Fechar Aba
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Plasma Accents */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full -z-10 blur-[100px] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(104, 81, 251, 0.4) 0%, transparent 70%)' }}></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full -z-10 blur-[100px] opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(104, 81, 251, 0.4) 0%, transparent 70%)' }}></div>
            </main>
        </div>
    );
}
