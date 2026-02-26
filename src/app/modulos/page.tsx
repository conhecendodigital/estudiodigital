import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function ModulosPage() {
    return (
        <div className="flex min-h-screen w-full flex-row bg-background-dark">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 md:ml-[280px] min-h-screen p-6 md:p-10 lg:p-14 mb-[80px] lg:mb-0 w-full relative z-10">
                <div className="max-w-7xl mx-auto space-y-10">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                Central de Módulos
                            </h1>
                            <p className="text-text-muted text-base">
                                Continue sua jornada de aprendizado de onde parou.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                </span>
                                <input
                                    className="pl-10 pr-4 py-2.5 bg-surface-dark border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 placeholder-slate-500 transition-all"
                                    placeholder="Buscar aula..."
                                    type="text"
                                />
                            </div>
                            <button className="relative p-2.5 rounded-lg bg-surface-dark border border-slate-700/50 text-text-muted hover:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-dark"></span>
                            </button>
                        </div>
                    </header>

                    {/* Featured / Continue Watching */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Video Player */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                                    Em andamento
                                </h2>
                                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                    Aula 04 de 12
                                </span>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-surface-dark aspect-video group cursor-pointer border border-slate-800/80">
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-70 transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCSayCePDeXoy1gCppz16x9RTkIoe253uYg5zdv-DGgtmgE833FlS3hrMVHiCN-UgJA0G6r0Z45qvarZgzP9BMaIOEz-dDmbZfVSfWq6daLG15WG07xDmhNbWPJGk-4UV1INC5N0cf8-GzGI8fZyu3i6yyi0berK5SNYx7ciup0JJOWJH-YjECqp5iRjMLYDk3TSGn4VHvRl21Zzj9R5y2egMN7bL0nMFcaP896BFb_uSmUB_IjeiylagDxZEzJKkMb0hhflTOL2j8")' }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/95 via-background-dark/40 to-transparent"></div>

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(123,97,255,0.4)] transform transition-all group-hover:scale-110 hover:bg-primary z-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z" /></svg>
                                    </button>
                                </div>

                                {/* Video Controls (Visual Only) */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 z-10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">
                                                Estratégias de Growth Hacking
                                            </h3>
                                            <p className="text-sm text-slate-300">
                                                Módulo 2: Conteúdo • 14:20 min
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-medium text-white">4:20</span>
                                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[30%] relative">
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-300">14:20</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Materials */}
                        <div className="space-y-4 flex flex-col h-full">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                Materiais de Apoio
                            </h2>
                            <div className="bg-surface-dark rounded-2xl p-6 border border-slate-800/80 shadow-lg flex-1 flex flex-col">
                                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                    <a className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/60 transition-colors group border border-transparent hover:border-slate-700/50" href="#">
                                        <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15v-4" /><path d="M12 15v-4" /><path d="M15 15v-4" /></svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                                                Resumo da Aula.pdf
                                            </h4>
                                            <p className="text-xs text-text-muted mt-0.5">PDF • 2.4 MB</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                    </a>

                                    <a className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/60 transition-colors group border border-transparent hover:border-slate-700/50" href="#">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="m9 15 2 2 4-4" /></svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                                                Checklist de Growth.xlsx
                                            </h4>
                                            <p className="text-xs text-text-muted mt-0.5">Excel • 1.1 MB</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                    </a>

                                    <a className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/60 transition-colors group border border-transparent hover:border-slate-700/50" href="#">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                                                Ferramentas Mencionadas
                                            </h4>
                                            <p className="text-xs text-text-muted mt-0.5">Link Externo</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></svg>
                                    </a>

                                    <div className="pt-2">
                                        <button className="w-full py-2 text-xs font-medium text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-1 group">
                                            Ver todos os recursos
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-y-0.5"><path d="m6 9 6 6 6-6" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Modules Grid */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Módulos do Curso</h2>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg bg-surface-dark border border-slate-700/50 text-white hover:border-primary/50 hover:text-primary transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                                </button>
                                <button className="p-2 rounded-lg hover:bg-surface-dark text-text-muted hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Module 1: Produtividade */}
                            <div className="group relative flex flex-col bg-surface-dark rounded-2xl border border-slate-800/80 overflow-hidden hover:shadow-[0_8px_30px_rgba(123,97,255,0.15)] hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 h-full">
                                <div
                                    className="h-40 w-full bg-cover bg-center relative"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAsyrXF9H6ZaaKr7Awd2hxHV2k4uAOYK7-N5bqQBbJ_nQI7ZnfD6z1Tds4zpJYF7mB6tLfEH0gGBf_cNf1lMT4ZpLnP3Rj8h-02R9k9IfoUy41BjHgQOQH10Nd48A4iOsMC740nQpCUIVMdBUifdyNKSB68IkRkITrqtxEW7BxRzGs4Uzx5mJFr-SkcuHQ8aIJGmRrDO2yTTBOyR-P9i-2BIcIO0kV-IVlvUu1FxKLq2WGg_Lezjv4J-Sghy7RMLLwbHosn2h6rdRw")' }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent opacity-90"></div>
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-lg px-2.5 py-1 flex items-center gap-1.5 border border-white/10 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        <span className="text-[11px] font-semibold text-white tracking-wide">4H 20M</span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                            Produtividade
                                        </h3>
                                        <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                                            Domine seu tempo e aumente sua eficiência diária com métodos comprovados.
                                        </p>
                                    </div>
                                    <div className="mt-auto space-y-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-text-muted font-medium">Progresso</span>
                                            <span className="text-primary font-bold">100%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden shadow-inner flex">
                                            <div className="bg-primary h-full rounded-full w-full"></div>
                                        </div>
                                        <button className="w-full mt-2 py-2.5 rounded-lg border border-slate-700/80 text-sm font-semibold text-white hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center gap-2 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                            Revisar Módulo
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Module 2: Conteúdo */}
                            <div className="group relative flex flex-col bg-surface-dark/80 rounded-2xl border border-primary/30 overflow-hidden hover:-translate-y-1 h-full shadow-[0_4px_30px_rgba(123,97,255,0.15)] ring-1 ring-primary/20 transition-all duration-300">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light via-primary to-primary-dark z-20"></div>
                                <div
                                    className="h-40 w-full bg-cover bg-center relative"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAee6PMhx8bDAhjq6_ix6acwpZ409F4akbLxM3bWzqvGnFp0_Z3iGVlVAVKChLagvWJbWsAuQbRBiTpgEyfZpuN7r7WlnVz78kjUSOSC0nishChXRPk0sVUkHDXI7x82bE8BSRNOEmUh7AGiTcrFrw4ZjaoRB-wYqpJD-Q75f1JsSeiQdp447pbOlwxtrUi15cSCkGPot_Enflb-VePZ8A30yyblXyOInso4cwcTuPqPslRSqF206TC_qxtky3Hb1dqs4-U210kunQ")' }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent opacity-90"></div>
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-lg px-2.5 py-1 flex items-center gap-1.5 border border-white/10 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        <span className="text-[11px] font-semibold text-white tracking-wide">6H 15M</span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                            Conteúdo
                                        </h3>
                                        <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                                            Estratégias de criação e distribuição de conteúdo para engajamento máximo.
                                        </p>
                                    </div>
                                    <div className="mt-auto space-y-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300 font-medium tracking-wide text-[10px] uppercase">Progresso Atual</span>
                                            <span className="text-primary font-bold">45%</span>
                                        </div>
                                        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden shadow-inner">
                                            <div className="bg-gradient-to-r from-primary to-primary-light h-full rounded-full w-[45%] relative">
                                                <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                        <button className="w-full mt-2 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:shadow-[0_0_25px_rgba(123,97,255,0.5)] flex items-center justify-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                            Continuar Aula
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Module 3: Vendas */}
                            <div className="group relative flex flex-col bg-surface-dark rounded-2xl border border-slate-800/80 overflow-hidden hover:shadow-[0_8px_30px_rgba(123,97,255,0.15)] hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 h-full">
                                <div
                                    className="h-40 w-full bg-cover bg-center relative"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBGoHwmGAEl-3CHpTUUA4yN5NLBbFr4myjvfK80iE9HtT5V0ckxu1Am5L2bq6reVz-6S0JU4q-Col9AIhlwILhfP4AJ5V5ZNkHqo6lI4bUpZOsYqa0_uIIBN5scCMAVc9D4y23tPKvt3C5oJc2SuehO23AFs9BXxqfp6X9DjWOnzpqwAJ9OMpDQ5fqrm1uUXVpQYbK-ZQoYXzp27Fgl6y0ghp3BTNVWJ36OxpxpxIcuRe4tHRYCZqutoomNyvuT0foMy2FpdJApYhk")' }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent opacity-90"></div>
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-lg px-2.5 py-1 flex items-center gap-1.5 border border-white/10 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        <span className="text-[11px] font-semibold text-white tracking-wide">5H 45M</span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                            Vendas
                                        </h3>
                                        <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                                            Técnicas de negociação, fechamento e psicologia de vendas avançada.
                                        </p>
                                    </div>
                                    <div className="mt-auto space-y-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-text-muted font-medium">Progresso</span>
                                            <span className="text-slate-500 font-bold">0%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden shadow-inner">
                                            <div className="bg-primary h-full rounded-full w-0"></div>
                                        </div>
                                        <button className="w-full mt-2 py-2.5 rounded-lg border border-slate-700/80 text-sm font-semibold text-white hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center gap-2 group-hover:bg-primary/10 transition-all duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                            Iniciar Módulo
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Module 4: Estratégico */}
                            <div className="group relative flex flex-col bg-surface-dark rounded-2xl border border-slate-800/80 overflow-hidden hover:shadow-[0_8px_30px_rgba(123,97,255,0.05)] transition-all duration-300 hover:-translate-y-1 h-full opacity-70 grayscale-[30%]">
                                <div
                                    className="h-40 w-full bg-cover bg-center relative"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCDucKmIrpacHPtdfRwSEunOJltc8q9qkSJr4vNS71r-0qsmf5JIl963z3Cp08kfv5l2mv2Ikr_-RIPlGxuNPhsItvZIJJ9IVtZB5YRF6h9PL0nLGUdv5bxucAfeAF5vBrEd53UKH7f6-vVsht1uRkzJB1JhM7NpKh1UUSE-m9giiW-Vm9xUGZehp3haUr_I320JRwFyA_VRaAq2j0wBv06marF0wjJRXn47wFnxxaIUV_p5--mZr8wKs1QDLGZTREeQpLkzJ0V2Ek")' }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent opacity-95"></div>
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-lg px-2.5 py-1 flex items-center gap-1.5 border border-white/5 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        <span className="text-[11px] font-semibold text-slate-300 tracking-wide">8H 10M</span>
                                    </div>
                                    {/* Status Overlay centrally */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 text-slate-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-slate-300 mb-2">
                                            Estratégico
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                                            Planejamento de longo prazo, visão de mercado e posicionamento de marca.
                                        </p>
                                    </div>
                                    <div className="mt-auto space-y-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-500 font-medium">Progresso</span>
                                            <span className="text-slate-600 font-bold">0%</span>
                                        </div>
                                        <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full w-0"></div>
                                        </div>
                                        <button className="w-full mt-2 py-2.5 rounded-lg border border-slate-800 text-sm font-medium text-slate-500 cursor-not-allowed flex items-center justify-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                            Bloqueado
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
