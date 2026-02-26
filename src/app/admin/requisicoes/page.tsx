'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function RequisicoesAdminPage() {
    return (
        <div className="flex min-h-screen w-full flex-row bg-background-dark font-display text-slate-100">
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-[280px] p-6 md:p-8 relative z-10 w-full min-h-screen overflow-x-hidden mb-[80px] lg:mb-0 flex flex-col">

                {/* Header Navbar */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="font-sora font-bold text-2xl tracking-tight text-white">Telemetria do Sistema</h2>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22C55E]"></span>
                            <span className="text-[10px] font-bold text-green-500 tracking-widest uppercase">● AO VIVO</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="flex items-center gap-6 text-sm font-medium text-slate-400 whitespace-nowrap">
                            <a className="hover:text-primary transition-colors border-b-2 border-primary pb-2 text-white" href="#">Visão Geral</a>
                            <a className="hover:text-primary transition-colors pb-2" href="#">Métricas</a>
                            <a className="hover:text-primary transition-colors pb-2" href="#">Alertas</a>
                        </div>
                        <div className="hidden md:block h-6 w-px bg-white/10 mx-2"></div>
                        <button className="material-symbols-outlined text-slate-400 hover:text-white transition-colors">notifications</button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto space-y-6">
                    {/* Filters Row */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg flex items-center px-3 py-2 gap-3 min-w-[160px] flex-1 sm:flex-none hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-slate-400 text-lg">smart_toy</span>
                            <div className="flex-1">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Agente</p>
                                <select className="bg-transparent border-none p-0 text-sm font-medium text-white focus:ring-0 w-full cursor-pointer outline-none appearance-none">
                                    <option className="bg-background-dark text-white">Todos Agentes</option>
                                    <option className="bg-background-dark text-white">Assistant_v2</option>
                                    <option className="bg-background-dark text-white">Coder_Pro</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg flex items-center px-3 py-2 gap-3 min-w-[160px] flex-1 sm:flex-none hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-slate-400 text-lg">rule</span>
                            <div className="flex-1">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Status HTTP</p>
                                <select className="bg-transparent border-none p-0 text-sm font-medium text-white focus:ring-0 w-full cursor-pointer outline-none appearance-none">
                                    <option className="bg-background-dark text-white">Todos Status</option>
                                    <option className="bg-background-dark text-white">200 OK</option>
                                    <option className="bg-background-dark text-white">429 Rate Limit</option>
                                    <option className="bg-background-dark text-white">500 Error</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg flex items-center px-3 py-2 gap-3 min-w-[200px] flex-1 hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-slate-400 text-lg">person_search</span>
                            <div className="flex-1">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Usuária (ID)</p>
                                <input className="bg-transparent border-none p-0 text-sm font-medium text-white focus:ring-0 w-full outline-none placeholder:text-slate-600" placeholder="Buscar ID..." type="text" />
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg flex items-center px-3 py-2 gap-3 min-w-[160px] flex-1 sm:flex-none hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-slate-400 text-lg">calendar_today</span>
                            <div className="flex-1">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Período</p>
                                <button className="text-sm font-medium text-white text-left w-full">Hoje, 27 Out</button>
                            </div>
                        </div>
                        <button className="w-full lg:w-auto bg-primary text-white font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Exportar Relatório
                        </button>
                    </div>

                    {/* Console Table Container */}
                    <div className="bg-[#050505] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse font-mono text-xs min-w-[900px]">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                        <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest">Timestamp</th>
                                        <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest">Usuária (ID)</th>
                                        <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest">Agente</th>
                                        <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest">Modelo</th>
                                        <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest text-right">Tokens</th>
                                        <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest text-right">Custo ($)</th>
                                        <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-slate-500 font-bold uppercase tracking-widest text-right">Latência</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {/* Success Row 1 */}
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-slate-400">14:32:45.002</td>
                                        <td className="px-6 py-4 text-primary font-bold">user_5521</td>
                                        <td className="px-6 py-4 text-slate-200">General_AI</td>
                                        <td className="px-6 py-4"><span className="bg-white/10 border border-white/5 px-2 py-1 rounded text-white text-[10px]">GPT-4o</span></td>
                                        <td className="px-6 py-4 text-right text-slate-400">340</td>
                                        <td className="px-6 py-4 text-right text-slate-400">0.0102</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-1 rounded font-bold text-[10px] tracking-wider">200 OK</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-400">150ms</td>
                                    </tr>

                                    {/* Rate Limit Row */}
                                    <tr className="hover:bg-white/5 transition-colors bg-amber-500/5 border-l-2 border-l-amber-500">
                                        <td className="px-6 py-4 text-slate-400">14:31:58.910</td>
                                        <td className="px-6 py-4 text-primary font-bold">user_4412</td>
                                        <td className="px-6 py-4 text-slate-200">Support_Bot</td>
                                        <td className="px-6 py-4"><span className="bg-white/10 border border-white/5 px-2 py-1 rounded text-white text-[10px]">Claude-3.5</span></td>
                                        <td className="px-6 py-4 text-right text-slate-400">890</td>
                                        <td className="px-6 py-4 text-right text-slate-400">0.0267</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-1 rounded font-bold text-[10px] tracking-wider">429 RATE LIMIT</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-400">45ms</td>
                                    </tr>

                                    {/* Error Row */}
                                    <tr className="bg-red-500/10 border-l-2 border-l-red-500 hover:bg-red-500/20 transition-colors">
                                        <td className="px-6 py-4 text-slate-400">14:31:12.445</td>
                                        <td className="px-6 py-4 text-primary font-bold">user_1102</td>
                                        <td className="px-6 py-4 text-slate-200">Writer_Agent</td>
                                        <td className="px-6 py-4"><span className="bg-white/10 border border-white/5 px-2 py-1 rounded text-white text-[10px]">GPT-3.5</span></td>
                                        <td className="px-6 py-4 text-right text-slate-400">120</td>
                                        <td className="px-6 py-4 text-right text-slate-400">0.0002</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-1 rounded font-bold text-[10px] tracking-wider">500 ERROR</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-400">2400ms</td>
                                    </tr>

                                    {/* Error Expansion JSON view */}
                                    <tr className="bg-black/50">
                                        <td className="px-6 py-6" colSpan={8}>
                                            <div className="bg-[#0A0A14] rounded-xl border border-red-500/20 p-6 overflow-hidden relative group space-y-4">
                                                <div className="absolute top-4 right-4 flex gap-4">
                                                    <button className="text-[10px] text-slate-500 hover:text-white uppercase font-bold tracking-widest transition-colors">Copy JSON</button>
                                                    <button className="text-[10px] text-slate-500 hover:text-white uppercase font-bold tracking-widest transition-colors">View Stack</button>
                                                </div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                                                    <h4 className="text-slate-100 font-bold text-sm">Erro Interno da API - Detalhes da Execução</h4>
                                                </div>
                                                <pre className="text-[12px] leading-relaxed overflow-x-auto p-4 bg-black rounded-lg border border-white/5">
                                                    <code className="font-mono">
                                                        <span className="text-[#A78BFA]">{'{'}</span><br />
                                                        &nbsp;&nbsp;<span className="text-[#22D3EE]">"error"</span>: <span className="text-[#A78BFA]">{'{'}</span><br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#22D3EE]">"message"</span>: <span className="text-slate-300">"Internal Server Error"</span>,<br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#22D3EE]">"type"</span>: <span className="text-slate-300">"api_error"</span>,<br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#22D3EE]">"code"</span>: <span className="text-[#F472B6]">"500"</span>,<br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#22D3EE]">"provider_response"</span>: <span className="text-[#A78BFA]">{'{'}</span><br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#22D3EE]">"upstream_status"</span>: <span className="text-[#F472B6]">502</span>,<br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#22D3EE]">"latency"</span>: <span className="text-[#F472B6]">2398</span><br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#A78BFA]">{'}'}</span>,<br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#22D3EE]">"stack_trace"</span>: <span className="text-slate-500">"at core/dispatch.js line 45:12 \n at providers/openai.js line 12:4"</span><br />
                                                        &nbsp;&nbsp;<span className="text-[#A78BFA]">{'}'}</span><br />
                                                        <span className="text-[#A78BFA]">{'}'}</span>
                                                    </code>
                                                </pre>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Success Row 2 */}
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-slate-400">14:30:01.001</td>
                                        <td className="px-6 py-4 text-primary font-bold">user_9928</td>
                                        <td className="px-6 py-4 text-slate-200">Assistant_v2</td>
                                        <td className="px-6 py-4"><span className="bg-white/10 border border-white/5 px-2 py-1 rounded text-white text-[10px]">GPT-4</span></td>
                                        <td className="px-6 py-4 text-right text-slate-400">450</td>
                                        <td className="px-6 py-4 text-right text-slate-400">0.0135</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-1 rounded font-bold text-[10px] tracking-wider">200 OK</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-400">120ms</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="p-4 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                            <p>Total de chamadas: 14,209 <span className="text-slate-600 ml-2">(últimos 60 min)</span></p>
                            <div className="flex items-center gap-6">
                                <button className="hover:text-white transition-colors">Anterior</button>
                                <span className="text-white font-bold bg-white/10 px-3 py-1 rounded">Página 1 de 42</span>
                                <button className="hover:text-white transition-colors">Próximo</button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 pb-6">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Taxa de Sucesso</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-2xl font-bold text-white">99.82%</h3>
                                <span className="text-green-500 text-[11px] font-bold mb-1">+0.04%</span>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Custo Projetado</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-2xl font-bold text-white">$242.10</h3>
                                <span className="text-slate-500 text-[11px] font-bold mb-1">/mês</span>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Latência Média</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-2xl font-bold text-white">184ms</h3>
                                <span className="text-red-500 text-[11px] font-bold mb-1">+12ms</span>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Tokens p/ Min. (TPM)</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-2xl font-bold text-white">4.2k</h3>
                                <span className="text-green-500 text-[11px] font-bold mb-1 bg-green-500/10 px-2 rounded">Estável</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
