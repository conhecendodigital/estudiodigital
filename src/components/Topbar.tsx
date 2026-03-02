'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Topbar() {
    const router = useRouter();
    const pathname = usePathname();

    // Hides the client's Topbar globally when on an Admin route
    if (pathname && pathname.startsWith('/admin')) {
        return null;
    }

    // Hide Topbar on authentication and onboarding routes
    if (pathname && (pathname === '/login' || pathname === '/cadastro' || pathname.startsWith('/onboarding'))) {
        return null;
    }

    return (
        <header className="flex items-center justify-between border-b border-white/5 px-6 py-4 glass-panel sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl w-full">
            <div className="flex items-center gap-4">
                {/* Botão de Voltar Global */}
                <button
                    onClick={() => router.back()}
                    className="size-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10"
                    title="Voltar"
                >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>

                {/* Logo e Branding do Editor de Prompts Master */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-primary p-2 rounded-lg flex items-center justify-center neon-glow group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-white text-xl">bolt</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-100 font-display">
                        chave.ai <span className="text-primary text-[10px] uppercase tracking-widest ml-1 font-black">Admin</span>
                    </h2>
                </Link>
            </div>

            <nav className="hidden md:flex items-center gap-8">
                <Link href="/agentes" className="text-slate-400 hover:text-primary transition-colors text-sm font-medium">Agentes</Link>
                <Link href="/cofre" className="text-slate-400 hover:text-primary transition-colors text-sm font-medium">Cofre</Link>
                <Link href="/calendario" className="text-slate-400 hover:text-primary transition-colors text-sm font-medium">Calendário</Link>
                <Link href="/historico" className="text-slate-400 hover:text-primary transition-colors text-sm font-medium">Histórico</Link>
            </nav>

            <div className="flex items-center gap-4">
                <button className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold transition-all border border-primary/20">
                    Plano Admin
                </button>
            </div>
        </header>
    );
}
