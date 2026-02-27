import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function HistoricoPage() {
    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen overflow-hidden flex">
            {/* Global Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col md:ml-[280px] overflow-y-auto relative h-screen">

                {/* Header Section (Adapting Topbar from HTML) */}
                <header className="sticky top-0 z-40 flex items-center justify-between border-b border-primary/10 bg-background-dark/80 backdrop-blur-md px-6 md:px-10 py-4">
                    <div className="flex items-center gap-8">
                        <h2 className="text-slate-100 text-xl font-sora font-extrabold leading-tight tracking-tight">Protocolos</h2>
                    </div>

                    <div className="flex flex-1 justify-end gap-6 items-center">
                        <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-full bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md">
                                <div className="text-slate-400 flex items-center justify-center pl-4">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input
                                    className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 placeholder:text-slate-500 px-4 text-sm text-white focus:outline-none"
                                    placeholder="Buscar no log..."
                                    type="text"
                                />
                            </div>
                        </label>
                    </div>
                </header>

                <div className="flex-1 flex flex-col lg:flex-row">
                    {/* Inner Page Context Sidebar (Optional for MVP, but kept for visual fidelity of this section) */}
                    <aside className="w-full lg:w-72 border-r border-primary/5 p-6 flex flex-col gap-8 hidden xl:flex">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-sora font-bold text-slate-100">Gerações</h1>
                            <p className="text-slate-500 text-xs font-mono">v2.0.4-stable-biolume</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-2">Monitoramento</p>

                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary shadow-[0_0_15px_rgba(123,97,255,0.2)] border border-primary/20 cursor-pointer">
                                <span className="material-symbols-outlined">terminal</span>
                                <p className="text-sm font-medium">Log do Sistema</p>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-slate-400 cursor-pointer transition-all">
                                <span className="material-symbols-outlined">database</span>
                                <p className="text-sm font-medium">Dataset</p>
                            </div>
                        </div>

                        <div className="mt-auto bg-white/5 p-4 rounded-xl border border-primary/10 backdrop-blur-md">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-mono text-primary">CRÉDITOS</p>
                                <span className="text-xs font-mono">842 / 1000</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[84%] shadow-[0_0_10px_rgba(123,97,255,0.4)]"></div>
                            </div>
                        </div>
                    </aside>

                    {/* Content Section */}
                    <section className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <div>
                                <h2 className="text-3xl font-sora font-extrabold text-white mb-2 tracking-tight">Histórico de Execução</h2>
                                <p className="text-slate-400 font-mono text-sm flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Aguardando novas entradas do pipeline...
                                </p>
                            </div>

                            <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
                                <button className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-sora font-medium shadow-[0_0_15px_rgba(123,97,255,0.2)]">Diário</button>
                                <button className="px-4 py-1.5 rounded-full text-slate-400 text-xs font-sora font-medium hover:text-white transition-colors">Semanal</button>
                                <button className="px-4 py-1.5 rounded-full text-slate-400 text-xs font-sora font-medium hover:text-white transition-colors">Total</button>
                            </div>
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-primary/5 overflow-x-auto custom-scrollbar">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-primary/30 text-primary text-xs font-mono font-medium backdrop-blur-md">
                                <span className="material-symbols-outlined text-sm">filter_list</span> ALL_CATEGORIES
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-slate-400 border border-transparent hover:text-white transition-all text-xs font-mono backdrop-blur-md">
                                #PRODUTIVIDADE
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-slate-400 border border-transparent hover:text-white transition-all text-xs font-mono backdrop-blur-md">
                                #VENDAS
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-slate-400 border border-transparent hover:text-white transition-all text-xs font-mono backdrop-blur-md">
                                #MARKETING
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-slate-400 border border-transparent hover:text-white transition-all text-xs font-mono backdrop-blur-md">
                                #DEV_CORE
                            </button>
                        </div>

                        {/* History Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                            {/* History Card 1 */}
                            <div className="group relative flex flex-col rounded-xl border border-primary/10 overflow-hidden hover:border-primary/40 transition-all duration-300 bg-white/5 backdrop-blur-md">
                                <div className="h-40 w-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent z-10"></div>
                                    <img
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt="Abstrato digital fluido"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYXZdujkDUb2t88ioZ6bhgquTmHQPHcj6SvPsrSjI1g2qTO7eGGWRb_6rjXMcexjztmGbVK-uV-JgrvoHlfXJqPYBmzTg4FGX0WRVqmHjYPbDrf49A4j9G3pAj15QhmSPSUfpZ558loxiQYNpA7Ibfe_WGm-9EZWB1942UzOm5OQjQeQ85PiKW1-lOhzgRanKhsxEA1eoiDXX9XrbW94tSn4g7js1IiIGpT3bvGNFLOEfRgoDAKjO49o2g7JjxcB9_IENBJ1iCiaY"
                                    />
                                    <span className="absolute top-3 right-3 z-20 px-2 py-1 bg-background-dark/80 backdrop-blur rounded text-[10px] font-mono text-primary border border-primary/30">SUCCESS</span>
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-sora font-bold text-lg leading-tight">Agente Analista de SEO</h3>
                                            <p className="text-slate-500 text-[11px] font-mono mt-1 uppercase tracking-wider">Ref: 0x9823-MARKETING</p>
                                        </div>
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <span className="material-symbols-outlined text-primary text-xl">insights</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-primary/5">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-slate-500">calendar_today</span>
                                            <span className="text-xs font-mono text-slate-400">22 JAN 2024, 14:32</span>
                                        </div>
                                        <button className="text-primary hover:text-white transition-colors">
                                            <span className="material-symbols-outlined">open_in_new</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* History Card 2 */}
                            <div className="group relative flex flex-col rounded-xl border border-primary/10 overflow-hidden hover:border-primary/40 transition-all duration-300 bg-white/5 backdrop-blur-md">
                                <div className="h-40 w-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent z-10"></div>
                                    <img
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt="Código de programação neon"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAxAwevE_m0SC0GxM8CSMNpdrsi4iulcXvpKp4ACRd5vDE-A2IqhieH4KNt8cj7r5LyGrteRbG6NOMCJ5rMFendO4Lc9OG2n5QEc6p9qAwtrTvI4qy3qU0qYHPP9Z3_FtT4IXxfir3WB-MjN_YgFIxHKxcQOn5J6I-ogZpbecF2dFheRQG13CKSYFkVndB8JGHXrB327W7m0dHOrV4F64jxVx34mVRMbgno-iLeSsUMRJbaTL5ErnTkNysL3G5eLibFRUlG7hCYdc"
                                    />
                                    <span className="absolute top-3 right-3 z-20 px-2 py-1 bg-background-dark/80 backdrop-blur rounded text-[10px] font-mono text-primary border border-primary/30">SUCCESS</span>
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-sora font-bold text-lg leading-tight">Refatorador de Código</h3>
                                            <p className="text-slate-500 text-[11px] font-mono mt-1 uppercase tracking-wider">Ref: 0xA114-DEV_CORE</p>
                                        </div>
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <span className="material-symbols-outlined text-primary text-xl">code</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-primary/5">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-slate-500">calendar_today</span>
                                            <span className="text-xs font-mono text-slate-400">22 JAN 2024, 11:15</span>
                                        </div>
                                        <button className="text-primary hover:text-white transition-colors">
                                            <span className="material-symbols-outlined">open_in_new</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* History Card 3 - Running */}
                            <div className="group relative flex flex-col rounded-xl border border-primary/10 overflow-hidden hover:border-primary/40 transition-all duration-300 bg-white/5 backdrop-blur-md">
                                <div className="h-40 w-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent z-10"></div>
                                    <img
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt="Esferas bioluminescentes"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVit8ckuxQAEQEeY7SMf-v-uaVU1NF3knpYMeG4U9hT2GFgNEMg6HWzNLDaYbp-73FnbPT4AcyH3QLm9OP18i_JE7W1Glf-xSgzPnmOTA8pS8-YDA6elWdZQqRSfKHFPnTmqexG7HJGQoobocGpVt7dMVoB8lWcWiuI1KGXoFFHj_f_DvdTBfxBFuyU-bCYYK-YM7bi3RDJuHzB95HZFOjjDsY97krV_lL5m-4UWQQFupHT-UfDGvdRlXFtc7SRP0L4Qe8OgvTU2s"
                                    />
                                    <span className="absolute top-3 right-3 z-20 px-2 py-1 bg-background-dark/80 backdrop-blur rounded text-[10px] font-mono text-yellow-500 border border-yellow-500/30">RUNNING</span>
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-sora font-bold text-lg leading-tight">Redator Persuasivo</h3>
                                            <p className="text-slate-500 text-[11px] font-mono mt-1 uppercase tracking-wider">Ref: 0xCF21-VENDAS</p>
                                        </div>
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <span className="material-symbols-outlined text-primary text-xl">edit_note</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-primary/5">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-slate-500 animate-spin">sync</span>
                                            <span className="text-xs font-mono text-slate-400">PROCESSING_REALTIME...</span>
                                        </div>
                                        <button className="text-primary hover:text-white transition-colors">
                                            <span className="material-symbols-outlined">pause_circle</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Create New Card */}
                            <div className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-md rounded-xl border-dashed border-2 border-primary/20 hover:border-primary/50 transition-all cursor-pointer group">
                                <div className="bg-primary/5 size-14 rounded-full flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_rgba(123,97,255,0.2)] transition-all">
                                    <span className="material-symbols-outlined text-primary text-3xl">add</span>
                                </div>
                                <p className="font-sora font-bold text-slate-300">Nova Geração</p>
                                <p className="text-xs font-mono text-slate-500 mt-1">START_NEW_INSTANCE</p>
                            </div>

                        </div>

                        {/* System Log */}
                        <div className="mt-12 p-6 bg-white/5 backdrop-blur-md rounded-xl border border-primary/10">
                            <h4 className="text-sm font-mono text-primary mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">terminal</span> SYSTEM_CONSOLE_LOG
                            </h4>
                            <div className="space-y-2 font-mono text-[11px] text-slate-400">
                                <p><span className="text-primary">[14:32:01]</span> AGENT_SEO_ANALYSIS: Processamento concluído com 98% de precisão.</p>
                                <p><span className="text-primary">[11:15:44]</span> CODE_REFRACTOR: Reescrita de 12 funções finalizada. Economia de 24% em runtime.</p>
                                <p><span className="text-yellow-500">[09:55:12]</span> PERSUASIVE_WRITER: Iniciando geração de thread para LinkedIn (ID: 0xCF21).</p>
                                <p><span className="text-slate-500">[08:00:00]</span> SYSTEM_KERNEL: Ciclo de manutenção diária concluído com sucesso.</p>
                            </div>
                        </div>

                    </section>
                </div>
            </main>
        </div>
    );
}
