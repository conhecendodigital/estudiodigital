'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase';

/**
 * AdminGuard — Protege todas as rotas /admin/* (exceto /admin/login).
 * Verifica se o usuário está logado e se é admin (is_admin = true).
 * Se não for admin, redireciona para a home.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Não proteger a página de login do admin
        if (pathname === '/admin/login') {
            setIsAuthorized(true);
            setIsChecking(false);
            return;
        }

        async function checkAdmin() {
            try {
                const supabase = createClient();
                const { data: { user }, error: authError } = await supabase.auth.getUser();

                if (authError || !user) {
                    console.warn('[AdminGuard] Usuário não autenticado, redirecionando...');
                    router.replace('/admin/login');
                    return;
                }

                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', user.id)
                    .single();

                if (profileError || !profile?.is_admin) {
                    console.warn('[AdminGuard] Usuário não é admin, redirecionando...');
                    router.replace('/');
                    return;
                }

                setIsAuthorized(true);
            } catch (err) {
                console.error('[AdminGuard] Erro ao verificar admin:', err);
                router.replace('/');
            } finally {
                setIsChecking(false);
            }
        }

        checkAdmin();
    }, [pathname, router]);

    if (isChecking) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 text-sm font-medium">Verificando permissões...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
