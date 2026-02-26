'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function GestaoUsuariosAdminPage() {
    return (
        <div className="flex min-h-screen w-full flex-row bg-background-dark font-sans text-slate-100">
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-[280px] p-6 md:p-10 relative z-10 w-full min-h-screen mb-[80px] lg:mb-0">
                {/* Header Section */}
                <header className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="font-sora text-3xl md:text-4xl font-bold tracking-tight text-slate-100 mb-1">Usuários</h2>
                        <p className="text-slate-500 text-sm">Gerencie o ecossistema de usuários da plataforma.</p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 px-6 py-3 border border-white/10 rounded-full hover:bg-white/5 text-slate-300 font-medium transition-all">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Exportar CSV
                    </button>
                    {/* Botão Mobile Simplificado */}
                    <button className="md:hidden flex items-center justify-center p-3 border border-white/10 rounded-full hover:bg-white/5 text-slate-300 font-medium transition-all">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                    </button>
                </header>

                {/* Control Bar */}
                <section className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="w-full md:flex-1 md:max-w-md">
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm"
                                placeholder="Pesquisar por nome, email ou ID..."
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                        <button className="bg-white/5 backdrop-blur-xl border border-white/10 flex-1 md:flex-none justify-center flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full text-xs md:text-sm font-sora text-slate-300 hover:border-white/20 transition-all">
                            Plano <span className="material-symbols-outlined text-[18px]">expand_more</span>
                        </button>
                        <button className="bg-white/5 backdrop-blur-xl border border-white/10 flex-1 md:flex-none justify-center flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full text-xs md:text-sm font-sora text-slate-300 hover:border-white/20 transition-all">
                            Status <span className="material-symbols-outlined text-[18px]">expand_more</span>
                        </button>
                        <button className="bg-white/5 backdrop-blur-xl border border-white/10 flex-1 md:flex-none justify-center flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full text-xs md:text-sm font-sora text-slate-300 hover:border-white/20 transition-all">
                            Data <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        </button>
                        <div className="hidden md:block h-8 w-px bg-white/10 mx-2"></div>
                        <button className="w-full md:w-auto mt-2 md:mt-0 bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Novo Usuário
                        </button>
                    </div>
                </section>

                {/* Table Container */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden relative mb-8 shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Usuário</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plano</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Créditos</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Requisições</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Data Cadastro</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {/* Row 1 */}
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full border border-white/10 bg-slate-800 bg-cover bg-center"
                                                title="Avatar do usuário Alex Silva"
                                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAYrMAW9HjjBo8xBMFcKinoPtAlVN453LO1T19qJscyZ-TanNS0Is06Y_9aEDcVZKcG2x_RjD80ulsJ3DCcdDhYd0V7qAy8ezSFYAw0-hGJFsYpKbgzu6R1K50C7NxWew7_0NqeTdGiomnfJGPXKePSfJF3LttejhTrfucjLuVE3x9caikWoTYz3M8pbSqST3yvlcMUp5nULUdRTrXX36mZVFsC2R0qYIx0RGLoKhVfu-33o2__Z4zqdJy0A09s22Q8NW3qKH_S_kA')" }}
                                            ></div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-100">Alex Silva</p>
                                                <p className="text-xs text-slate-500">alex@chave.ai</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-primary text-white tracking-wider">PRO</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="font-mono text-sm text-primary">5.250</code>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="font-mono text-sm text-slate-300">12.8k</code>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                            <span className="text-xs font-medium text-slate-300">Ativo</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-500 font-sora">12/10/2023</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </button>
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                                <span className="material-symbols-outlined text-[18px]">pause</span>
                                            </button>
                                            <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Row 2 */}
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full border border-white/10 bg-slate-800 bg-cover bg-center"
                                                title="Avatar do usuário Beatriz Rocha"
                                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPDDSDgXVFHPejvNd8JGE1u7qBtQejN4yucmeNBV9FceVL0AYikmpBUDpfmlYtxZ_YlyOeWl-VY4u_MQyNJbZelLX0x29nJsWiPRDeffjLnh6Xv6qiJxuGDEjMY-S-wvONdzpeWfMHJah3UO-ULxKf6RavqQ7Qnu-edh0oHwKbmMJZ7bjZX1kvlBiJGvNOC6myS6tDhKndhLSXb6kWmyp5InsXAnxazgpoPKIYm5gH3lpuHJg41G_N_IizER4LBLc717HyJWYl8Hk')" }}
                                            ></div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-100">Beatriz Rocha</p>
                                                <p className="text-xs text-slate-500">bea@chave.ai</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-white/10 text-slate-300 tracking-wider">FREE</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="font-mono text-sm text-primary">0</code>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="font-mono text-sm text-slate-300">450</code>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                                            <span className="text-xs font-medium text-slate-500">Inativo</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-500 font-sora">05/11/2023</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </button>
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                                <span className="material-symbols-outlined text-[18px]">pause</span>
                                            </button>
                                            <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Row 3 */}
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full border border-white/10 bg-slate-800 bg-cover bg-center"
                                                title="Avatar do usuário Carlos Lima"
                                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPWV84cGJfDZ5zo4LtM4s577WK11C6S7qM-x-F0jBB5pZwTlmkyJlhecjULHFLgcuoXq7dsYQELx0Kx7mAygQ0bJ26lH6AmglLm8SvYayH_Tsv1MKhove3VmrTTvo_bie6dJGweg327rLQwq08D33e9alX9QRdIMGRmKHE8eguNtuLSsoHbZecvahZWqfLdjq5LTAPZH_R76J2yOZkHmpcCrG6RL4x4vEKviQ1RCEvB5ic78xPE67a4GnQ-UsarojB5FClt5oyALE')" }}
                                            ></div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-100">Carlos Lima</p>
                                                <p className="text-xs text-slate-500">carlos@chave.ai</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-background-dark tracking-wider">ENTERPRISE</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="font-mono text-sm text-primary">∞</code>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="font-mono text-sm text-slate-300">156.2k</code>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                            <span className="text-xs font-medium text-slate-300">Ativo</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-500 font-sora">20/09/2023</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </button>
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                                <span className="material-symbols-outlined text-[18px]">pause</span>
                                            </button>
                                            <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Footer */}
                <footer className="flex flex-wrap items-center justify-center gap-2 py-4">
                    <button className="hidden sm:block px-4 py-2 text-sm text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all">Anterior</button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold text-sm shadow-[0_0_15px_rgba(104,81,251,0.4)]">1</button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 font-medium text-sm transition-all">2</button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 font-medium text-sm transition-all">3</button>
                    <div className="text-slate-600 px-2">...</div>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 font-medium text-sm transition-all">12</button>
                    <button className="hidden sm:block px-4 py-2 text-sm text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all">Próxima</button>
                </footer>

                {/* Plasma Accents */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full -z-10 blur-[100px] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(104, 81, 251, 0.4) 0%, transparent 70%)' }}></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full -z-10 blur-[100px] opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(104, 81, 251, 0.4) 0%, transparent 70%)' }}></div>
            </main>
        </div>
    );
}
