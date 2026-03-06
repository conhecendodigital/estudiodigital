'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';

type Profile = {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    company_name: string | null;
    niche: string | null;
    role: string | null;
    social_platforms: string[] | null;
    bio: string | null;
    gender: string | null;
    website: string | null;
    credits_available: number;
    credits_total: number;
    credits_renewal_date: string | null;
    is_admin: boolean;
    onboarding_completed: boolean;
    created_at: string;
    updated_at: string;
};

type AuthContextType = {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = useMemo(() => createClient(), []);
    const fetchingRef = useRef(false);

    const fetchProfile = useCallback(async (userId: string, userMeta?: any) => {
        if (fetchingRef.current) {
            console.log("-> fetchProfile ignorado (já está em execução)");
            return;
        }

        fetchingRef.current = true;
        try {
            console.log("-> fetchProfile chamando para userId:", userId);

            // Corrida contra o tempo (5 segundos) para evitar o deadlock do Supabase
            const fetchPromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            const timeoutPromise = new Promise((resolve) =>
                setTimeout(() => resolve({
                    data: null,
                    error: { message: 'Supabase query deadline exceeded', code: 'TIMEOUT' }
                }), 1000)
            );

            let { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

            // Se não encontrou o perfil, cria um novo (Fallback robusto para testes e Cadastros Incompletos)
            if (error && error.code === 'PGRST116') {
                console.log("Perfil não encontrado, criando um novo automático...");
                const defaultName = userMeta?.full_name || 'Novo Usuário';
                const email = userMeta?.email || '';

                const { data: newProfile, error: insertError } = await supabase
                    .from('profiles')
                    .insert([{
                        id: userId,
                        email: email,
                        full_name: defaultName,
                        credits_available: 2000,
                        credits_total: 2000
                    }])
                    .select()
                    .single();

                if (!insertError && newProfile) {
                    data = newProfile;
                    error = null;
                } else {
                    console.error("Erro ao criar perfil fallback:", insertError);
                }
            }

            if (!error && data) {
                console.log("-> fetchProfile sucesso, setando profile state");
                setProfile(data as Profile);
            } else if (error) {
                if (error.code === 'TIMEOUT') {
                    console.warn("-> fetchProfile [TIMEOUT]: Supabase timeout (1s) alcançado, ignorando travamento.");
                } else {
                    console.error("-> fetchProfile ERRO final do Supabase:", error);
                }
            }
        } catch (err) {
            console.error("-> fetchProfile EXCESSÃO CRÍTICA (quebrando o fluxo):", err);
        } finally {
            fetchingRef.current = false;
        }
    }, [supabase]);

    const refreshProfile = useCallback(async () => {
        if (user) {
            await fetchProfile(user.id, user.user_metadata);
        }
    }, [user, fetchProfile]);

    useEffect(() => {
        let mounted = true;

        async function getSession() {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (!mounted) return;

                if (error) {
                    console.error("AuthContext getSession error:", error);
                    setLoading(false);
                    return;
                }

                const currentUser = data?.session?.user ?? null;
                setUser(currentUser);

                if (currentUser) {
                    await fetchProfile(currentUser.id, currentUser.user_metadata);
                }
            } catch (err) {
                console.error("AuthContext getSession exception:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        // O onAuthStateChange(INITIAL_SESSION) disparado pelo Supabase 
        // já cobre a carga inicial da sessão. Eliminei a chamada explícita 
        // de getSession() para evitar disparo duplo e travamento.
        // getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                await fetchProfile(currentUser.id, currentUser.user_metadata);
            } else {
                setProfile(null);
            }
            if (mounted) setLoading(false);
        });

        return () => {
            mounted = false;
            authListener?.subscription?.unsubscribe();
        };
    }, [fetchProfile, supabase]);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    };

    const signUp = async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
