'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', icon: 'home', label: 'Início' },
        { href: '/agentes', icon: 'smart_toy', label: 'Agentes' },
        { href: '/cofre', icon: 'folder_open', label: 'Cofre' },
        { href: '/calendario', icon: 'calendar_month', label: 'Calendário' },
        { href: '/historico', icon: 'history', label: 'Histórico' },
    ];

    return (
        <aside className="w-72 bg-sidebar-dark flex flex-col fixed inset-y-0 left-0 z-40 border-r border-white/5 pt-[80px]"> {/* pt-[80px] para ficar abaixo do Topbar */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_15px_rgba(123,97,255,0.05)]' // Ajustado para premium UI
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined">{link.icon}</span>
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-white/5 bg-black/10">
                <Link href="/perfil" className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full border border-white/10 bg-gradient-to-tr from-primary/30 to-accent-neon/30 flex items-center justify-center overflow-hidden">
                            <span className="text-accent-neon font-bold font-display text-sm">MS</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-sidebar-dark rounded-full"></div>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-white">Mariana Silva</p>
                        <p className="text-xs text-primary font-mono tracking-tighter">Admin Master</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 text-sm">more_vert</span>
                </Link>
            </div>
        </aside>
    );
}
