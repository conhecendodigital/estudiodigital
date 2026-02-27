'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Receipt, Settings, LogOut, Plug, Bot, CreditCard } from 'lucide-react';

export default function AdminSidebar() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/admin', icon: <LayoutDashboard className="size-5" />, label: 'Visão Geral' },
        { href: '/admin/agentes/novo', icon: <Bot className="size-5" />, label: 'Criar Agente' },
        { href: '/admin/agentes', icon: <Users className="size-5" />, label: 'Gestão de Agentes' },
        { href: '/admin/integracoes', icon: <Plug className="size-5" />, label: 'Integrações IA' },
        { href: '/admin/pagamentos', icon: <CreditCard className="size-5" />, label: 'Pagamentos' },
        { href: '/admin/clientes', icon: <Users className="size-5" />, label: 'Assinantes' },
        { href: '/admin/faturamento', icon: <Receipt className="size-5" />, label: 'Faturamento' },
        { href: '/admin/config', icon: <Settings className="size-5" />, label: 'Configurações' },
    ];

    return (
        <aside className="w-72 bg-sidebar-dark flex flex-col fixed inset-y-0 left-0 z-40 border-r border-white/5 pt-10">
            <div className="px-8 pb-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-gradient-to-tr from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(123,97,255,0.4)] border border-white/20">
                        <span className="material-symbols-outlined text-white text-xl">admin_panel_settings</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white font-display tracking-tight leading-none">Admin</h2>
                        <span className="text-[10px] text-primary font-bold tracking-widest uppercase">Chave AI</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-6">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Gestão da Plataforma</p>
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_15px_rgba(123,97,255,0.05)]'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {link.icon}
                            <span className="font-medium text-sm">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-white/5 bg-black/20">
                <Link href="/admin/login" className="flex items-center gap-4 p-3 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 transition-all cursor-pointer group border border-transparent hover:border-rose-500/20">
                    <LogOut className="size-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-semibold">Sair do Painel</span>
                </Link>
            </div>
        </aside>
    );
}
