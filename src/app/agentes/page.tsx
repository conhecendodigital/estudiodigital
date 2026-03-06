'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { createClient } from '@/lib/supabase';
import { Zap, Bot, Edit3, Lock } from 'lucide-react';

function AgentesLibraryContent() {
    const supabase = createClient();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [agents, setAgents] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState(categoryParam || 'Todos');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Update active filter if URL parameter changes
        if (categoryParam) {
            setActiveFilter(categoryParam);
        }
    }, [categoryParam]);

    useEffect(() => {
        async function loadAgents() {
            try {
                setError(null);
                // Fetch all agents
                const { data, error } = await supabase
                    .from('agents')
                    .select('*')
                    .order('status', { ascending: true }) // active first
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    setAgents(data);
                }
            } catch (err: any) {
                console.error("Error loading agents:", err);
                setError(err.message || 'Falha ao carregar a biblioteca de agentes.');
            } finally {
                setIsLoading(false);
            }
        }
        loadAgents();
    }, []);

    // Filter agents on the client side
    const filteredAgents = agents.filter(agent => {
        if (activeFilter === 'Todos') return true;

        const cat = agent.category?.toLowerCase() || '';

        if (activeFilter === 'Conteúdo' && cat === 'conteudo') return true;
        if (activeFilter === 'Estratégico' && cat === 'estrategico') return true;
        if (activeFilter === 'Vendas' && cat === 'vendas') return true;
        if (activeFilter === 'Produtividade' && cat === 'produtividade') return true;
        if (activeFilter === 'Suporte' && cat === 'suporte') return true;

        return false;
    });

    const getAgentIcon = (categoryStr: string) => {
        const category = categoryStr?.toLowerCase() || '';
        if (category === 'conteudo') return 'edit_note';
        if (category === 'vendas') return 'point_of_sale';
        if (category === 'produtividade') return 'mail';
        if (category === 'estrategico') return 'search';
        if (category === 'suporte') return 'support_agent';
        return 'psychology';
    };

    const getGradientByCategory = (categoryStr: string) => {
        const category = categoryStr?.toLowerCase() || '';

        const colorMap: Record<string, string> = {
            vendas: 'from-green-400 to-emerald-600 shadow-emerald-500/20 group-hover:text-emerald-400',
            conteudo: 'from-purple-500 to-indigo-600 shadow-purple-500/20 group-hover:text-primary',
            suporte: 'from-blue-400 to-cyan-600 shadow-blue-500/20 group-hover:text-blue-400',
            estrategico: 'from-pink-500 to-rose-600 shadow-pink-500/20 group-hover:text-pink-400',
            produtividade: 'from-amber-400 to-orange-600 shadow-orange-500/20 group-hover:text-orange-400',
        };

        return colorMap[category] || 'from-slate-400 to-slate-600 shadow-slate-500/20 group-hover:text-slate-400';
    };
    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative min-h-screen md:ml-[280px]">
                {/* Abstract Plasma Accents */}
                <div
                    className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none opacity-50"
                    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(123, 97, 255, 0.15) 0%, rgba(10, 10, 20, 0) 70%)' }}
                ></div>
                <div
                    className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none opacity-30"
                    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(123, 97, 255, 0.15) 0%, rgba(10, 10, 20, 0) 70%)' }}
                ></div>

                <div className="max-w-7xl mx-auto px-10 py-12 relative z-10">
                    {/* Header Section */}
                    <header className="mb-12">
                        <h2 className="text-6xl font-sora font-extrabold tracking-tighter mb-4 text-slate-100">
                            Biblioteca de Agentes
                        </h2>
                        <p className="text-2xl font-serif italic text-slate-400"> {/* font-instrument becomes font-serif in Tailwind config */}
                            Ative o seu ecossistema de produtividade.
                        </p>
                    </header>

                    {/* Filters */}
                    <div className="flex gap-3 mb-12 overflow-x-auto pb-2 custom-scrollbar">
                        {['Todos', 'Vendas', 'Conteúdo', 'Suporte', 'Estratégico', 'Produtividade'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-6 py-2.5 rounded-full font-medium transition-transform ${activeFilter === filter
                                    ? 'glass-card bg-primary text-white border-primary/40 shadow-lg shadow-primary/20 hover:scale-105'
                                    : 'glass-card text-slate-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Agent Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {isLoading ? (
                            // Loading Skeletons
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="glass-card rounded-2xl p-6 h-64 animate-pulse flex flex-col">
                                    <div className="mb-6 size-14 rounded-2xl bg-white/5"></div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="h-5 w-32 bg-white/5 rounded"></div>
                                        <div className="h-4 w-12 bg-white/5 rounded-full"></div>
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <div className="h-3 w-full bg-white/5 rounded"></div>
                                        <div className="h-3 w-4/5 bg-white/5 rounded"></div>
                                    </div>
                                    <div className="mt-auto h-12 w-full bg-white/5 rounded-xl"></div>
                                </div>
                            ))
                        ) : error ? (
                            // Error State
                            <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center flex flex-col items-center">
                                <span className="material-symbols-outlined text-red-400 text-5xl mb-4">error</span>
                                <h3 className="text-xl font-bold text-red-400 mb-2">Ops! Algo deu errado.</h3>
                                <p className="text-slate-400 mb-6">{error}</p>
                                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full transition-colors font-medium">
                                    Tentar Novamente
                                </button>
                            </div>
                        ) : filteredAgents.length === 0 ? (
                            // Empty State
                            <div className="col-span-1 md:col-span-2 lg:col-span-4 glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center opacity-70">
                                <span className="material-symbols-outlined text-slate-500 text-6xl mb-4">search_off</span>
                                <h3 className="text-xl font-bold text-slate-300 mb-2">Nenhum agente encontrado</h3>
                                <p className="text-slate-500">
                                    Não encontramos nenhum agente ativo na categoria "{activeFilter}". Tente selecionar outra opção.
                                </p>
                            </div>
                        ) : filteredAgents.map((agent) => {
                            const isActive = agent.status === 'ativo';
                            const gradientClasses = getGradientByCategory(agent.category || '');
                            const hoverTextClass = gradientClasses.split(' ').find(c => c.startsWith('group-hover:text-'));
                            const bgGradientClass = gradientClasses.split(' ').find(c => c.startsWith('from-')) + ' ' + gradientClasses.split(' ').find(c => c.startsWith('to-'));
                            const shadowClass = gradientClasses.split(' ').find(c => c.startsWith('shadow-')) || '';

                            if (isActive) {
                                return (
                                    <div key={agent.id} className="glass-card rounded-2xl p-6 flex flex-col group transition-all duration-300">
                                        <div className={`mb-6 size-14 rounded-2xl bg-gradient-to-br ${bgGradientClass} flex items-center justify-center shadow-xl ${shadowClass} group-hover:scale-110 transition-transform`}>
                                            <span className="material-symbols-outlined text-white text-3xl">{getAgentIcon(agent.category || '')}</span>
                                        </div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className={`font-sora font-bold text-lg text-slate-100 transition-colors ${hoverTextClass}`}>{agent.name}</h3>
                                            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono font-bold border border-primary/30 uppercase">ATIVO</span>
                                        </div>
                                        <p className="text-sm text-slate-400 font-sora leading-relaxed mb-8 flex-grow">
                                            {agent.description || agent.role || 'Assistente de IA pronto para apoiar suas demandas.'}
                                        </p>
                                        <Link href={`/chat?agent=${agent.id}`} className="btn-magnetic w-full py-3 rounded-xl bg-white/5 hover:bg-primary text-slate-100 font-bold transition-all flex items-center justify-center gap-2">
                                            Acessar
                                            <span className="material-symbols-outlined text-sm pt-0.5">arrow_forward</span>
                                        </Link>
                                    </div>
                                );
                            }

                            // Draft / Inactive state (Locked)
                            return (
                                <div key={agent.id} className="glass-card rounded-2xl p-6 flex flex-col relative overflow-hidden opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/40">
                                        <span className="material-symbols-outlined text-white/50 text-6xl">lock</span>
                                    </div>
                                    <div className="mb-6 size-14 rounded-2xl bg-slate-700 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-3xl">{getAgentIcon(agent.category || '')}</span>
                                    </div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-sora font-bold text-lg text-slate-100">{agent.name}</h3>
                                    </div>
                                    <p className="text-sm text-slate-400 font-sora leading-relaxed mb-8 flex-grow">
                                        {agent.description || 'Este agente está passando por ajustes finos e será liberado em breve.'}
                                    </p>
                                    <div className="text-[10px] font-mono text-slate-500 uppercase">Versão {agent.model_config?.temperature ? 'Pro' : 'Beta'}</div>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AgentesLibraryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-dark flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
            <AgentesLibraryContent />
        </Suspense>
    );
}
