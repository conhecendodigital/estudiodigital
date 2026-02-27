import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function AdminDashboard() {
    return (
        <div className="flex min-h-screen bg-background-dark font-display text-slate-100">
            {/* Using the standard Sidebar for now, can be swapped for an AdminSidebar later if needed */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10 overflow-y-auto w-full relative">

                {/* 1. Header */}
                <header className="flex items-center justify-between mb-8 z-10 relative">
                    <div>
                        <h1 className="text-4xl font-bold font-sora text-white tracking-tight">Visão Geral</h1>
                        <p className="text-slate-400 mt-2">Acompanhe as métricas e o desempenho da sua plataforma.</p>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white font-sora font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(123,97,255,0.3)] hover:shadow-[0_0_25px_rgba(123,97,255,0.5)]">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Baixar Relatório Mensal
                    </button>
                </header>

                {/* 2. Fita de KPIs (4 cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Faturamento Mensal */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(123,97,255,0.15)] hover:border-primary/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                +12.5%
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Faturamento Mensal</h3>
                        <p className="text-3xl font-bold font-sora text-white">R$ 45.280</p>
                    </div>

                    {/* Total de Alunos / Clientes Ativos */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(123,97,255,0.15)] hover:border-primary/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-primary/20 p-2 rounded-lg text-primary group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">group</span>
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Alunos Ativos</h3>
                        <p className="text-3xl font-bold font-sora text-white">1.204</p>
                    </div>

                    {/* Clientes Inativos / Churn */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(123,97,255,0.15)] hover:border-primary/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-rose-500/20 p-2 rounded-lg text-rose-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">person_off</span>
                            </div>
                            <div className="flex items-center gap-1 text-rose-400 text-xs font-bold bg-rose-500/10 px-2 py-1 rounded-full">
                                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                                -2.1%
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Taxa de Churn</h3>
                        <p className="text-3xl font-bold font-sora text-white">3.4% <span className="text-sm font-normal text-slate-500 ml-1"> (41 clientes)</span></p>
                    </div>

                    {/* MRR (Receita Recorrente Mensal) */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(123,97,255,0.15)] hover:border-primary/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">attach_money</span>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                +5.2%
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">MRR Atual</h3>
                        <p className="text-3xl font-bold font-sora text-white">R$ 38.150</p>
                    </div>
                </div>

                {/* 3. Gráficos (2 colunas / 1 coluna) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Gráfico Esquerda: Faturamento e Entrada de Alunos (2 colunas) */}
                    <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(123,97,255,0.05)] transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold font-sora text-white">Evolução: Faturamento vs Novos Alunos</h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(123,97,255,0.5)]"></div>
                                    <span className="text-xs text-slate-400">Faturamento</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                    <span className="text-xs text-slate-400">Alunos</span>
                                </div>
                            </div>
                        </div>

                        {/* Simulação de Gráfico Misto (Barras + Linha/Área) com SVG */}
                        <div className="w-full h-64 relative flex items-end justify-between px-4 pb-8 pt-4">
                            {/* Grid lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-full h-px bg-white/5"></div>
                                ))}
                            </div>

                            {/* Simulated SVG Path for Faturamento (Area) */}
                            <svg className="absolute inset-0 w-full h-full pb-8 pointer-events-none preserve-aspect-ratio-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgba(123,97,255,0.4)" />
                                        <stop offset="100%" stopColor="rgba(123,97,255,0)" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,80 Q10,70 20,60 T40,50 T60,30 T80,40 T100,20 L100,100 L0,100 Z"
                                    fill="url(#primaryGradient)"
                                />
                                <path
                                    d="M0,80 Q10,70 20,60 T40,50 T60,30 T80,40 T100,20"
                                    fill="none"
                                    stroke="#7b61ff"
                                    strokeWidth="2"
                                    style={{ filter: 'drop-shadow(0px 0px 4px rgba(123,97,255,0.8))' }}
                                />
                            </svg>

                            {/* Simulated Bars for Novos Alunos */}
                            {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map((month, idx) => {
                                const heights = ['30%', '45%', '35%', '60%', '50%', '80%'];
                                return (
                                    <div key={month} className="relative flex flex-col items-center justify-end w-1/12 h-full z-10 group">
                                        {/* Tooltip Hover */}
                                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background-dark border border-white/10 px-3 py-1 rounded text-xs whitespace-nowrap shadow-xl">
                                            +{Math.floor(Math.random() * 50) + 10} alunos
                                        </div>
                                        <div
                                            className="w-full max-w-[20px] bg-emerald-400/80 hover:bg-emerald-400 rounded-t-sm transition-all cursor-pointer shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                                            style={{ height: heights[idx] }}
                                        ></div>
                                        <span className="absolute -bottom-6 text-xs text-slate-500 font-mono">{month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Gráfico Direita: Retenção vs Churn (1 coluna) */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(123,97,255,0.05)] transition-all flex flex-col items-center">
                        <h3 className="text-lg font-bold font-sora text-white w-full text-left mb-6">Taxa de Retenção vs Churn</h3>

                        {/* Simulação Gráfico Donut */}
                        <div className="relative size-48 my-auto flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-[0_0_10px_rgba(123,97,255,0.2)]">
                                {/* Base Circle (Churn - Rose) */}
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="15" />
                                {/* Overlay Circle (Retention - Primary) -> Assumes 96.6% retention */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    stroke="#7b61ff"
                                    strokeWidth="15"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 - (251.2 * 0.966)}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black font-sora text-white">96.6%</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Retenção</span>
                            </div>
                        </div>

                        <div className="w-full flex justify-between mt-6 pt-6 border-t border-white/5">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 mb-1">Retidos</p>
                                <p className="text-lg font-bold text-primary">1.163</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400 mb-1">Cancelados</p>
                                <p className="text-lg font-bold text-rose-400">41</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Tabela: Últimas Assinaturas/Cancelamentos */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:shadow-[0_0_15px_rgba(123,97,255,0.05)] transition-all">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <h3 className="text-lg font-bold font-sora text-white">Últimas Movimentações (Assinaturas e Cancelamentos)</h3>
                        <button className="text-sm font-semibold text-primary hover:text-white transition-colors">Ver todas</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/20 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Plano</th>
                                    <th className="px-6 py-4">Valor</th>
                                    <th className="px-6 py-4 text-right">Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {/* Linha 1: Ativo */}
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-accent-neon flex items-center justify-center font-bold text-white text-xs border border-white/10">JP</div>
                                        <div>
                                            <p className="font-semibold text-white group-hover:text-primary transition-colors">João Pereira</p>
                                            <p className="text-xs text-slate-500">joao.pereira@email.com</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                                            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                            Ativo
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">Anual Premium</td>
                                    <td className="px-6 py-4 font-mono font-bold text-white">R$ 997,00</td>
                                    <td className="px-6 py-4 text-right text-slate-500">Há 2 min</td>
                                </tr>

                                {/* Linha 2: Cancelado */}
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <img src="https://i.pravatar.cc/150?img=47" alt="User" className="size-10 rounded-full border border-white/10" />
                                        <div>
                                            <p className="font-semibold text-white group-hover:text-primary transition-colors">Carla Mendes</p>
                                            <p className="text-xs text-slate-500">carla.mendes@email.com</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                                            <span className="size-1.5 bg-rose-500 rounded-full"></span>
                                            Cancelado
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">Mensal Básico</td>
                                    <td className="px-6 py-4 font-mono font-bold text-white">R$ 97,00</td>
                                    <td className="px-6 py-4 text-right text-slate-500">Há 45 min</td>
                                </tr>

                                {/* Linha 3: Inadimplente */}
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs border border-white/10">RS</div>
                                        <div>
                                            <p className="font-semibold text-white group-hover:text-primary transition-colors">Roberto Silva</p>
                                            <p className="text-xs text-slate-500">roberto.silva@email.com</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                                            <span className="size-1.5 bg-yellow-500 rounded-full"></span>
                                            Inadimplente
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">Mensal Pro</td>
                                    <td className="px-6 py-4 font-mono font-bold text-white">R$ 197,00</td>
                                    <td className="px-6 py-4 text-right text-slate-500">Há 2 horas</td>
                                </tr>

                                {/* Linha 4: Ativo */}
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <img src="https://i.pravatar.cc/150?img=32" alt="User" className="size-10 rounded-full border border-white/10" />
                                        <div>
                                            <p className="font-semibold text-white group-hover:text-primary transition-colors">Ana Lúcia</p>
                                            <p className="text-xs text-slate-500">ana.lucia@email.com</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                                            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                            Ativo
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">Anual VIP</td>
                                    <td className="px-6 py-4 font-mono font-bold text-white">R$ 1.997,00</td>
                                    <td className="px-6 py-4 text-right text-slate-500">Há 5 horas</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
}
