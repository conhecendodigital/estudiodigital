'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function GestaoPlanosAdminPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex min-h-screen w-full flex-row bg-background-dark font-display text-slate-100 selection:bg-primary selection:text-white">
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-[280px] relative z-10 w-full min-h-screen overflow-x-hidden pb-[80px] lg:pb-0">
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
                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/30 w-full md:w-auto">
                        <span className="material-symbols-outlined">add</span>
                        Criar Novo Plano
                    </button>
                </header>

                {/* Pricing Grid */}
                <div className="p-6 md:p-10 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Starter Card */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col relative group hover:border-white/20 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Iniciante</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-emerald-500 font-bold uppercase">Ativo</span>
                                <div className="w-8 h-4 bg-emerald-500/20 rounded-full flex items-center px-0.5">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full ml-auto"></div>
                                </div>
                            </div>
                        </div>
                        <h3 className="font-sora font-extrabold text-3xl mb-4">Starter</h3>
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-slate-400 text-lg">R$</span>
                                <span className="text-white font-sora font-bold text-5xl">97</span>
                                <span className="text-slate-500 font-medium">/mês</span>
                            </div>
                            <p className="text-slate-500 text-sm mt-1">Anual: R$ 997/ano</p>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8">
                            <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Cota de Créditos</p>
                            <p className="font-mono text-2xl text-white">100.000 <span className="text-sm opacity-60">créditos</span></p>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                <span>Acesso ao Painel Básico</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                <span>Suporte via Email</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm opacity-40">
                                <span className="material-symbols-outlined text-rose-500 text-xl">cancel</span>
                                <span className="line-through">API Privada</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm opacity-40">
                                <span className="material-symbols-outlined text-rose-500 text-xl">cancel</span>
                                <span className="line-through">Webhooks Customizados</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-primary hover:border-transparent font-bold transition-all text-white"
                        >
                            Editar Plano
                        </button>
                    </div>

                    {/* Pro Card */}
                    <div className="bg-white/5 backdrop-blur-md border border-primary/50 ring-1 ring-primary/30 rounded-2xl p-8 flex flex-col relative group hover:shadow-[0_0_30px_rgba(123,97,255,0.15)] transition-all">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(123,97,255,0.4)] whitespace-nowrap">Mais Popular</div>
                        <div className="flex justify-between items-start mb-6">
                            <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Profissional</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-emerald-500 font-bold uppercase">Ativo</span>
                                <div className="w-8 h-4 bg-emerald-500/20 rounded-full flex items-center px-0.5">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full ml-auto"></div>
                                </div>
                            </div>
                        </div>
                        <h3 className="font-sora font-extrabold text-3xl mb-4">Pro</h3>
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-slate-400 text-lg">R$</span>
                                <span className="text-white font-sora font-bold text-5xl">197</span>
                                <span className="text-slate-500 font-medium">/mês</span>
                            </div>
                            <p className="text-slate-500 text-sm mt-1">Anual: R$ 1.997/ano</p>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8">
                            <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Cota de Créditos</p>
                            <p className="font-mono text-2xl text-white">500.000 <span className="text-sm opacity-60">créditos</span></p>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                <span>Acesso ao Painel Completo</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                <span>Suporte Prioritário</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                <span>Acesso API (Restrito)</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                <span>5 Webhooks Ativos</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold transition-all text-white"
                        >
                            Editar Plano
                        </button>
                    </div>

                    {/* Enterprise Card */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col relative group hover:border-white/20 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Escalável</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-emerald-500 font-bold uppercase">Ativo</span>
                                <div className="w-8 h-4 bg-emerald-500/20 rounded-full flex items-center px-0.5">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full ml-auto"></div>
                                </div>
                            </div>
                        </div>
                        <h3 className="font-sora font-extrabold text-3xl mb-4">Enterprise</h3>
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-slate-400 text-lg">R$</span>
                                <span className="text-white font-sora font-bold text-5xl">497</span>
                                <span className="text-slate-500 font-medium">/mês</span>
                            </div>
                            <p className="text-slate-500 text-sm mt-1">Anual: R$ 4.997/ano</p>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8">
                            <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Cota de Créditos</p>
                            <p className="font-mono text-2xl text-white">Ilimitados</p>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                <span>White-label Customizado</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                <span>Gerente de Conta</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                <span>API Full Access</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                <span>Webhooks Ilimitados</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-primary hover:border-transparent font-bold transition-all text-white"
                        >
                            Editar Plano
                        </button>
                    </div>
                </div>
            </main>

            {/* Modal Overlay Componentizado Inline */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-background-dark/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                    <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col shadow-[0_25px_50px_-12px_rgba(123,97,255,0.25)] border border-white/10 my-8">
                        {/* Modal Header */}
                        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
                            <div>
                                <h2 className="font-sora font-bold text-xl md:text-2xl text-white">Editar Configurações do Plano</h2>
                                <p className="text-slate-500 text-xs md:text-sm mt-1">Modifique as definições do plano Pro</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all bg-white/5 border border-white/10"
                            >
                                <span className="material-symbols-outlined text-slate-400">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* General Settings */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Nome do Plano</label>
                                        <input
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm md:text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white"
                                            type="text"
                                            defaultValue="Pro Professional"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Preço Mensal (R$)</label>
                                            <input
                                                className="w-full font-mono bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm md:text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white"
                                                type="text"
                                                defaultValue="197,00"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Preço Anual (R$)</label>
                                            <input
                                                className="w-full font-mono bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm md:text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white"
                                                type="text"
                                                defaultValue="1.997,00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Cota de Créditos</label>
                                        <input
                                            className="w-full font-mono bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm md:text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white"
                                            type="number"
                                            defaultValue="500000"
                                        />
                                    </div>
                                </div>

                                {/* Webhooks & Integrations */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Webhook Hotmart URL</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl">link</span>
                                            <input
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm md:text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white"
                                                placeholder="https://app.chave.ai/api/v1/hotmart/webhook-123"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Webhook Kiwify URL</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl">link</span>
                                            <input
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm md:text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white"
                                                placeholder="https://app.chave.ai/api/v1/kiwify/webhook-456"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Recursos Ativos</label>
                                        <div className="space-y-3 mt-4">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center">
                                                    <input defaultChecked className="peer h-5 w-5 bg-black/40 border border-white/20 rounded accent-primary text-primary focus:ring-primary" type="checkbox" />
                                                </div>
                                                <span className="text-sm text-slate-200">API Full Access</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center">
                                                    <input defaultChecked className="peer h-5 w-5 bg-black/40 border border-white/20 rounded accent-primary text-primary focus:ring-primary" type="checkbox" />
                                                </div>
                                                <span className="text-sm text-slate-200">White-labeling</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center">
                                                    <input className="peer h-5 w-5 bg-black/40 border border-white/20 rounded accent-primary text-primary focus:ring-primary" type="checkbox" />
                                                </div>
                                                <span className="text-sm text-slate-200">Suporte 24/7 dedicado</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 md:p-8 bg-black/20 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 hidden sm:flex">
                                <span className="text-sm text-slate-400">Status do Plano:</span>
                                <button className="relative w-12 h-6 bg-primary rounded-full flex items-center px-1">
                                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                                </button>
                                <span className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Ativo</span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-display text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-primary/40 active:scale-95 font-display"
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
