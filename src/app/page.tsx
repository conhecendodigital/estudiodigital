import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function DashboardHome() {
    return (
        <div className="flex min-h-screen bg-background-dark font-display">
            {/* Sidebar Overlay */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10 overflow-y-auto w-full relative">
                {/* Header */}
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-4xl font-serif italic text-white leading-tight">Olá, Mariana!</h2>
                        <p className="text-slate-400 mt-1">Bem-vinda de volta ao centro de comando.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-slate-900 border border-white/10 rounded-full flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-semibold tracking-wide text-slate-300 uppercase">Sistema Operacional Ativo</span>
                        </div>
                        <button className="size-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                    </div>
                </header>

                {/* Top Row Grid */}
                <div className="grid grid-cols-12 gap-6 mb-10">
                    {/* Credits Card */}
                    <div className="col-span-12 lg:col-span-5 glass-card rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden bg-card-dark">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <span className="material-symbols-outlined text-primary text-3xl">token</span>
                                <span className="text-xs font-mono text-slate-400">RENOVA EM 12 DIAS</span>
                            </div>
                            <h3 className="text-slate-300 text-sm font-medium uppercase tracking-widest mb-1 font-sora">Créditos Disponíveis</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-white">1.250</span>
                                <span className="text-slate-500 font-medium font-sora">/ 2.000</span>
                            </div>
                        </div>
                        <div className="mt-8 relative z-10">
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{ background: 'linear-gradient(90deg, #7b61ff 0%, #a855f7 50%, #ec4899 100%)', width: '62.5%' }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-3">
                                <span className="text-xs text-slate-500 font-mono">Consumo atual: 62%</span>
                                <a className="text-xs text-primary font-semibold hover:underline" href="#">Recarregar agora</a>
                            </div>
                        </div>
                    </div>

                    {/* Shortcuts */}
                    <div className="col-span-12 lg:col-span-7 grid grid-cols-3 gap-6">
                        <div className="bg-card-dark border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all cursor-pointer">
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-primary text-3xl">edit_note</span>
                            </div>
                            <span className="text-sm font-semibold text-white font-sora">Copywriter</span>
                            <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Criar post</span>
                        </div>

                        <div className="bg-card-dark border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all cursor-pointer">
                            <div className="size-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-purple-400 text-3xl">calendar_today</span>
                            </div>
                            <span className="text-sm font-semibold text-white font-sora">Gestor de Agenda</span>
                            <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Otimizar</span>
                        </div>

                        <div className="bg-card-dark border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all cursor-pointer">
                            <div className="size-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-pink-400 text-3xl">point_of_sale</span>
                            </div>
                            <span className="text-sm font-semibold text-white font-sora">Script de Vendas</span>
                            <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Gerar Pitch</span>
                        </div>
                    </div>
                </div>

                {/* Agents Grid */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white font-sora">Agentes Ativos</h3>
                        <button className="text-sm text-slate-400 hover:text-white flex items-center gap-1 font-sora transition-colors">
                            Ver todos <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Agent Card 1 */}
                        <div className="bg-card-dark border border-white/5 rounded-2xl p-6 hover:-translate-y-1 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-indigo-400">psychology</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white font-sora">Estrategista</h4>
                                        <p className="text-xs text-slate-500">v2.4 - Geração de leads</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded">
                                    <span className="size-2 bg-green-500 rounded-full animate-pulse" style={{ boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)' }}></span>
                                    <span className="text-[10px] font-bold text-green-500 uppercase">Processando</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Tarefa: Análise de concorrentes</span>
                                    <span className="text-slate-400 font-mono">88%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[88%]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Agent Card 2 */}
                        <div className="bg-card-dark border border-white/5 rounded-2xl p-6 hover:-translate-y-1 transition-all hover:shadow-xl hover:shadow-yellow-500/5">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-orange-400">history_edu</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white font-sora">Copywriter</h4>
                                        <p className="text-xs text-slate-500">v1.2 - Social Media</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-2 py-1 bg-yellow-500/10 rounded">
                                    <span className="size-2 bg-yellow-500 rounded-full animate-pulse" style={{ boxShadow: '0 0 0 0 rgba(234, 179, 8, 0.7)' }}></span>
                                    <span className="text-[10px] font-bold text-yellow-500 uppercase">Aguardando</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Tarefa: Legendas Instagram</span>
                                    <span className="text-slate-400 font-mono">Pendente</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 w-[0%]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Agent Card 3 */}
                        <div className="bg-card-dark border border-white/5 rounded-2xl p-6 hover:-translate-y-1 transition-all hover:shadow-xl hover:shadow-primary/5">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-blue-400">query_stats</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white font-sora">Data Analyst</h4>
                                        <p className="text-xs text-slate-500">v4.0 - Reports Mensais</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-2 py-1 bg-primary/20 rounded">
                                    <span className="size-2 bg-primary rounded-full"></span>
                                    <span className="text-[10px] font-bold text-primary uppercase">Concluído</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Tarefa: Fechamento de Junho</span>
                                    <span className="text-slate-400 font-mono">100%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats & Banner */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Progress Card */}
                    <div className="col-span-12 lg:col-span-4 bg-card-dark border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors">
                        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4 font-sora">Progresso da Semana</h3>
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <p className="text-5xl font-mono text-white leading-none">28</p>
                                <p className="text-sm text-slate-400 mt-2 font-medium font-sora">Conteúdos criados</p>
                            </div>
                            <div className="flex items-center gap-1 text-green-500 text-sm font-bold font-sora">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>+14%</span>
                            </div>
                        </div>

                        {/* Mini Chart */}
                        <div className="flex items-end gap-2 h-24">
                            <div className="bg-primary/20 hover:bg-primary/40 transition-colors w-full h-[40%] rounded-t cursor-pointer"></div>
                            <div className="bg-primary/20 hover:bg-primary/40 transition-colors w-full h-[60%] rounded-t cursor-pointer"></div>
                            <div className="bg-primary/20 hover:bg-primary/40 transition-colors w-full h-[35%] rounded-t cursor-pointer"></div>
                            <div className="bg-primary/20 hover:bg-primary/40 transition-colors w-full h-[85%] rounded-t cursor-pointer"></div>
                            <div className="bg-primary/20 hover:bg-primary/40 transition-colors w-full h-[55%] rounded-t cursor-pointer"></div>
                            <div className="bg-primary/60 hover:bg-primary/80 transition-colors w-full h-[70%] rounded-t cursor-pointer"></div>
                            <div className="bg-primary w-full shadow-[0_0_15px_rgba(123,97,255,0.4)] h-[95%] rounded-t"></div>
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] text-slate-600 font-mono">
                            <span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SAB</span><span className="text-primary font-bold shadow-primary">DOM</span>
                        </div>
                    </div>

                    {/* Upgrade Banner */}
                    <div className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-2xl group border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-900 to-black"></div>
                        {/* Abstract Design for Banner */}
                        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBuy4vKCHiLP9M0xXTkvA7EZS125hd8rnQcgenuw07VrGZVdkeTtVYthdYvoqyM-9mepKyAI2vfpKSBFCFNmQTKMcPH9XDv2_BKiOMA3XuX-TJiSCnuJJ3eoyV5LPUJN9wM7qjXQRE8PGBKqLRCJ-PEIkZgpIQywUbVAZLzFPJe8N9w-TUIYJBVgbb2EdDKL6_QBGmDTa7w60Ywjq31ecB4WKSaBmaaU886zie8TYUXaL_WC7WfsDhNY5NEog4NqC2ln18Y4c3WNIk")' }}></div>
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-500/30 blur-[100px] rounded-full"></div>

                        <div className="relative h-full p-10 flex flex-col md:flex-row items-center gap-10 z-10">
                            <div className="size-32 md:size-48 glass-card bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 group-hover:scale-105 transition-transform duration-500">
                                <span className="material-symbols-outlined text-7xl group-hover:text-white transition-colors">lock</span>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-3xl font-bold text-white mb-2 font-display">Upgrade para Premium</h3>
                                <p className="text-slate-200/70 mb-8 max-w-md font-sora">Desbloqueie agentes ilimitados, modelos exclusivos e acesso antecipado às novas ferramentas de IA generativa.</p>
                                <button className="btn-magnetic px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-slate-100 transition-all flex items-center gap-3 mx-auto md:mx-0 shadow-lg font-sora">
                                    Liberar Acesso <span className="material-symbols-outlined">bolt</span>
                                </button>
                            </div>
                        </div>

                        {/* Frosted glass overlay for "Locked" feel */}
                        <div className="absolute top-0 right-0 p-4 z-20">
                            <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white/90 uppercase tracking-widest font-sora">
                                Exclusive
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
