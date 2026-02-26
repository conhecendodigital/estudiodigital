'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function MonitoramentoCustosAdminPage() {
    return (
        <div className="flex min-h-screen w-full flex-row bg-background-dark font-display text-slate-100">
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-[280px] p-6 md:p-10 relative z-10 w-full min-h-screen overflow-x-hidden mb-[80px] lg:mb-0">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Monitoramento Financeiro</h2>
                        <p className="text-slate-400 text-sm md:text-base">Visão geral do consumo de tokens e infraestrutura.</p>
                    </div>

                    {/* Time Filters */}
                    <div className="flex flex-wrap items-center gap-2 bg-slate-800/40 p-1.5 rounded-full border border-slate-700/50 backdrop-blur-md w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-4 md:px-5 py-2 text-xs font-bold rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition-all">Hoje</button>
                        <button className="flex-1 md:flex-none px-4 md:px-5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">7 dias</button>
                        <button className="flex-1 md:flex-none px-4 md:px-5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">30 dias</button>
                        <button className="flex-1 md:flex-none px-4 md:px-5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2">
                            Custom <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        </button>
                    </div>
                </header>

                {/* KPI Row (4 Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Custo Total */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Custo Total</p>
                            <h3 className="text-2xl font-bold text-white tracking-tight">$ 4,240.00</h3>
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
                            <h3 className="text-2xl font-bold text-white tracking-tight">842k</h3>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold">
                                <span className="material-symbols-outlined text-xs">trending_down</span> -3%
                            </span>
                            <span className="text-xs text-slate-500">vs. ontem</span>
                        </div>
                    </div>

                    {/* Custo por Usuária */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Custo por Conta</p>
                            <h3 className="text-2xl font-mono font-medium text-white tracking-tight">$ 3.40</h3>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                                Estável
                            </span>
                        </div>
                    </div>

                    {/* Margem Estimada */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-20 -mr-16 -mt-16 group-hover:opacity-40 transition-opacity" style={{ background: 'linear-gradient(135deg, #6d51fb 0%, #00f5ff 100%)' }}></div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-slate-400 mb-1">Margem Estimada</p>
                            <h3 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #6d51fb 0%, #00f5ff 100%)' }}>68%</h3>
                        </div>
                        <div className="mt-4 flex items-center gap-2 relative z-10">
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div className="h-1.5 rounded-full" style={{ width: '68%', background: 'linear-gradient(135deg, #6d51fb 0%, #00f5ff 100%)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Chart Section */}
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

                    {/* SVG Chart Mockup Container */}
                    <div className="h-[200px] md:h-[300px] w-full relative">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#6d51fb" stopOpacity="0.5"></stop>
                                    <stop offset="100%" stopColor="#00f5ff" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            <path d="M0,150 Q50,140 100,100 T200,80 T300,120 T400,90 T500,60 T600,85 T700,50 T800,70 T900,40 T1000,30 L1000,200 L0,200 Z" fill="url(#chartGradient)"></path>
                            <path d="M0,150 Q50,140 100,100 T200,80 T300,120 T400,90 T500,60 T600,85 T700,50 T800,70 T900,40 T1000,30" fill="none" stroke="#6d51fb" strokeLinecap="round" strokeWidth="3"></path>
                            {/* Tooltip Point */}
                            <circle cx="700" cy="50" fill="#6d51fb" r="6"></circle>
                            <circle cx="700" cy="50" fill="#6d51fb" fillOpacity="0.3" r="12" className="animate-pulse"></circle>
                        </svg>

                        {/* Chart Labels */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pt-4 border-t border-slate-800 text-[9px] md:text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                            <span>01 Out</span>
                            <span className="hidden sm:inline">05 Out</span>
                            <span>10 Out</span>
                            <span className="hidden sm:inline">15 Out</span>
                            <span>20 Out</span>
                            <span className="hidden sm:inline">25 Out</span>
                            <span>31 Out</span>
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
                                    {/* Agent Row 1 */}
                                    <tr className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-4 font-semibold text-slate-200 px-2 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center border border-primary/20">
                                                <span className="material-symbols-outlined text-[16px]">support_agent</span>
                                            </div>
                                            Suporte VIP
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className="px-2 py-1 rounded-md bg-white/5 text-slate-300 text-[10px] font-mono border border-white/10 uppercase tracking-widest">GPT-4o</span>
                                        </td>
                                        <td className="py-4 text-slate-400 px-2">142,500</td>
                                        <td className="py-4 font-mono text-slate-400 text-right px-2">12.4M</td>
                                        <td className="py-4 font-bold text-white text-right px-2">$ 840.20</td>
                                        <td className="py-4 px-2">
                                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-1.5 rounded-full" style={{ width: '45%', background: 'linear-gradient(135deg, #6d51fb 0%, #00f5ff 100%)' }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Agent Row 2 */}
                                    <tr className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-4 font-semibold text-slate-200 px-2 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                                                <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                                            </div>
                                            Sales Pro
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className="px-2 py-1 rounded-md bg-white/5 text-slate-300 text-[10px] font-mono border border-white/10 uppercase tracking-widest">Claude 3.5</span>
                                        </td>
                                        <td className="py-4 text-slate-400 px-2">98,200</td>
                                        <td className="py-4 font-mono text-slate-400 text-right px-2">8.1M</td>
                                        <td className="py-4 font-bold text-white text-right px-2">$ 612.45</td>
                                        <td className="py-4 px-2">
                                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-1.5 rounded-full" style={{ width: '32%', background: 'linear-gradient(135deg, #6d51fb 0%, #00f5ff 100%)' }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Agent Row 3 */}
                                    <tr className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-4 font-semibold text-slate-200 px-2 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                                                <span className="material-symbols-outlined text-[16px]">code</span>
                                            </div>
                                            Dev Assistant
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className="px-2 py-1 rounded-md bg-white/5 text-slate-300 text-[10px] font-mono border border-white/10 uppercase tracking-widest">o1-preview</span>
                                        </td>
                                        <td className="py-4 text-slate-400 px-2">45,100</td>
                                        <td className="py-4 font-mono text-slate-400 text-right px-2">24.8M</td>
                                        <td className="py-4 font-bold text-white text-right px-2">$ 1,240.00</td>
                                        <td className="py-4 px-2">
                                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-1.5 rounded-full" style={{ width: '78%', background: 'linear-gradient(135deg, #6d51fb 0%, #00f5ff 100%)' }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Agent Row 4 */}
                                    <tr className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-4 font-semibold text-slate-200 px-2 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/20">
                                                <span className="material-symbols-outlined text-[16px]">campaign</span>
                                            </div>
                                            Social Manager
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className="px-2 py-1 rounded-md bg-white/5 text-slate-300 text-[10px] font-mono border border-white/10 uppercase tracking-widest">GPT-4o mini</span>
                                        </td>
                                        <td className="py-4 text-slate-400 px-2">320,400</td>
                                        <td className="py-4 font-mono text-slate-400 text-right px-2">5.2M</td>
                                        <td className="py-4 font-bold text-white text-right px-2">$ 45.10</td>
                                        <td className="py-4 px-2">
                                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-1.5 rounded-full" style={{ width: '15%', background: 'linear-gradient(135deg, #6d51fb 0%, #00f5ff 100%)' }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top 5 Contas Section (Adjusted from 10 layout para melhor encaixe) */}
                    <div className="lg:col-span-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-lg font-bold text-white">Top 5 Contas</h4>
                            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined text-slate-500 text-[20px]">more_vert</span>
                            </button>
                        </div>

                        <div className="space-y-4 flex-1">
                            {/* User 1 */}
                            <div className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-cover bg-center border border-primary/30" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD6Y8A9UYksWZs8b8G7zmDEfTGTUnWyQd6s32RsIa_9hItWAaKVYr2-TthKaTklRAF56aFubtQnOchN6aRvsbKGI4WgZLa3Bdng2m9-D3ODLDvV57I8St0DUX4uD7T7jPQv8ghLg0zN7HE0RZQAa5rmpIzX5oEhyucqqSa8zx2Fd022hj-bUXcKGZfoRMUmQJOin1KWFq01lmjqB4J49aSwGfP9CLtd6-Us3wCJs9aR6clQqG5_70dSH2xR274dzXvOpn958adWYYA')" }}></div>
                                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-background-dark rounded-full"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-100 group-hover:text-primary transition-colors">Elena Silva</p>
                                        <p className="text-[10px] text-slate-500 font-mono tracking-wider">1.2M Tks</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-white bg-black/30 px-2 py-1 rounded-md">$ 124.5</p>
                            </div>
                            {/* User 2 */}
                            <div className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-cover bg-center border border-primary/30" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAkpzyAUxaKY4Iu5DJGs565mJIaOlJd4OPtp31D1beDlZCFX5yogIVGC7wrxpparnhlUOGq3y32P7bP5EUezbl-RisZAFVCkXdRUQTWLvO_pi0IH-ehDOdASCQL7oOB3CU6Dn13740qO8fsR5wQ_dRxFAh5yGA0GJeiw7DjozAiJJRJDd_gSwwtRw0dFC4iT9iw2tFzDUAkfsNRlP7pltrG-QhfA5S17R3vW31yEqJca1xIJwPs5-KeczzwswvEv1DBUJHuDmYw4m4')" }}></div>
                                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-background-dark rounded-full"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-100 group-hover:text-primary transition-colors">Marcus Costa</p>
                                        <p className="text-[10px] text-slate-500 font-mono tracking-wider">940k Tks</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-white bg-black/30 px-2 py-1 rounded-md">$ 92.2</p>
                            </div>
                            {/* User 3 */}
                            <div className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-cover bg-center border border-primary/30" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBAaQEcMmcfNosRycJU8-x43z14VMabS4T5sp3guZJB2onvf-03sJ7By7vFn3wTGKHWIpbgOZIh8IzN7bZH224m_IBG_aRWBgB3JMyVrbOYm8lf5AT5yczWXTO9_NzE_KXhdvgVsIIfCAVFsUqZ1_GZQqh2WCkMWgKoMlhPtiosFCnwLjml7FCieDKVvfgJNSh-NrdDGXxsD4Z_PBKTw2sQbwrg6Vb1Tv45WfWZ56UvlSTddhq3IwPOlvFzn6Osop9pBQO6mgkDRhI')" }}></div>
                                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-slate-500 border-2 border-background-dark rounded-full"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-100 group-hover:text-primary transition-colors">Julia Santos</p>
                                        <p className="text-[10px] text-slate-500 font-mono tracking-wider">850k Tks</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-white bg-black/30 px-2 py-1 rounded-md">$ 84.1</p>
                            </div>
                            {/* User 4 */}
                            <div className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-cover bg-center border border-primary/30" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuClkQH7dr6btBtz_UF9cp0kmHxW2Q4u1CEfN3182-MBfLaI4RQCCQgyqk5qQP-REMjmC-zzgbdD3iiTK3mrrfUVCTxrbCMhOO9N8zmiWvRbu9vVLG7aQ5hiAEEwRxU2FH_dhJ4pz5X192_CoC-D7wDZLBA7Mn7JSjmtvAyL7JMqzv0pwcThcv3b2bTDjwXjvTdYmBXTh9aKs3HqYC5l1KKfp2M4rrg3iqyf-ABHpiOQv_D5FCUD2ykp_O8gUuh2440Qm2XVEp3FYZc')" }}></div>
                                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-background-dark rounded-full"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-100 group-hover:text-primary transition-colors">Ricardo Lima</p>
                                        <p className="text-[10px] text-slate-500 font-mono tracking-wider">720k Tks</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-white bg-black/30 px-2 py-1 rounded-md">$ 72.8</p>
                            </div>
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
