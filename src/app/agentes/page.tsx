'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function AgentesLibraryPage() {
    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative min-h-screen md:ml-[280px]">
                {/* Abstract Plasma Accents */}
                <div
                    className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none opacity-50"
                    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(123, 97, 255, 0.15) 0%, rgba(10, 10, 20, 0) 70%)' }}
                ></div>
                <div
                    className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none opacity-30"
                    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(123, 97, 255, 0.15) 0%, rgba(10, 10, 20, 0) 70%)' }}
                ></div>

                <div className="max-w-7xl mx-auto px-10 py-12 relative z-10">
                    {/* Header Section */}
                    <header className="mb-12">
                        <h2 className="text-6xl font-sora font-extrabold tracking-tighter mb-4 text-slate-100">
                            Biblioteca de Agentes
                        </h2>
                        <p className="text-2xl font-serif italic text-slate-400"> {/* font-instrument becomes font-serif in Tailwind config */}
                            Ative o seu ecossistema de produtividade.
                        </p>
                    </header>

                    {/* Filters */}
                    <div className="flex gap-3 mb-12 overflow-x-auto pb-2 custom-scrollbar">
                        <button className="px-6 py-2.5 rounded-full glass-card bg-primary text-white font-medium border-primary/40 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Todos</button>
                        <button className="px-6 py-2.5 rounded-full glass-card text-slate-400 hover:text-white hover:bg-white/10 transition-all font-medium">Produtividade</button>
                        <button className="px-6 py-2.5 rounded-full glass-card text-slate-400 hover:text-white hover:bg-white/10 transition-all font-medium">Conteúdo</button>
                        <button className="px-6 py-2.5 rounded-full glass-card text-slate-400 hover:text-white hover:bg-white/10 transition-all font-medium">Vendas</button>
                        <button className="px-6 py-2.5 rounded-full glass-card text-slate-400 hover:text-white hover:bg-white/10 transition-all font-medium">Estratégico</button>
                    </div>

                    {/* Agent Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Agent Card: Active 1 */}
                        <div className="glass-card rounded-2xl p-6 flex flex-col group transition-all duration-300">
                            <div className="mb-6 size-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/20 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-3xl">movie_edit</span>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-sora font-bold text-lg text-slate-100 group-hover:text-primary transition-colors">Copywriter de Reels</h3>
                                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono font-bold border border-primary/30">ATIVO</span> {/* font-fira becomes font-mono */}
                            </div>
                            <p className="text-sm text-slate-400 font-sora leading-relaxed mb-8 flex-grow">
                                Criação de roteiros virais e legendas magnéticas otimizadas para retenção.
                            </p>
                            <button className="btn-magnetic w-full py-3 rounded-xl bg-white/5 hover:bg-primary text-slate-100 font-bold transition-all flex items-center justify-center gap-2">
                                Acessar
                                <span className="material-symbols-outlined text-sm pt-0.5">arrow_forward</span>
                            </button>
                        </div>

                        {/* Agent Card: Active 2 */}
                        <div className="glass-card rounded-2xl p-6 flex flex-col group transition-all duration-300">
                            <div className="mb-6 size-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-3xl">chat_bubble</span>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-sora font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors">Script de WhatsApp</h3>
                                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono font-bold border border-primary/30">ATIVO</span>
                            </div>
                            <p className="text-sm text-slate-400 font-sora leading-relaxed mb-8 flex-grow">
                                Sequências persuasivas para fechamento imediato e quebra de objeções.
                            </p>
                            <button className="btn-magnetic w-full py-3 rounded-xl bg-white/5 hover:bg-primary text-slate-100 font-bold transition-all flex items-center justify-center gap-2">
                                Acessar
                                <span className="material-symbols-outlined text-sm pt-0.5">arrow_forward</span>
                            </button>
                        </div>

                        {/* Agent Card: Active 3 */}
                        <div className="glass-card rounded-2xl p-6 flex flex-col group transition-all duration-300">
                            <div className="mb-6 size-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-3xl">search</span>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-sora font-bold text-lg text-slate-100 group-hover:text-blue-400 transition-colors">Analista de SEO</h3>
                                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono font-bold border border-primary/30">ATIVO</span>
                            </div>
                            <p className="text-sm text-slate-400 font-sora leading-relaxed mb-8 flex-grow">
                                Otimização técnica e estratégica de palavras-chave para mecanismos de busca.
                            </p>
                            <button className="btn-magnetic w-full py-3 rounded-xl bg-white/5 hover:bg-primary text-slate-100 font-bold transition-all flex items-center justify-center gap-2">
                                Acessar
                                <span className="material-symbols-outlined text-sm pt-0.5">arrow_forward</span>
                            </button>
                        </div>

                        {/* Agent Card: Active 4 */}
                        <div className="glass-card rounded-2xl p-6 flex flex-col group transition-all duration-300">
                            <div className="mb-6 size-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/20 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-3xl">mail</span>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-sora font-bold text-lg text-slate-100 group-hover:text-orange-400 transition-colors">Gestor de E-mails</h3>
                                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono font-bold border border-primary/30">ATIVO</span>
                            </div>
                            <p className="text-sm text-slate-400 font-sora leading-relaxed mb-8 flex-grow">
                                Organização e respostas inteligentes para seu inbox com priorização automática.
                            </p>
                            <button className="btn-magnetic w-full py-3 rounded-xl bg-white/5 hover:bg-primary text-slate-100 font-bold transition-all flex items-center justify-center gap-2">
                                Acessar
                                <span className="material-symbols-outlined text-sm pt-0.5">arrow_forward</span>
                            </button>
                        </div>

                        {/* Agent Card: Locked 1 */}
                        <div className="glass-card rounded-2xl p-6 flex flex-col relative overflow-hidden opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/40">
                                <span className="material-symbols-outlined text-white/50 text-6xl">lock</span>
                            </div>
                            <div className="mb-6 size-14 rounded-2xl bg-slate-700 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-3xl">brush</span>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-sora font-bold text-lg text-slate-100">Designer de Prompts</h3>
                                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono font-bold border border-white/20">EM BREVE</span>
                            </div>
                            <p className="text-sm text-slate-400 font-sora leading-relaxed mb-8 flex-grow">
                                Engenharia reversa de imagens e criação de comandos ultra-precisos.
                            </p>
                            <div className="text-[10px] font-mono text-slate-500 uppercase">Versão 2.0</div>
                        </div>

                        {/* Agent Card: Locked 2 */}
                        <div className="glass-card rounded-2xl p-6 flex flex-col relative overflow-hidden opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/40">
                                <span className="material-symbols-outlined text-white/50 text-6xl">lock</span>
                            </div>
                            <div className="mb-6 size-14 rounded-2xl bg-slate-700 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-3xl">translate</span>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-sora font-bold text-lg text-slate-100">Tradutor Contextual</h3>
                                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono font-bold border border-white/20">EM BREVE</span>
                            </div>
                            <p className="text-sm text-slate-400 font-sora leading-relaxed mb-8 flex-grow">
                                Tradução fluida com adaptação de gírias e contextos culturais regionais.
                            </p>
                            <div className="text-[10px] font-mono text-slate-500 uppercase">Versão 2.0</div>
                        </div>

                        {/* Agent Card: Locked 3 */}
                        <div className="glass-card rounded-2xl p-6 flex flex-col relative overflow-hidden opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/40">
                                <span className="material-symbols-outlined text-white/50 text-6xl">lock</span>
                            </div>
                            <div className="mb-6 size-14 rounded-2xl bg-slate-700 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-3xl">monitoring</span>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-sora font-bold text-lg text-slate-100">Analista de Dados</h3>
                                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono font-bold border border-white/20">EM BREVE</span>
                            </div>
                            <p className="text-sm text-slate-400 font-sora leading-relaxed mb-8 flex-grow">
                                Transforme planilhas complexas em insights acionáveis e visualizações.
                            </p>
                            <div className="text-[10px] font-mono text-slate-500 uppercase">Versão 2.0</div>
                        </div>

                        {/* Agent Card: Locked 4 */}
                        <div className="glass-card rounded-2xl p-6 flex flex-col relative overflow-hidden opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/40">
                                <span className="material-symbols-outlined text-white/50 text-6xl">lock</span>
                            </div>
                            <div className="mb-6 size-14 rounded-2xl bg-slate-700 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-3xl">school</span>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-sora font-bold text-lg text-slate-100">Pesquisador Acadêmico</h3>
                                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono font-bold border border-white/20">EM BREVE</span>
                            </div>
                            <p className="text-sm text-slate-400 font-sora leading-relaxed mb-8 flex-grow">
                                Sintetize papers e artigos científicos em resumos estruturados.
                            </p>
                            <div className="text-[10px] font-mono text-slate-500 uppercase">Versão 2.0</div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
