import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function ConfiguracoesPage() {
    return (
        <div className="flex min-h-screen w-full flex-row bg-background-dark font-sans text-slate-100">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 md:ml-[280px] p-6 md:p-12 max-w-[1160px] mx-auto w-full relative z-10">

                {/* Header Profile */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-[#2af5ff] animate-[pulse_3s_ease-in-out_infinite]">
                                <div
                                    className="w-full h-full rounded-full bg-cover bg-center border-4 border-background-dark"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAGMSInky33W3-2jpCCSptrN07rWl9TmNEZPlLBznk3jPnFOgxkhk2fr3wEZq7Ic0UVyEZJn0X5mQ_urH9z0U9GD7XdoJ9RdedXLcVLqHjhmUZAjZCIjeFP9barImX_0J5vidHeFB29ic0BRoQ8uwg4jW2TFWDw0oQvNvjrucST3YDQtblZ2n4kawqtwr-2Bvabt08DDASM6xLBN8wA3MHNnclJSVmYDlBQmirH0mb6vKrS4SScycKlMXgB8sOCtAj95g51Df2AxNQ")' }}
                                />
                            </div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-4 border-background-dark rounded-full"></div>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-2">Mariana Silva</h1>
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                                Plano Performance
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-all">
                            Ver histórico
                        </button>
                        <button className="px-6 py-3 rounded-full bg-primary text-white text-sm font-bold shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:scale-105 transition-transform duration-300">
                            Upgrade Pro
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Edit Profile Section */}
                        <section className="bg-surface-dark/80 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                            <h2 className="text-xl font-serif font-semibold mb-8 flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                Personalização de Marca
                            </h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400 ml-1">Seu Nicho</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                            type="text"
                                            defaultValue="Marketing Digital & Tech"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400 ml-1">Tom de Voz</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none appearance-none">
                                            <option value="profissional">Profissional & Persuasivo</option>
                                            <option value="casual">Casual & Amigável</option>
                                            <option value="autoritario">Autoritário</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">Perfil Instagram</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-mono font-bold">@</span>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                            type="text"
                                            defaultValue="mariana.silva_digital"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
                                    <button className="text-slate-400 text-sm font-medium hover:text-white transition-colors flex items-center gap-2 group w-full sm:w-auto justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-90 transition-transform duration-300"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                                        Alterar Senha
                                    </button>
                                    <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all w-full sm:w-auto shadow-[0_4px_20px_rgba(123,97,255,0.3)] hover:shadow-[0_4px_25px_rgba(123,97,255,0.5)]">
                                        Salvar Alterações
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Notifications */}
                        <section className="bg-surface-dark/80 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                            <h2 className="text-xl font-serif font-semibold mb-8 flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                                Preferências de Alerta
                            </h2>
                            <div className="space-y-6">

                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-slate-200">Notificações por E-mail</p>
                                        <p className="text-sm text-text-muted mt-1">Resumos semanais e atualizações de novos recursos.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:shadow-[0_0_10px_rgba(123,97,255,0.6)]"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-slate-200">Push Mobile</p>
                                        <p className="text-sm text-text-muted mt-1">Alertas em tempo real quando sua IA completar tarefas.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:shadow-[0_0_10px_rgba(123,97,255,0.6)]"></div>
                                    </label>
                                </div>

                            </div>
                        </section>

                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-5 space-y-8">

                        {/* Credits Card */}
                        <div className="bg-primary/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/30 blur-3xl rounded-full"></div>

                            <div className="relative z-10">
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Créditos Disponíveis</p>
                                <div className="flex items-baseline gap-2 mb-8">
                                    <h3 className="text-5xl font-serif font-extrabold text-white">1.250</h3>
                                    <span className="text-slate-400 font-medium">tokens</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-300">Uso mensal</span>
                                        <span className="font-mono text-primary font-semibold">62% consumido</span>
                                    </div>

                                    <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-primary to-[#9d50bb] shadow-[0_0_15px_rgba(123,97,255,0.5)]"
                                            style={{ width: "62%" }}></div>
                                    </div>

                                    <p className="text-xs text-slate-500 italic">Próxima renovação em 12 de Outubro</p>
                                </div>

                                <button className="w-full mt-8 bg-white text-background-dark font-bold py-4 rounded-xl hover:bg-slate-200 transition-all transform hover:-translate-y-1">
                                    Comprar Mais Créditos
                                </button>
                            </div>
                        </div>

                        {/* Upsell Card */}
                        <div className="relative rounded-[2rem] p-[2px] bg-gradient-to-tr from-primary to-[#2af5ff] group cursor-pointer overflow-hidden shadow-[0_0_30px_rgba(42,245,255,0.15)]">
                            <div className="bg-surface-dark rounded-[calc(2rem-2px)] p-8 h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[#2af5ff]/50 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2af5ff]"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
                                    </div>
                                    <span className="bg-[#2af5ff]/10 text-[#2af5ff] text-[10px] font-black uppercase px-2 py-1 rounded">Promoção</span>
                                </div>
                                <h4 className="text-xl font-serif font-bold mb-2">Upgrade para Plano Anual</h4>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    Poupe 30% e desbloqueie acesso prioritário aos modelos GPT-5 customizados.
                                </p>
                                <button className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
                                    Ver Planos
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="bg-surface-dark/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-full shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-200">Sua conta está segura</p>
                                <p className="text-xs text-text-muted mt-1">Autenticação em duas etapas ativa.</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Meta */}
                <footer className="mt-16 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm border-t border-white/5 pt-8 pb-4 gap-4">
                    <p>© 2026 chave.ai - Inteligência Gerativa de Ponta</p>
                    <div className="flex gap-6">
                        <a className="hover:text-slate-300 transition-colors" href="#">Termos de Uso</a>
                        <a className="hover:text-slate-300 transition-colors" href="#">Privacidade</a>
                    </div>
                </footer>

            </main>
        </div>
    );
}
