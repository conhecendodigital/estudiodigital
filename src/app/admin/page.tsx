'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function AdminDashboardPage() {
    return (
        <div className="flex min-h-screen w-full flex-row bg-background-dark font-display text-slate-100 selection:bg-primary selection:text-white">
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-[280px] relative z-10 w-full min-h-screen overflow-x-hidden mb-[80px] lg:mb-0 bg-background-dark">

                {/* Header Section */}
                <header className="sticky top-[80px] md:top-0 z-10 bg-background-dark/80 backdrop-blur-md border-b border-white/5 p-6 md:px-8 md:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h2 className="font-sora font-bold text-2xl tracking-tight">Visão Geral do Sistema</h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/50 rounded-full border border-white/10 w-full sm:w-auto">
                            <span className="material-symbols-outlined text-xs text-green-400 shadow-[0_0_8px_currentColor]">circle</span>
                            <span className="font-mono text-xs text-slate-300">Todos os sistemas operacionais</span>
                        </div>
                        <div className="hidden md:flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-200">Admin User</p>
                                <p className="text-[10px] text-slate-500">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-primary/30 p-0.5">
                                <img
                                    alt="Admin User Avatar"
                                    className="w-full h-full rounded-full bg-slate-800 object-cover"
                                    title="Profile avatar of the administrator"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB03vMqgzwCsfKhHN7F6WknJJPwPbbvUqyH4L7UiD-8rfgkOjx4SDaDCDGRPOTKMqtoAnyquLqmUXjuAJAY4dkXxqjQjjsZpfVwWxnLXTtNgpYp08vcqZ0wCtuRRhjENpMgo5GSZfRdvH_TPDSivmGDorhS7kGq-ollRBvNWDQbK1dZUQxSy-xgkWS7tHewTfkV5SkpX-mh_acHdKZT8x1lgG5YZ2MHxBG2FPzzqBbUfbTznFljvGetTTjE0kZcoii31EqPEHgcze8"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-8 space-y-8">
                    {/* KPI Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* KPI 1 */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-40 hover:border-white/20 transition-all">
                            <p className="text-sm font-medium text-slate-400">Usuários Ativos</p>
                            <h3 className="font-sora font-bold text-4xl text-white">1.248</h3>
                            <div className="flex items-center gap-1 text-green-400 text-xs font-medium">
                                <span className="material-symbols-outlined text-sm">trending_up</span> +12% vs mês anterior
                            </div>
                        </div>

                        {/* KPI 2 */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-40 hover:border-white/20 transition-all group">
                            <p className="text-sm font-medium text-slate-400">Receita do Mês</p>
                            <h3 className="font-sora font-bold text-3xl md:text-4xl text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(123,97,255,0.3)] transition-all" style={{ backgroundImage: 'linear-gradient(135deg, #7B61FF 0%, #00f5ff 100%)' }}>R$ 83.616</h3>
                            <div className="flex items-center gap-1 text-slate-500 text-xs font-medium group-hover:text-primary/70 transition-colors">
                                Projeção: R$ 92k
                            </div>
                        </div>

                        {/* KPI 3 */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-40 hover:border-white/20 transition-all">
                            <p className="text-sm font-medium text-slate-400">Requisições Hoje</p>
                            <h3 className="font-mono font-medium text-4xl text-slate-100">14.205</h3>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2 relative">
                                <div className="absolute top-0 left-0 bg-primary h-full w-[65%] rounded-full shadow-[0_0_10px_#7B61FF]"></div>
                            </div>
                        </div>

                        {/* KPI 4 */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-40 hover:border-white/20 transition-all">
                            <p className="text-sm font-medium text-slate-400">Custo API Hoje</p>
                            <h3 className="font-sora font-bold text-4xl text-[#F8F8FF]">$ 142.12</h3>
                            <div className="flex items-center gap-1 text-red-400 text-xs font-medium">
                                <span className="material-symbols-outlined text-sm">warning</span> 5% acima da média
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Bar Chart (Col 3) */}
                        <div className="lg:col-span-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                                <h4 className="font-sora font-bold text-lg text-white">Requisições por Agente</h4>
                                <select className="bg-white/5 border border-white/10 text-xs rounded-full px-4 py-2 text-slate-300 focus:ring-1 focus:ring-primary outline-none hover:bg-white/10 transition-colors cursor-pointer appearance-none text-center">
                                    <option className="bg-background-dark text-white">Últimos 7 dias</option>
                                    <option className="bg-background-dark text-white">Hoje</option>
                                </select>
                            </div>

                            {/* Bar Chart Mockup CSS */}
                            <div className="flex items-end justify-between h-48 gap-2 md:gap-4 px-2">
                                <div className="flex-1 flex flex-col items-center gap-3 relative group">
                                    <div className="absolute -top-8 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">85%</div>
                                    <div className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-xl hover:shadow-[0_0_20px_#7b61ff] transition-all" style={{ height: '85%' }}></div>
                                    <span className="text-[9px] md:text-[10px] font-mono text-slate-500 uppercase whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">Agent A</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-3 relative group">
                                    <div className="absolute -top-8 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">60%</div>
                                    <div className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-xl hover:shadow-[0_0_20px_#7b61ff] transition-all" style={{ height: '60%' }}></div>
                                    <span className="text-[9px] md:text-[10px] font-mono text-slate-500 uppercase whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">Agent B</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-3 relative group">
                                    <div className="absolute -top-8 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">95%</div>
                                    <div className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-xl hover:shadow-[0_0_20px_#7b61ff] transition-all" style={{ height: '95%' }}></div>
                                    <span className="text-[9px] md:text-[10px] font-mono text-slate-500 uppercase whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">Agent C</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-3 relative group">
                                    <div className="absolute -top-8 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">40%</div>
                                    <div className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-xl hover:shadow-[0_0_20px_#7b61ff] transition-all" style={{ height: '40%' }}></div>
                                    <span className="text-[9px] md:text-[10px] font-mono text-slate-500 uppercase whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">Agent D</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-3 relative group">
                                    <div className="absolute -top-8 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">75%</div>
                                    <div className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-xl hover:shadow-[0_0_20px_#7b61ff] transition-all" style={{ height: '75%' }}></div>
                                    <span className="text-[9px] md:text-[10px] font-mono text-slate-500 uppercase whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">Agent E</span>
                                </div>
                            </div>
                        </div>

                        {/* Donut Chart (Col 2) */}
                        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between">
                            <h4 className="font-sora font-bold text-lg text-white mb-6 text-center md:text-left">Custo por Modelo</h4>

                            <div className="flex-1 flex items-center justify-center relative py-4">
                                {/* SVG Donut */}
                                <svg className="w-40 h-40 transform -rotate-90 hover:scale-105 transition-transform duration-500" viewBox="0 0 160 160">
                                    <circle className="text-white/5" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                                    <circle className="text-primary" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="110" strokeWidth="12" style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}></circle>
                                    <circle className="text-[#8b5cf6]" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="280" strokeWidth="12" style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}></circle>
                                    <circle className="text-cyan-400" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="380" strokeWidth="12" style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center z-10">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</span>
                                    <span className="font-mono font-bold text-2xl text-white mt-1">$142</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-6">
                                <div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">GPT-4o</p>
                                    <div className="h-1 bg-primary rounded-full mb-2 w-full mx-auto relative overflow-hidden"><div className="absolute inset-0 bg-white/20 animate-pulse"></div></div>
                                    <p className="text-xs font-mono text-white">55%</p>
                                </div>
                                <div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Claude</p>
                                    <div className="h-1 bg-[#8b5cf6] rounded-full mb-2 w-full mx-auto relative overflow-hidden"><div className="absolute inset-0 bg-white/20 animate-pulse"></div></div>
                                    <p className="text-xs font-mono text-white">30%</p>
                                </div>
                                <div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Gemini</p>
                                    <div className="h-1 bg-cyan-400 rounded-full mb-2 w-full mx-auto relative overflow-hidden"><div className="absolute inset-0 bg-white/20 animate-pulse"></div></div>
                                    <p className="text-xs font-mono text-white">15%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section (Users & Alerts) */}
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 pb-4">
                        {/* Recent Users (Col 6) */}
                        <div className="lg:col-span-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                                <h4 className="font-sora font-bold text-lg text-white">Usuários Recentes</h4>
                                <button className="text-xs text-primary font-bold hover:underline transition-all">Ver todos</button>
                            </div>
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left min-w-[500px]">
                                    <thead>
                                        <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5 bg-black/10">
                                            <th className="px-6 py-4 font-bold">Usuário</th>
                                            <th className="px-6 py-4 font-bold">Plano</th>
                                            <th className="px-6 py-4 font-bold hidden sm:table-cell">Status</th>
                                            <th className="px-6 py-4 font-bold text-right">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-white/5">
                                        <tr className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <img
                                                    className="w-8 h-8 rounded-full bg-slate-800 object-cover border border-white/10 group-hover:border-primary/50 transition-colors"
                                                    alt="Avatar for John Doe"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTuualqP_skwFUe4D020ETsAXNp1dkGItoYhOz3-bARBj6Ftan_G1jIStKYMgRz-IK9EOtdmcFs8JCJCZ5T6BxrTy3sn3nBgy32qlVFzw3FeGiKiceHnR2hoFIaP9gA1Bgh4oZoQfCW7-f_F-pwyHNqJVyMvWWbPOY7zxRMjg-Zbyd9P9TUzgP-Jst95Pjqoen-7MF1-UXstSlunXWhMCafHbRYpl4nC8gcQSpr8gZ7B09FSUZGes6nW8AVE-1rHchLLMSmi7_y-4"
                                                />
                                                <div>
                                                    <p className="font-medium text-slate-200 group-hover:text-white transition-colors">João Silva</p>
                                                    <p className="text-xs text-slate-500">joao@empresa.com</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">Enterprise</span>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_currentColor]"></span>
                                                    <span className="text-xs text-slate-300">Ativo</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-xs text-slate-500">14:23</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <img
                                                    className="w-8 h-8 rounded-full bg-slate-800 object-cover border border-white/10 group-hover:border-primary/50 transition-colors"
                                                    alt="Avatar for Anna"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX8b4L2uHghs3rQQRN5WbP8zPU99maIufNBOXen7avlnb0tuwRy31sv616slOna3DCT_5O44nI7yevsiui3ateJA1likrJKS9ivJPSyL_8-xzs-deffKXQdrVZWRI_IqBY7Ls08h1SsrWaw55dk_bewD6q8OrROpycoL2ehI9_blbdy1V1W7QvFcnIsw2snERdDgkn76J5WpjQzrQnGxNRG8hLffeFApzKUpEpWy6UNtLKTK_Oi8-XeVwXwaQLftFTabJGieyixZY"
                                                />
                                                <div>
                                                    <p className="font-medium text-slate-200 group-hover:text-white transition-colors">Ana Martins</p>
                                                    <p className="text-xs text-slate-500">ana.m@startup.io</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">Pro Plus</span>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_currentColor]"></span>
                                                    <span className="text-xs text-slate-300">Ativo</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-xs text-slate-500">13:05</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <img
                                                    className="w-8 h-8 rounded-full bg-slate-800 object-cover border border-white/10 group-hover:border-primary/50 transition-colors"
                                                    alt="Avatar for Robert"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBENSmABsJaQbPuJLo71h90-oPG0qqvGH8KnW90EQurpoyCicGn-xmtA-iM8BRTlg7s0K8UHeEY5McABpQwB60qdFBpvCCVoa5zrNP3DURJjpurKVbCiVJMwI9HLnQ0K0vVTDI2Vh9KjLTEbZ88XwtN14hN-9F9g-o7zAmBycLGv0B5ITKfGP3GxNE5DZtlQFonM72KvDst4o3oEbatDuaRJp0OPQggfrYnP1M2vZzXxAsx7lnw64mAzs0Imu_bVFwd_x6j6vt5_fk"
                                                />
                                                <div>
                                                    <p className="font-medium text-slate-200 group-hover:text-white transition-colors">Ricardo Costa</p>
                                                    <p className="text-xs text-slate-500">rc@tech.com</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider border border-white/10">Trial</span>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_currentColor]"></span>
                                                    <span className="text-xs text-slate-300">Pendente</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-xs text-slate-500">11:42</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Alerts & Notifications (Col 4) */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col h-full">
                                <h4 className="font-sora font-bold text-lg mb-6 flex items-center gap-2 text-white">
                                    <span className="material-symbols-outlined text-primary">notifications</span>
                                    Alertas do Sistema
                                </h4>

                                <div className="space-y-4 flex-1">
                                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-4 hover:bg-amber-500/20 transition-colors cursor-default">
                                        <span className="material-symbols-outlined text-amber-500 shrink-0 select-none">warning</span>
                                        <div>
                                            <p className="text-sm font-bold text-amber-200">Limite Crítico de API</p>
                                            <p className="text-xs text-amber-200/70 mt-1 leading-relaxed">API Claude atingiu 85% do limite contratado. Recomenda-se upgrade via painel provedor.</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex gap-4 hover:bg-cyan-500/20 transition-colors cursor-default">
                                        <span className="material-symbols-outlined text-cyan-500 shrink-0 select-none">info</span>
                                        <div>
                                            <p className="text-sm font-bold text-cyan-200">Novo modelo detectado</p>
                                            <p className="text-xs text-cyan-200/70 mt-1 leading-relaxed">Integração com GPT-4o-mini já pode ser habilitada nas opções de provedor.</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4 opacity-70 hover:opacity-100 transition-opacity cursor-default">
                                        <span className="material-symbols-outlined text-emerald-400 shrink-0 select-none">check_circle</span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-300">Backup Realizado</p>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Rotina de backup automático finalizada às 03:00 AM com sucesso no S3 Vault.</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-6 py-3 rounded-xl border border-white/10 bg-black/20 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                    Marcar limpo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
