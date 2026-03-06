'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Plan {
    id: string;
    name: string;
    slug: string;
    tier: string;
    description?: string;
    price_monthly: number;
    price_yearly: number;
    credits_quota: number;
    features: string[];
    is_active: boolean;
    is_popular: boolean;
    sort_order: number;
}

interface Subscription {
    id: string;
    status: string;
    plan_type: string;
    plan_id: string;
    plans: { name: string; slug: string; tier: string } | null;
}

export default function PlanosPage() {
    const { profile, refreshProfile } = useAuth();
    const router = useRouter();

    const [plans, setPlans] = useState<Plan[]>([]);
    const [currentSub, setCurrentSub] = useState<Subscription | null>(null);
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/planos')
            .then(r => r.json())
            .then(data => {
                if (data.plans) setPlans(data.plans);
                if (data.currentSubscription) setCurrentSub(data.currentSubscription);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSubscribe = async (planId: string) => {
        setSubscribing(planId);
        try {
            const res = await fetch('/api/planos/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId, billing }),
            });

            if (res.ok) {
                const data = await res.json();
                setCurrentSub({
                    id: data.subscription.id,
                    status: 'ativo',
                    plan_type: billing,
                    plan_id: planId,
                    plans: { name: data.plan.name, slug: data.plan.slug, tier: data.plan.tier },
                });
                await refreshProfile();
                setSuccessMsg(`Plano ${data.plan.name} ativado com sucesso!`);
                setTimeout(() => setSuccessMsg(null), 5000);
            } else {
                const err = await res.json();
                alert(err.error || 'Erro ao assinar plano');
            }
        } catch (err) {
            alert('Erro de conexão');
        } finally {
            setSubscribing(null);
        }
    };

    const handleCancel = async () => {
        setCancelling(true);
        try {
            const res = await fetch('/api/planos/subscribe', { method: 'DELETE' });
            if (res.ok) {
                setCurrentSub(null);
                await refreshProfile();
                setShowCancelModal(false);
                setSuccessMsg('Assinatura cancelada. Seus créditos foram resetados para o plano gratuito.');
                setTimeout(() => setSuccessMsg(null), 5000);
            } else {
                alert('Erro ao cancelar');
            }
        } catch {
            alert('Erro de conexão');
        } finally {
            setCancelling(false);
        }
    };

    const getTierGradient = (tier: string) => {
        switch (tier) {
            case 'starter': return 'from-slate-500/20 to-slate-700/10';
            case 'pro': return 'from-primary/20 to-violet-600/10';
            case 'enterprise': return 'from-amber-500/20 to-yellow-600/10';
            default: return 'from-slate-500/20 to-slate-700/10';
        }
    };

    const getTierIcon = (tier: string) => {
        switch (tier) {
            case 'starter': return 'rocket_launch';
            case 'pro': return 'diamond';
            case 'enterprise': return 'workspace_premium';
            default: return 'credit_card';
        }
    };

    const getButtonState = (plan: Plan) => {
        if (!currentSub || currentSub.status !== 'ativo') {
            return { label: 'Assinar Agora', action: () => handleSubscribe(plan.id), variant: 'subscribe' };
        }

        if (currentSub.plan_id === plan.id) {
            return { label: 'Plano Atual', action: null, variant: 'current' };
        }

        const currentPlanIdx = plans.findIndex(p => p.id === currentSub.plan_id);
        const targetPlanIdx = plans.findIndex(p => p.id === plan.id);

        if (targetPlanIdx > currentPlanIdx) {
            return { label: 'Fazer Upgrade', action: () => handleSubscribe(plan.id), variant: 'upgrade' };
        }

        return { label: 'Fazer Downgrade', action: () => handleSubscribe(plan.id), variant: 'downgrade' };
    };

    const yearlyDiscount = (plan: Plan) => {
        if (!plan.price_yearly || !plan.price_monthly) return 0;
        const monthlyTotal = plan.price_monthly * 12;
        return Math.round(((monthlyTotal - plan.price_yearly) / monthlyTotal) * 100);
    };

    return (
        <div className="flex min-h-screen w-full flex-row bg-background-dark font-display text-slate-100">
            <Sidebar />

            <main className="flex-1 md:ml-[280px] h-screen overflow-y-auto">
                {/* Header */}
                <header className="sticky top-0 z-40 flex items-center border-b border-primary/10 bg-background-dark/80 backdrop-blur-md px-6 md:px-10 py-4">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary text-2xl">credit_card</span>
                        <h2 className="text-slate-100 text-xl font-sora font-extrabold leading-tight tracking-tight">Planos</h2>
                    </div>
                </header>

                <div className="p-6 md:p-10 max-w-6xl mx-auto">

                    {/* Success Message */}
                    {successMsg && (
                        <div className="mb-8 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-4">
                            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                            <p className="text-sm font-medium text-emerald-300">{successMsg}</p>
                        </div>
                    )}

                    {/* Hero */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-sora font-black text-white mb-4 tracking-tight">
                            Escolha o plano ideal<br />
                            <span className="bg-gradient-to-r from-primary to-[#2af5ff] bg-clip-text text-transparent">para o seu negócio</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">
                            Desbloqueie todo o potencial da IA com mais créditos, agentes e funcionalidades avançadas.
                        </p>

                        {/* Billing Toggle */}
                        <div className="mt-8 inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-full p-1.5">
                            <button
                                onClick={() => setBilling('monthly')}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${billing === 'monthly' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-400 hover:text-white'}`}
                            >
                                Mensal
                            </button>
                            <button
                                onClick={() => setBilling('yearly')}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billing === 'yearly' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-400 hover:text-white'}`}
                            >
                                Anual
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black">ECONOMIZE</span>
                            </button>
                        </div>
                    </div>

                    {/* Plans Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 animate-pulse h-[500px]" />
                            ))}
                        </div>
                    ) : plans.length === 0 ? (
                        <div className="text-center py-20">
                            <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">credit_card_off</span>
                            <h3 className="text-xl font-sora font-bold text-slate-400">Nenhum plano disponível</h3>
                            <p className="text-slate-500 text-sm mt-2">Os planos serão configurados pelo administrador em breve.</p>
                        </div>
                    ) : (
                        <div className={`grid grid-cols-1 gap-8 ${plans.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : plans.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'}`}>
                            {plans.map((plan) => {
                                const price = billing === 'yearly'
                                    ? (plan.price_yearly > 0 ? Math.round(plan.price_yearly / 12) : plan.price_monthly)
                                    : plan.price_monthly;
                                const btnState = getButtonState(plan);
                                const discount = yearlyDiscount(plan);
                                const features = Array.isArray(plan.features) ? plan.features : [];
                                const isCurrentPlan = currentSub?.plan_id === plan.id && currentSub?.status === 'ativo';

                                return (
                                    <div
                                        key={plan.id}
                                        className={`relative rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col
                                            ${plan.is_popular ? 'border-primary/50 shadow-[0_0_40px_rgba(123,97,255,0.15)] scale-[1.02]' : 'border-white/10 hover:border-white/20'}
                                            ${isCurrentPlan ? 'ring-2 ring-emerald-500/50' : ''}`}
                                    >
                                        {/* Popular badge */}
                                        {plan.is_popular && (
                                            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-violet-600 text-center py-1.5">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">★ Mais Popular</span>
                                            </div>
                                        )}

                                        {/* Current plan badge */}
                                        {isCurrentPlan && (
                                            <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-center py-1.5">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">✓ Seu Plano Atual</span>
                                            </div>
                                        )}

                                        <div className={`bg-gradient-to-br ${getTierGradient(plan.tier)} p-8 flex-1 flex flex-col ${plan.is_popular || isCurrentPlan ? 'pt-12' : ''}`}>
                                            {/* Header */}
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-primary">{getTierIcon(plan.tier)}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-sora font-bold text-white">{plan.name}</h3>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{plan.tier}</span>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="mb-8">
                                                {plan.price_monthly === 0 ? (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-4xl font-sora font-black text-white">Grátis</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-slate-400 text-lg">R$</span>
                                                            <span className="text-5xl font-sora font-black text-white">{Math.floor(price)}</span>
                                                            <span className="text-slate-500 font-medium">/mês</span>
                                                        </div>
                                                        {billing === 'yearly' && discount > 0 && (
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="text-slate-500 line-through text-sm">R$ {plan.price_monthly}/mês</span>
                                                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">-{discount}%</span>
                                                            </div>
                                                        )}
                                                        {billing === 'yearly' && plan.price_yearly > 0 && (
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                Cobrado R$ {plan.price_yearly.toLocaleString('pt-BR')} anualmente
                                                            </p>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {/* Credits */}
                                            <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-6">
                                                <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Créditos / mês</p>
                                                <p className="font-mono text-2xl text-white font-bold">
                                                    {plan.credits_quota < 0 ? '∞ Ilimitado' : plan.credits_quota.toLocaleString('pt-BR')}
                                                </p>
                                            </div>

                                            {/* Features */}
                                            <ul className="space-y-3 mb-8 flex-1">
                                                {features.map((feat: any, i: number) => {
                                                    const featureName = typeof feat === 'string' ? feat : (feat?.name || String(feat));
                                                    const isIncluded = typeof feat === 'object' && feat !== null ? feat.included !== false : true;
                                                    return (
                                                        <li key={i} className="flex items-start gap-2.5 text-sm">
                                                            <span className={`material-symbols-outlined text-base mt-0.5 shrink-0 ${isIncluded ? 'text-emerald-400' : 'text-slate-600'}`}>
                                                                {isIncluded ? 'check_circle' : 'cancel'}
                                                            </span>
                                                            <span className={isIncluded ? 'text-slate-300' : 'text-slate-600 line-through'}>{featureName}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>

                                            {/* CTA Button */}
                                            {btnState.variant === 'current' ? (
                                                <button disabled className="w-full py-4 rounded-xl font-bold text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default">
                                                    ✓ Plano Atual
                                                </button>
                                            ) : btnState.variant === 'upgrade' ? (
                                                <button
                                                    onClick={btnState.action!}
                                                    disabled={subscribing === plan.id}
                                                    className="w-full py-4 rounded-xl font-bold text-sm bg-primary text-white shadow-[0_0_30px_rgba(123,97,255,0.3)] hover:shadow-[0_0_40px_rgba(123,97,255,0.5)] transition-all disabled:opacity-50"
                                                >
                                                    {subscribing === plan.id ? 'Processando...' : '⚡ Fazer Upgrade'}
                                                </button>
                                            ) : btnState.variant === 'downgrade' ? (
                                                <button
                                                    onClick={btnState.action!}
                                                    disabled={subscribing === plan.id}
                                                    className="w-full py-4 rounded-xl font-bold text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
                                                >
                                                    {subscribing === plan.id ? 'Processando...' : 'Fazer Downgrade'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={btnState.action!}
                                                    disabled={subscribing === plan.id}
                                                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${plan.is_popular
                                                        ? 'bg-primary text-white shadow-[0_0_30px_rgba(123,97,255,0.3)] hover:shadow-[0_0_40px_rgba(123,97,255,0.5)]'
                                                        : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
                                                >
                                                    {subscribing === plan.id ? 'Processando...' : 'Assinar Agora'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Cancel section */}
                    {currentSub && currentSub.status === 'ativo' && (
                        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-slate-300 font-medium">
                                    Plano ativo: <span className="text-white font-bold">{currentSub.plans?.name || 'N/A'}</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1">Você pode cancelar a qualquer momento. Seus créditos serão revertidos ao plano gratuito.</p>
                            </div>
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="px-6 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all shrink-0"
                            >
                                Cancelar Assinatura
                            </button>
                        </div>
                    )}

                    {/* FAQ */}
                    <div className="mt-16 text-center pb-12">
                        <p className="text-sm text-slate-500">
                            Dúvidas? Entre em contato com o suporte. Todos os planos podem ser cancelados a qualquer momento.
                        </p>
                    </div>
                </div>

                {/* Cancel Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div className="bg-surface-dark border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <span className="material-symbols-outlined text-red-400 text-2xl">cancel</span>
                                </div>
                                <h3 className="text-xl font-sora font-bold text-white">Cancelar Assinatura</h3>
                            </div>

                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                Ao cancelar, seus créditos serão revertidos para o plano gratuito (2.000 créditos/mês).
                                Você perderá acesso às funcionalidades exclusivas do plano <span className="text-white font-bold">{currentSub?.plans?.name}</span>.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold text-sm hover:bg-white/10 transition-all"
                                >
                                    Manter Plano
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-50"
                                >
                                    {cancelling ? 'Cancelando...' : 'Confirmar Cancelamento'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
