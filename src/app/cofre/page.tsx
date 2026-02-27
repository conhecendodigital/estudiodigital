import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function CofrePage() {
    return (
        <div className="bg-background-dark text-slate-100 font-display selection:bg-primary/30 min-h-screen flex overflow-hidden">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative md:ml-[280px]">
                {/* Decorative Accents */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none z-0"></div>
                
                <div className="max-w-7xl mx-auto px-12 py-12 relative z-10">
                    {/* Header Section */}
                    <header className="mb-12">
                        <h1 className="font-sora text-5xl font-bold tracking-tight mb-2">Cofre de Referências</h1>
                        <p className="font-serif text-3xl italic text-slate-400">Armazene e analise conteúdos virais com IA.</p>
                    </header>

                    {/* Link Input Section */}
                    <section className="mb-16">
                        <div className="flex items-center gap-4 max-w-4xl">
                            <div className="relative flex-1 group">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-primary/50">
                                    <span className="material-symbols-outlined">link</span>
                                </div>
                                <input 
                                    className="w-full bg-primary/5 backdrop-blur-md border border-primary/20 h-16 pl-14 pr-6 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-display" 
                                    placeholder="Cole aqui o link do TikTok ou Reels..." 
                                    type="text"
                                />
                            </div>
                            <button className="bg-primary hover:bg-primary/90 text-white font-sora font-bold px-10 h-16 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(123,97,255,0.3)] active:scale-95 group">
                                <span>Salvar</span>
                                <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">bolt</span>
                            </button>
                        </div>
                    </section>

                    {/* Filters */}
                    <div className="flex items-center gap-8 mb-8 border-b border-white/5 pb-2">
                        <button className="pb-4 border-b-2 border-primary text-primary font-bold text-sm tracking-wide">Todos</button>
                        <button className="pb-4 border-b-2 border-transparent text-slate-500 hover:text-slate-300 font-bold text-sm tracking-wide transition-colors">TikTok</button>
                        <button className="pb-4 border-b-2 border-transparent text-slate-500 hover:text-slate-300 font-bold text-sm tracking-wide transition-colors">Instagram Reels</button>
                        <button className="pb-4 border-b-2 border-transparent text-slate-500 hover:text-slate-300 font-bold text-sm tracking-wide transition-colors">YouTube Shorts</button>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        
                        {/* Card 1 */}
                        <div className="bg-card-dark rounded-lg overflow-hidden border border-white/5 flex flex-col group hover:border-primary/30 transition-all hover:translate-y-[-4px]">
                            <div className="relative aspect-[9/16] overflow-hidden">
                                <img 
                                    className="w-full h-full object-cover" 
                                    alt="Vertical mobile social media video preview thumbnail" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuVTiN_-f-1bQQ_82h8wg8dtZH4jR5K1F1gWtWquPH-TMXE52rdE-L2LnqWclGXFInUmZcFSbj5nVF7sMNBw4TyDPGtYLufQQjrU2qxFD5cLCgDhfMaEka5ZtUKP590fWSOeXWsPZr8RxmsKcTv3tkzYFMjVAJk-wpqIIAhmq19LREVd24MoSGSylrBN_dldQh1lRwYyupOckQwXWP-JyysOzpc5JsjeFSb23Q3us-LD3mue47wEFH2kKWvdeE9n_scJ4Z9jZdcSw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                                <div className="absolute inset-0 opacity-[0.035] bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOogaeOrZpup4wR5z8nRtYrHlegCc_EJul9zemi5VJVBl6pWMo2TVak7zs_Gm2smemcUihLdGhmUgY-5N-zh198EbFfFLQEiU_Vn3MVyBeiZZXITlUvwosekKzGZw1_r-w6m5WFaJOkoNx_kZ10DkNa8OdachIKA6kBLQlHwz-PTXDNT44XX-d_pSRZegSyMKG-gar0YohE01402YubMSa_1GItJc_v1N6GtNKaIY445hU8Fxb4NjWjLmpD7zp-OQ2k7Gv94XqJE8')] mix-blend-overlay"></div>
                                
                                {/* Source Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-cyan-500/20 backdrop-blur-md text-cyan-400 text-[10px] font-bold px-3 py-1.5 rounded-full border border-cyan-500/30 uppercase tracking-tighter">TikTok</span>
                                </div>
                                
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="size-14 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">play_arrow</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-sora font-semibold text-sm line-clamp-2 mb-3 leading-relaxed">Como hooks visuais aumentam a retenção em 40%</h3>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="font-mono text-[10px] text-slate-500 uppercase">24 OUT 2023</span>
                                    <div className="flex items-center gap-2">
                                        <button className="size-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-400/30 transition-colors">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                        <button className="bg-primary px-4 py-2 rounded-full text-[11px] font-bold text-white shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:scale-105 transition-transform">
                                            Analisar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-card-dark rounded-lg overflow-hidden border border-white/5 flex flex-col group hover:border-primary/30 transition-all hover:translate-y-[-4px]">
                            <div className="relative aspect-[9/16] overflow-hidden">
                                <img 
                                    className="w-full h-full object-cover" 
                                    alt="Vertical mobile social media content video thumbnail" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU7nPSTVA2ZvdzcjBP8Y3Bv9QH5tX1a86FjTRaoLgvcT7PB_jo1HNjpGdn30OxJtDbYNRuX3LRTiRT3Ya5gPVg04NzQk3jpqDleTQm16u_6McyBHXUDfQTyfXY2wKuBfN-t9Uw5lQeSUkQ5mSGi2GUl3h3-SJO2-4XUdx1vHYrAx3kKAfuK_eSkyQIblNB5K-CE-Uf1lYwiCK2wt1JOTORerrTbPJjqjaTjzRKhNZW5Pwm_J52EfaAcqSCFcFIaxIFnoDKNcuwP5I"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                                <div className="absolute inset-0 opacity-[0.035] bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOogaeOrZpup4wR5z8nRtYrHlegCc_EJul9zemi5VJVBl6pWMo2TVak7zs_Gm2smemcUihLdGhmUgY-5N-zh198EbFfFLQEiU_Vn3MVyBeiZZXITlUvwosekKzGZw1_r-w6m5WFaJOkoNx_kZ10DkNa8OdachIKA6kBLQlHwz-PTXDNT44XX-d_pSRZegSyMKG-gar0YohE01402YubMSa_1GItJc_v1N6GtNKaIY445hU8Fxb4NjWjLmpD7zp-OQ2k7Gv94XqJE8')] mix-blend-overlay"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-[#FF0050]/20 backdrop-blur-md text-[#FF0050] text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#FF0050]/30 uppercase tracking-tighter">Reels</span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="size-14 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">play_arrow</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-sora font-semibold text-sm line-clamp-2 mb-3 leading-relaxed">Transições de corte seco para vídeos de lifestyle e luxo</h3>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="font-mono text-[10px] text-slate-500 uppercase">22 OUT 2023</span>
                                    <div className="flex items-center gap-2">
                                        <button className="size-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-400/30 transition-colors">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                        <button className="bg-primary px-4 py-2 rounded-full text-[11px] font-bold text-white shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:scale-105 transition-transform">
                                            Analisar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-card-dark rounded-lg overflow-hidden border border-white/5 flex flex-col group hover:border-primary/30 transition-all hover:translate-y-[-4px]">
                            <div className="relative aspect-[9/16] overflow-hidden">
                                <img 
                                    className="w-full h-full object-cover" 
                                    alt="Social media app interface on mobile screen" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkRP-4LNki2DwEMT15wriUZ0b8R4YEuHqC15W64He1E9ivHMj4KGE-Pc7Gk2W_98qYHlZxFUOGgJKY4CtcD-iOh4d7kEVwSNGXdzwFACLICWqXtCTXCzQ5i6BAlnklhcCS9A3swohSqLDbwul_lwIzaGGtH0QITJ8vd63JzNBnjgQa8ge6hHng3evwTs84wxfEnkHg8owpC7zWOikgD9qwH0KqE337GnqQ7JlGL05fOegptgQoDnvOnohw1XmBmgyr69_bo7MWxuU"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                                <div className="absolute inset-0 opacity-[0.035] bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOogaeOrZpup4wR5z8nRtYrHlegCc_EJul9zemi5VJVBl6pWMo2TVak7zs_Gm2smemcUihLdGhmUgY-5N-zh198EbFfFLQEiU_Vn3MVyBeiZZXITlUvwosekKzGZw1_r-w6m5WFaJOkoNx_kZ10DkNa8OdachIKA6kBLQlHwz-PTXDNT44XX-d_pSRZegSyMKG-gar0YohE01402YubMSa_1GItJc_v1N6GtNKaIY445hU8Fxb4NjWjLmpD7zp-OQ2k7Gv94XqJE8')] mix-blend-overlay"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-cyan-500/20 backdrop-blur-md text-cyan-400 text-[10px] font-bold px-3 py-1.5 rounded-full border border-cyan-500/30 uppercase tracking-tighter">TikTok</span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="size-14 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">play_arrow</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-sora font-semibold text-sm line-clamp-2 mb-3 leading-relaxed">Estratégia de Storytelling para SaaS B2B no TikTok</h3>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="font-mono text-[10px] text-slate-500 uppercase">18 OUT 2023</span>
                                    <div className="flex items-center gap-2">
                                        <button className="size-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-400/30 transition-colors">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                        <button className="bg-primary px-4 py-2 rounded-full text-[11px] font-bold text-white shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:scale-105 transition-transform">
                                            Analisar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-card-dark rounded-lg overflow-hidden border border-white/5 flex flex-col group hover:border-primary/30 transition-all hover:translate-y-[-4px]">
                            <div className="relative aspect-[9/16] overflow-hidden">
                                <img 
                                    className="w-full h-full object-cover" 
                                    alt="Vibrant digital content on vertical display screen" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMLjLvlDHpvZHHRFJzw1vouR8cAtBjwpdOuLPUrVScSFxXg5S6uf6hWJYz9WxTNtFZe3EyIby00SgGkeHnwiEDjW_zuEm3mgoQAjU0oQmv5TNx9ZAXdAJrGFE-jm7AxLCixlY9D5X4I2rWrDuKCkk2PA12sU361FXdSpduAjtVwplKQ_LosHyItR4gSVVW5OwUasHuwnPT_5AUcpGYgB965S5S74zb2pD9BwQW9vcp1AynkwJMIhDHvpEmtTql4RPvCF1sVkceWzM"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                                <div className="absolute inset-0 opacity-[0.035] bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOogaeOrZpup4wR5z8nRtYrHlegCc_EJul9zemi5VJVBl6pWMo2TVak7zs_Gm2smemcUihLdGhmUgY-5N-zh198EbFfFLQEiU_Vn3MVyBeiZZXITlUvwosekKzGZw1_r-w6m5WFaJOkoNx_kZ10DkNa8OdachIKA6kBLQlHwz-PTXDNT44XX-d_pSRZegSyMKG-gar0YohE01402YubMSa_1GItJc_v1N6GtNKaIY445hU8Fxb4NjWjLmpD7zp-OQ2k7Gv94XqJE8')] mix-blend-overlay"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-[#FF0050]/20 backdrop-blur-md text-[#FF0050] text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#FF0050]/30 uppercase tracking-tighter">Reels</span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="size-14 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">play_arrow</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-sora font-semibold text-sm line-clamp-2 mb-3 leading-relaxed">Análise de Iluminação: O segredo dos vídeos high-end</h3>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="font-mono text-[10px] text-slate-500 uppercase">15 OUT 2023</span>
                                    <div className="flex items-center gap-2">
                                        <button className="size-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-400/30 transition-colors">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                        <button className="bg-primary px-4 py-2 rounded-full text-[11px] font-bold text-white shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:scale-105 transition-transform">
                                            Analisar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
