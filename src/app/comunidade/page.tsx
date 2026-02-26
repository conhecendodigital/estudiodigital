import Image from "next/image";

export default function ComunidadePage() {
    return (
        <div className="bg-background-dark min-h-screen text-slate-100 font-sans antialiased overflow-x-hidden relative selection:bg-primary selection:text-white">
            {/* Top Navigation Global agora no Layout */}

            <main className="pt-8 pb-12 px-4 md:px-6 md:ml-[280px] max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 w-full">
                {/* Left Sidebar: Categories & Menu */}
                <aside className="hidden lg:block lg:col-span-3 sticky top-28 h-fit space-y-8">
                    <div className="bg-surface-dark/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                        <h3 className="font-serif text-xl text-white mb-4 italic">Categorias</h3>
                        <nav className="flex flex-col space-y-2">
                            <a className="flex items-center gap-3 px-3 py-2.5 bg-primary/20 text-primary rounded-xl border border-primary/20 transition-all" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                <span className="font-medium">All Posts</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
                                <span className="font-medium">Dicas</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" /></svg>
                                <span className="font-medium">Resultados</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
                                <span className="font-medium">Novos Prompts</span>
                            </a>
                        </nav>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-all"></div>
                        <h3 className="font-serif text-xl text-white mb-2 italic">Chave Pro</h3>
                        <p className="text-sm text-text-muted mb-4 relative z-10">
                            Unlock exclusive analytics and premium prompts.
                        </p>
                        <button className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-colors shadow-[0_0_20px_rgba(123,97,255,0.2)] relative z-10">
                            Upgrade Now
                        </button>
                    </div>
                </aside>

                {/* Center: Feed */}
                <section className="lg:col-span-6 space-y-6">
                    {/* Mobile Categories */}
                    <div className="lg:hidden flex overflow-x-auto pb-2 gap-3 no-scrollbar mask-gradient-r">
                        <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            All
                        </button>
                        <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-surface-dark/60 backdrop-blur-md text-slate-300 border border-white/5 rounded-full text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
                            Dicas
                        </button>
                        <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-surface-dark/60 backdrop-blur-md text-slate-300 border border-white/5 rounded-full text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" /></svg>
                            Resultados
                        </button>
                        <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-surface-dark/60 backdrop-blur-md text-slate-300 border border-white/5 rounded-full text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
                            Prompts
                        </button>
                    </div>

                    <h1 className="text-3xl font-serif italic text-white mb-6">
                        Community Feed
                    </h1>

                    {/* Create Post Input */}
                    <div className="bg-surface-dark/60 backdrop-blur-md rounded-2xl p-4 flex gap-4 items-start mb-8 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                        <div
                            className="size-10 rounded-full bg-cover bg-center shrink-0"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdIWE4qTxCqHapXd-6ypiToU8Lp2RNPZKUdw5FqZURv57AAVnaTyjTj9GZ1jsEKQU0fpKgbJWSOiQwrEXzcCZcH0n9utH3RRrsQ7NTEcnPWeiwa5xVCHwvAwokDIDxhM3BZVIOHuY88CEWS_biCuVNC9iav3xrs7uEcfr4w0_O0Y-HNcHJtgQ0mUwtg2aJUu8QpmHlToKudid7qIi1ZPSlw_r6A-36pmwWA-oXrK_zr_4wbR5tnl9B2vZP2X6X8h-W87dc_PINADI")' }}
                        ></div>
                        <div className="flex-1">
                            <input
                                className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 p-0 text-base h-10 outline-none"
                                placeholder="Share your latest prompt or result..."
                                type="text"
                            />
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                                <div className="flex gap-4">
                                    <button className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 text-xs font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>Media
                                    </button>
                                    <button className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 text-xs font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>Code
                                    </button>
                                </div>
                                <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-all">
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Feed Item 1 */}
                    <article className="bg-surface-dark/60 backdrop-blur-md rounded-2xl p-6 hover:border-primary/30 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="size-10 rounded-full bg-cover bg-center"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC-utXIPOTvQICsOswYc9k7AoVgZX7VXj0z5c5zlA5T-VDgYuExaX1uSDOxqKvYRJEbF-gVE8WyIHWOCuzfbqaYd2xFP29odDwOHFG_-S3dmmPwxau1cpgskAQeJVCaEzLU74RMjN97QlsAzJ1_oWWOWbDbWBV1w4wW5F3KaKcdEDPmXoG2xPrRo_c4U4KA1n8F1MIJjgehs_v0_6nCwOAWkAVg9DQs-6nEwqejmxSKwurqnES4hI29MufiFhrPZ-FbtvwxqmjWw-8")' }}
                                ></div>
                                <div>
                                    <h4 className="text-white font-semibold text-sm">Marcus Chen</h4>
                                    <p className="text-text-muted text-xs">
                                        2 hours ago • <span className="text-primary">Resultados</span>
                                    </p>
                                </div>
                            </div>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                            </button>
                        </div>
                        <p className="text-slate-200 mb-4 leading-relaxed">
                            Just used the new writing assistant prompt and it saved me 3 hours on this report! The structure it generated was perfect for my technical documentation needs. Highly recommend tweaking the 'tone' parameter to 'formal'.
                        </p>
                        <div className="rounded-xl overflow-hidden bg-slate-900 border border-white/5 mb-4">
                            <div className="p-4 border-b border-white/5 flex items-center gap-2">
                                <div className="size-3 rounded-full bg-red-500/50"></div>
                                <div className="size-3 rounded-full bg-yellow-500/50"></div>
                                <div className="size-3 rounded-full bg-green-500/50"></div>
                                <span className="ml-2 text-xs text-text-muted font-mono">output.md</span>
                            </div>
                            <div className="p-4 font-mono text-sm text-slate-300 bg-black/50 relative">
                                <p className="opacity-50"># Executive Summary</p>
                                <p className="mt-2 text-slate-400">
                                    The Q3 performance metrics indicate a <span className="text-emerald-400">24% increase</span> in user retention following the UI overhaul...
                                </p>
                                <div className="h-16 bg-gradient-to-b from-transparent to-black/50 -mt-10 relative z-10 hidden"></div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 border-t border-white/5 pt-4">
                            <button className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors group/heart">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/heart:fill-current"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                <span className="text-xs font-medium">248</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                                <span className="text-xs font-medium">42</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors ml-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
                            </button>
                        </div>
                    </article>

                    {/* Feed Item 2 */}
                    <article className="bg-surface-dark/60 backdrop-blur-md rounded-2xl p-6 hover:border-primary/30 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="size-10 rounded-full bg-cover bg-center"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuARxJM5TgjuHf-7SgliwzJ3dAGoyHLd70GWmOR2V2DkIC0Rvic4lsSfe6j55l9fgyjiFuRm37v3RzGwoihAfPz5XwRSfqvtW4ZyYb2eXFplx9nHa33gh-v6JTGvFCcGVu3nbWDETdThSfbc3_wqc524bxpAGhX1n4jKAM_hhnX2I5t2j2sbevymAHSOM4Bcr4M8asELStnFtLEuoLwWuu_8uRabprroY-j-nsa-jjsMeo9lMzZbuh9-8mTnaeIUvO3x-mZAXRXKUx4")' }}
                                ></div>
                                <div>
                                    <h4 className="text-white font-semibold text-sm">Elena Rodriguez</h4>
                                    <p className="text-text-muted text-xs">
                                        5 hours ago • <span className="text-primary">Novos Prompts</span>
                                    </p>
                                </div>
                            </div>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                            </button>
                        </div>
                        <p className="text-slate-200 mb-4 leading-relaxed">
                            Found a great way to generate consistent character assets. Use this seed number with the 'cyberpunk' style modifier! 🎨
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div
                                className="aspect-square rounded-lg bg-cover bg-center shadow-lg border border-slate-700/50"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDZjJZL9JJrWK6bHDug0aL6ulsC51wq5fvCnYMqDBxnK5q8_HeA-n3tttsMIrdCKM2ndDUWFpfrFAETefMb7gEDbCR_ED2SOW_5b0fb8FDoT3RTftI5okOm5ynuiopNHulwlfBj0TamcDLZy9Snhycn3Y8-OlfcBHp5_5_tV5je5-CWV7lJC0xwfZKhJxepu4SFosLu-aaiTPIwXEBQZ_tdOAt4eSr00uiLAP2c1dnlvhBeCt6F-Rvd-m7hb6GXkun080xlS-c14Ms")' }}
                            ></div>
                            <div
                                className="aspect-square rounded-lg bg-cover bg-center shadow-lg border border-slate-700/50"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdwytYfpCLvzfvAD4jcpL0zMSjf9mCn3IXtdeC8S7WRLP-lDCxyw1I9I6PQXQyfeEyD7tnXJXzF3QxFoDueJyFd_jpivO_t-KL-5B3P643YE9qX1L8NmDtcxsVfIna7x-1YdG6BRRcHyqiAt5SP8L9dREu49fEilsp22j5jBJobl46bJ-X_Z2bjvwGJ4mx8HACEtfCKJNOSy0hF8QadGeRgLaiQHzg15wxKPbaRjCJO0QaTePnNGGqPWB2vlvyV9JtcXfBgFt_I6k")' }}
                            ></div>
                        </div>

                        <div className="flex items-center gap-6 border-t border-white/5 pt-4">
                            <button className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors group/heart">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/heart:fill-current"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                <span className="text-xs font-medium">856</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                                <span className="text-xs font-medium">124</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors ml-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
                            </button>
                        </div>
                    </article>
                </section>

                {/* Right Sidebar: Rankings */}
                <aside className="hidden lg:block lg:col-span-3 sticky top-28 h-fit space-y-6">
                    <div className="bg-surface-dark/60 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                        {/* Background decorative element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h3 className="font-serif text-xl text-white italic">Top Produtividade</h3>
                            <span className="text-[10px] font-medium text-slate-400 bg-white/5 px-2 py-1 rounded uppercase tracking-wider">
                                This Week
                            </span>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {/* Rank 1 */}
                            <div className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 shadow-md">
                                <div className="flex-shrink-0 relative">
                                    <div
                                        className="size-10 rounded-full bg-cover bg-center ring-2 ring-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuByRRX_YtgvsEJYmFvfju-fzY3tIDSjG570_E43trfGMPvoYXsX6mopwmZHko68q1jOdYfAEsjNKBZHAdHokVi9yvBTsHACIqLBTqZm045uDBdDBxRNdoBkczWhpOxiEyirpLnFJ44qOLKqDJ7X3mXJHIcdYvVI6zVj25uQVFzUYglxjNa8ZXcip5-AipNc6WE8a5FXpxp5lZinZJoi1uq_LtrYJ8YnEoL7QgcAFC3mbYXU3xlRlDoRT7-11ytqKBkwQSJJARLTa9s")' }}
                                    ></div>
                                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
                                        1
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white text-sm font-semibold truncate leading-tight">Sarah Jenkins</h4>
                                    <p className="text-primary text-xs truncate mt-0.5">1,240 XP</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                            </div>

                            {/* Rank 2 */}
                            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                                <div className="flex-shrink-0 relative">
                                    <div
                                        className="size-10 rounded-full bg-cover bg-center ring-1 ring-slate-600"
                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAgYsjZAzM8mtG1z7ZHRlg31goUvvDHbvhPOKdikH3em1zvADxY5OWGZSiFTFjKnAKCm0l5_2VeLySWZXHkm0wBuQqEPc53PTLo35qLJnkr8cNarOQObhKricYjGnQnn2oW2elA1y3RBwpq2h_ES35QqfZ-nAobfrIXTgqfRfsCOZKEKQ7sv9IzezQsHR7cTUdEHbpeXcKGLWmO5I36zPvsmAVvzcwBMaKSioiJe_7RnQkK8p9GVfTEOvkmr-x1_gJo5FPh8_kWrHM")' }}
                                    ></div>
                                    <div className="absolute -top-1 -right-1 bg-slate-400 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        2
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-slate-200 text-sm font-medium truncate leading-tight">Alex Morgan</h4>
                                    <p className="text-slate-500 text-xs truncate mt-0.5">980 XP</p>
                                </div>
                            </div>

                            {/* Rank 3 */}
                            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                                <div className="flex-shrink-0 relative">
                                    <div
                                        className="size-10 rounded-full bg-cover bg-center ring-1 ring-slate-600"
                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAKN54zzGgzK6KokJQldwK-RXwGVwl05EpiRxxWoikcEZBV7k4ajWuUgsy5B_bz-honWpk_afef-EWrLH2QfqZ2jJh0TlcB1dkz_Q5DjOk-N0Mki5aHd8OOd7Eah5Oziuw4giSsqq4bY4esoJNgryfgpJHni_7POvdcoQ5UfOHVwRuP3GT5_CZxTZdCVzIfGXmWs79LYkRuqEdBO2EwlYYG91WQxP9O_ESTF3HoRFk-rrVHUyQfZz6oGXKpH_2VQ7PsicLpkpw99wo")' }}
                                    ></div>
                                    <div className="absolute -top-1 -right-1 bg-amber-700 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                                        3
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-slate-200 text-sm font-medium truncate leading-tight">James Wilson</h4>
                                    <p className="text-slate-500 text-xs truncate mt-0.5">850 XP</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-4 text-xs font-semibold text-slate-400 hover:text-white text-center py-3 border-t border-white/5 transition-colors uppercase tracking-wider">
                            View Leaderboard
                        </button>
                    </div>

                    <div className="bg-surface-dark/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                        <h3 className="font-serif text-xl text-white italic mb-4">Trending Topics</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-full bg-white/5 text-slate-300 text-xs font-medium hover:bg-primary/20 hover:text-primary cursor-pointer transition-colors border border-white/5 hover:border-primary/30">
                                #GenerativeFill
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-white/5 text-slate-300 text-xs font-medium hover:bg-primary/20 hover:text-primary cursor-pointer transition-colors border border-white/5 hover:border-primary/30">
                                #CodeAssist
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-white/5 text-slate-300 text-xs font-medium hover:bg-primary/20 hover:text-primary cursor-pointer transition-colors border border-white/5 hover:border-primary/30">
                                #MidjourneyV6
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-white/5 text-slate-300 text-xs font-medium hover:bg-primary/20 hover:text-primary cursor-pointer transition-colors border border-white/5 hover:border-primary/30">
                                #Productivity
                            </span>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Floating Action Button (FAB) */}
            <div className="fixed bottom-8 right-8 z-40">
                <button className="group flex items-center gap-0 hover:gap-3 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-[0_8px_30px_rgb(123,97,255,0.4)] transition-all duration-300 overflow-hidden h-14">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
                    <span className="w-0 group-hover:w-auto opacity-0 group-hover:opacity-100 whitespace-nowrap font-medium transition-all duration-300 -ml-1">
                        Compartilhar Resultado
                    </span>
                </button>
            </div>

            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]"></div>
            </div>
        </div>
    );
}
