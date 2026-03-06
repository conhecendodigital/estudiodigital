'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ChatSession = {
    id: string;
    title: string;
    agent_id: string;
    created_at: string;
    updated_at: string;
    agents: {
        name: string;
        role: string;
        category: string;
        avatar_url: string | null;
    } | null;
    message_count: number;
    last_message: string | null;
};

export default function HistoricoPage() {
    const supabase = createClient();
    const { profile } = useAuth();
    const router = useRouter();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchSessions() {
            if (!profile?.id) return;

            try {
                // Fetch chat sessions with agent info
                const { data: sessionData, error } = await supabase
                    .from('chat_sessions')
                    .select(`
                        id, title, agent_id, created_at, updated_at,
                        agents (
                            name,
                            role,
                            category,
                            avatar_url
                        )
                    `)
                    .eq('user_id', profile.id)
                    .order('updated_at', { ascending: false })
                    .limit(50);

                if (error) {
                    console.error("Error fetching sessions:", error);
                    setIsLoading(false);
                    return;
                }

                if (sessionData) {
                    // For each session, get message count and last message
                    const enrichedSessions = await Promise.all(
                        sessionData.map(async (session: any) => {
                            const { count } = await supabase
                                .from('chat_messages')
                                .select('*', { count: 'exact', head: true })
                                .eq('session_id', session.id);

                            const { data: lastMsg } = await supabase
                                .from('chat_messages')
                                .select('content')
                                .eq('session_id', session.id)
                                .eq('role', 'user')
                                .order('created_at', { ascending: false })
                                .limit(1)
                                .single();

                            return {
                                ...session,
                                message_count: count || 0,
                                last_message: lastMsg?.content || null,
                            };
                        })
                    );

                    setSessions(enrichedSessions);
                }
            } catch (err) {
                console.error("Error fetching sessions:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSessions();
    }, [profile?.id]);

    const getCategoryIcon = (category: string) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('conteúdo') || cat.includes('conteudo')) return 'edit_note';
        if (cat.includes('venda')) return 'point_of_sale';
        if (cat.includes('suporte')) return 'support_agent';
        if (cat.includes('estratég') || cat.includes('estrateg')) return 'strategy';
        if (cat.includes('produtividade')) return 'speed';
        return 'smart_toy';
    };

    const getCategoryColor = (category: string) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('conteúdo') || cat.includes('conteudo')) return 'text-sky-400';
        if (cat.includes('venda')) return 'text-emerald-400';
        if (cat.includes('suporte')) return 'text-amber-400';
        if (cat.includes('estratég') || cat.includes('estrateg')) return 'text-violet-400';
        if (cat.includes('produtividade')) return 'text-rose-400';
        return 'text-primary';
    };

    const filteredSessions = sessions.filter(session => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            session.title?.toLowerCase().includes(query) ||
            session.agents?.name?.toLowerCase().includes(query) ||
            session.last_message?.toLowerCase().includes(query)
        );
    });

    const handleOpenChat = (session: ChatSession) => {
        router.push(`/chat?agent=${session.agent_id}`);
    };

    const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Tem certeza que deseja excluir esta conversa?')) return;

        // Delete messages first, then session
        await supabase.from('chat_messages').delete().eq('session_id', sessionId);
        await supabase.from('chat_sessions').delete().eq('id', sessionId);
        setSessions(prev => prev.filter(s => s.id !== sessionId));
    };

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen overflow-hidden flex">
            <Sidebar />

            <main className="flex-1 flex flex-col md:ml-[280px] overflow-y-auto relative h-screen">

                {/* Header */}
                <header className="sticky top-0 z-40 flex items-center justify-between border-b border-primary/10 bg-background-dark/80 backdrop-blur-md px-6 md:px-10 py-4">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary text-2xl">history</span>
                        <h2 className="text-slate-100 text-xl font-sora font-extrabold leading-tight tracking-tight">Histórico</h2>
                    </div>

                    <div className="flex flex-1 justify-end gap-6 items-center">
                        <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-full bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md">
                                <div className="text-slate-400 flex items-center justify-center pl-4">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input
                                    className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 placeholder:text-slate-500 px-4 text-sm text-white focus:outline-none"
                                    placeholder="Buscar conversa..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </label>
                    </div>
                </header>

                <section className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
                    {/* Title area */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <h2 className="text-3xl font-sora font-extrabold text-white mb-2 tracking-tight">Suas Conversas</h2>
                            <p className="text-slate-400 text-sm">
                                {sessions.length} {sessions.length === 1 ? 'conversa' : 'conversas'} no total
                            </p>
                        </div>
                    </div>

                    {/* Sessions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex flex-col rounded-xl border border-primary/10 overflow-hidden bg-white/5 backdrop-blur-md animate-pulse h-48">
                                    <div className="p-6 flex flex-col gap-4">
                                        <div className="h-5 w-40 bg-white/10 rounded"></div>
                                        <div className="h-3 w-full bg-white/5 rounded"></div>
                                        <div className="h-3 w-20 bg-white/10 rounded mt-4"></div>
                                    </div>
                                </div>
                            ))
                        ) : filteredSessions.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">chat_bubble_outline</span>
                                <h3 className="text-xl font-sora font-bold text-slate-400 mb-2">
                                    {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                                </h3>
                                <p className="text-slate-500 text-sm max-w-md">
                                    {searchQuery
                                        ? 'Tente buscar por outro termo.'
                                        : 'Comece uma conversa com um agente na biblioteca de agentes para ver seu histórico aqui.'
                                    }
                                </p>
                                {!searchQuery && (
                                    <button
                                        onClick={() => router.push('/agentes')}
                                        className="mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(123,97,255,0.3)] transition-all"
                                    >
                                        Ver Agentes
                                    </button>
                                )}
                            </div>
                        ) : filteredSessions.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => handleOpenChat(session)}
                                className="group relative flex flex-col rounded-xl border border-primary/10 overflow-hidden hover:border-primary/40 transition-all duration-300 bg-white/5 backdrop-blur-md cursor-pointer"
                            >
                                {/* Top bar with agent info */}
                                <div className="px-5 pt-5 pb-3 flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${getCategoryColor(session.agents?.category || '')}`}>
                                        <span className="material-symbols-outlined text-xl">
                                            {getCategoryIcon(session.agents?.category || '')}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-sora font-bold text-sm truncate">{session.agents?.name || 'Agente'}</p>
                                        <p className="text-slate-500 text-xs font-mono">{session.agents?.category || 'Geral'}</p>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteSession(session.id, e)}
                                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1 rounded-lg hover:bg-red-500/10"
                                        title="Excluir conversa"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="px-5 pb-2 flex-1">
                                    <h3 className="text-slate-200 font-medium text-sm leading-relaxed truncate" title={session.title}>
                                        {session.title}
                                    </h3>
                                    {session.last_message && (
                                        <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                                            "{session.last_message}"
                                        </p>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-5 py-3 border-t border-primary/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                            <span className="material-symbols-outlined text-sm">chat</span>
                                            {session.message_count}
                                        </span>
                                        <span className="text-xs font-mono text-slate-500">
                                            {format(new Date(session.updated_at), "dd MMM, HH:mm", { locale: ptBR })}
                                        </span>
                                    </div>
                                    <span className="material-symbols-outlined text-primary text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        arrow_forward
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
