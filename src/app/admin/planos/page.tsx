'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

/* ── Types ── */
interface Plan {
    id: string;
    name: string;
    slug: string;
    tier: string;
    price_monthly: number;
    price_yearly: number;
    credits_quota: number;
    features: string[];
    is_active: boolean;
    is_popular: boolean;
}

const tierStyle: Record<string, { badge: string; border: string }> = {
    starter: { badge: 'bg-slate-800 text-slate-400', border: '' },
    pro: { badge: 'bg-primary text-white', border: 'border-primary/40' },
    enterprise: { badge: 'bg-slate-100 text-background-dark', border: '' },
};

export default function GestaoPlanosAdminPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Plan>>({
        name: '', slug: '', tier: 'starter', price_monthly: 0, price_yearly: 0,
        credits_quota: 100, features: [], is_active: true, is_popular: false
    });
    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        fetch('/api/admin/planos')
            .then((r) => r.json())
            .then((data) => {
                if (data.plans) setPlans(data.plans);
            })
            .catch(() => { });
    }, []);

    const togglePlan = async (id: string, currentActive: boolean) => {
        await fetch('/api/admin/planos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, is_active: !currentActive }),
        });
        setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: !currentActive } : p)));
    };

    const handleEdit = (plan: Plan) => {
        setEditingPlanId(plan.id);
        setFormData(plan);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingPlanId(null);
        setFormData({
            name: '', slug: '', tier: 'starter', price_monthly: 0, price_yearly: 0,
            credits_quota: 100, features: [], is_active: true, is_popular: false
        });
        setIsModalOpen(true);
    };

    const handleSavePlan = async () => {
        const method = editingPlanId ? 'PUT' : 'POST';
        const body = editingPlanId ? { id: editingPlanId, ...formData } : formData;

        const res = await fetch('/api/admin/planos', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            const data = await res.json();
            if (editingPlanId) {
                setPlans(prev => prev.map(p => p.id === editingPlanId ? data.plan : p));
            } else {
                setPlans(prev => [...prev, data.plan]);
            }
            setIsModalOpen(false);
        } else {
            alert('Erro ao salvar plano.');
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-row bg-background-dark font-display text-slate-100 selection:bg-primary selection:text-white">
            <AdminSidebar />

            <main className="flex-1 ml-72 relative z-10 w-full min-h-screen overflow-x-hidden pb-[80px] lg:pb-0">
                {/* Plasma Background */}
                <div className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(123, 97, 255, 0.15) 0%, transparent 50%)' }}></div>

                {/* Header Section */}
                <header className="p-6 md:p-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div>
                        <h2 className="font-sora font-bold text-3xl md:text-4xl text-white relative inline-block group mb-2 md:mb-0">
                            Planos de Assinatura
                            <div className="absolute -bottom-2 left-0 w-16 h-1 bg-primary rounded shadow-[0_0_15px_#7b61ff] group-hover:w-full transition-all duration-300"></div>
                        </h2>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/30 w-full md:w-auto">
                        <span className="material-symbols-outlined">add</span>
                        Criar Novo Plano
                    </button>
                </header>

                {/* Pricing Grid */}
                <div className="p-6 md:p-10 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.length === 0 && (
                        <div className="col-span-full text-center py-16 text-slate-500">
                            <span className="material-symbols-outlined text-4xl mb-3 block">credit_card_off</span>
                            <p>Nenhum plano cadastrado.</p>
                        </div>
                    )}
                    {plans.map((plan) => {
                        const style = tierStyle[plan.tier] || tierStyle.starter;
                        const features = Array.isArray(plan.features) ? plan.features : [];
                        return (
                            <div key={plan.id} className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col relative group hover:border-white/20 transition-all ${plan.is_popular ? 'border-t-2 border-t-primary shadow-[0_0_40px_rgba(123,97,255,0.12)]' : ''} ${style.border}`}>
                                {plan.is_popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg shadow-primary/30">
                                        ★ Mais Popular
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`${style.badge} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest`}>{plan.tier}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[11px] font-bold uppercase ${plan.is_active ? 'text-emerald-500' : 'text-slate-500'}`}>{plan.is_active ? 'Ativo' : 'Inativo'}</span>
                                        <button onClick={() => togglePlan(plan.id, plan.is_active)}
                                            className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${plan.is_active ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
                                            <div className={`w-3 h-3 rounded-full transition-all ${plan.is_active ? 'bg-emerald-500 ml-auto' : 'bg-slate-500'}`}></div>
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-sora font-extrabold text-3xl mb-4">{plan.name}</h3>
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-slate-400 text-lg">R$</span>
                                        <span className="text-white font-sora font-bold text-5xl">{Math.floor(plan.price_monthly)}</span>
                                        <span className="text-slate-500 font-medium">/mês</span>
                                    </div>
                                    {plan.price_yearly > 0 && (
                                        <p className="text-slate-500 text-sm mt-1">Anual: R$ {plan.price_yearly.toLocaleString('pt-BR')}/ano</p>
                                    )}
                                </div>
                                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8">
                                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Cota de Créditos</p>
                                    <p className="font-mono text-2xl text-white">
                                        {plan.credits_quota < 0 ? '∞' : plan.credits_quota.toLocaleString('pt-BR')}
                                        {plan.credits_quota >= 0 && <span className="text-sm opacity-60"> créditos</span>}
                                    </p>
                                </div>
                                <ul className="space-y-4 mb-10 flex-1">
                                    {features.map((feat, fi) => (
                                        <li key={fi} className="flex items-center gap-3 text-sm">
                                            <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                            <span className="text-slate-300">{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleEdit(plan)}
                                    className={`w-full py-3.5 rounded-full font-bold text-sm transition-all ${plan.is_popular
                                        ? 'bg-primary text-white shadow-[0_0_30px_rgba(123,97,255,0.3)]'
                                        : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'}`}>
                                    Editar Plano
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* MODAL CRIAR/EDITAR PLANO */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                        <div className="bg-background-dark border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 p-6 md:p-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-sora font-bold text-white">
                                    {editingPlanId ? 'Editar Plano' : 'Criar Novo Plano'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nome do Plano</label>
                                        <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="Ex: Starter" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Slug</label>
                                        <input type="text" value={formData.slug || ''} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="Ex: starter" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tier Visual</label>
                                        <select value={formData.tier || 'starter'} onChange={e => setFormData({ ...formData, tier: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none">
                                            <option value="starter" className="bg-[#1a1a2e]">Starter</option>
                                            <option value="pro" className="bg-[#1a1a2e]">Pro</option>
                                            <option value="enterprise" className="bg-[#1a1a2e]">Enterprise</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Preço Mensal (R$)</label>
                                        <input type="number" value={formData.price_monthly || 0} onChange={e => setFormData({ ...formData, price_monthly: Number(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Preço Anual (R$)</label>
                                        <input type="number" value={formData.price_yearly || 0} onChange={e => setFormData({ ...formData, price_yearly: Number(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cota de Créditos</label>
                                        <input type="number" value={formData.credits_quota || 0} onChange={e => setFormData({ ...formData, credits_quota: Number(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="-1 para ilimitado" />
                                    </div>
                                    <div className="flex items-end pb-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${formData.is_popular ? 'bg-primary' : 'bg-slate-700'}`}>
                                                <div className={`w-4 h-4 rounded-full bg-white transition-all ${formData.is_popular ? 'ml-auto' : ''}`}></div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-300">Marcar como Mais Popular</span>
                                            <input type="checkbox" className="hidden" checked={formData.is_popular || false} onChange={e => setFormData({ ...formData, is_popular: e.target.checked })} />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Features / Benefícios</label>
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            if (newFeature.trim()) {
                                                setFormData({ ...formData, features: [...(formData.features || []), newFeature.trim()] });
                                                setNewFeature('');
                                            }
                                        }}
                                        className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={newFeature}
                                            onChange={e => setNewFeature(e.target.value)}
                                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                            placeholder="Ex: Acesso a todos os agentes..."
                                        />
                                        <button
                                            type="submit"
                                            className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-xl font-bold transition-colors">
                                            Add
                                        </button>
                                    </form>
                                    <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                        {(formData.features || []).map((feat, idx) => (
                                            <li key={idx} className="flex items-center justify-between bg-white/5 border border-white/5 px-3 py-2 rounded-lg">
                                                <span className="text-sm text-slate-300">{feat}</span>
                                                <button type="button" onClick={() => setFormData({ ...formData, features: formData.features?.filter((_, i) => i !== idx) })} className="text-rose-400 hover:text-rose-300">
                                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                                    Cancelar
                                </button>
                                <button onClick={handleSavePlan} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/30 transition-all">
                                    Salvar Plano
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
