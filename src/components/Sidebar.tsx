'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const { profile, signOut } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [profileImage, setProfileImage] = React.useState<string | null>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    React.useEffect(() => {
        const loadImage = () => {
            const savedImage = localStorage.getItem('profileImage');
            if (savedImage) {
                setProfileImage(`url('${savedImage}')`);
            }
        };

        if (!profile?.avatar_url) {
            loadImage();
        }

        window.addEventListener('profileImageUpdated', loadImage);
        return () => window.removeEventListener('profileImageUpdated', loadImage);
    }, [profile?.avatar_url]);

    const displayImage = profile?.avatar_url ? `url('${profile.avatar_url}')` : profileImage;
    const nameStr = profile?.full_name || 'Usuário';
    const initals = nameStr.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
    const roleStr = profile?.is_admin ? 'Admin Master' : (profile?.role || 'Cliente');

    const navLinks = [
        { href: '/', icon: 'home', label: 'Início' },
        { href: '/agentes', icon: 'smart_toy', label: 'Agentes' },
        { href: '/cofre', icon: 'folder_open', label: 'Cofre' },
        { href: '/calendario', icon: 'calendar_month', label: 'Calendário' },
        { href: '/historico', icon: 'history', label: 'Histórico' },
    ];

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

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
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_15px_rgba(123,97,255,0.05)]'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined">{link.icon}</span>
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-white/5 bg-black/10 relative" ref={menuRef}>
                {/* Dropdown menu */}
                {menuOpen && (
                    <div className="absolute bottom-full left-6 right-6 mb-2 bg-surface-dark border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 backdrop-blur-xl">
                        <Link
                            href="/configuracoes"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">settings</span>
                            Configurações
                        </Link>
                        <Link
                            href="/perfil"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">person</span>
                            Meu Perfil
                        </Link>
                        <div className="border-t border-white/5" />
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full text-left"
                        >
                            <span className="material-symbols-outlined text-lg">logout</span>
                            Sair
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-all">
                    <Link href="/perfil" className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative">
                            {displayImage ? (
                                <div className="w-10 h-10 rounded-full border border-white/10 bg-cover bg-center flex items-center justify-center overflow-hidden" style={{ backgroundImage: displayImage }}>
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-full border border-white/10 bg-gradient-to-tr from-primary/30 to-accent-neon/30 flex items-center justify-center overflow-hidden">
                                    <span className="text-accent-neon font-bold font-display text-sm">{initals}</span>
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-sidebar-dark rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{nameStr}</p>
                            <p className="text-xs text-primary font-mono tracking-tighter truncate">{roleStr}</p>
                        </div>
                    </Link>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(!menuOpen);
                        }}
                        className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                        <span className="material-symbols-outlined text-sm">more_vert</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
