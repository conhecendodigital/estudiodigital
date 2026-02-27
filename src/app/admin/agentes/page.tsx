'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';

/* ── Mock Agents Data ── */
interface Agent {
    id: string;
    name: string;
    description: string;
    category: string;
    model: string;
    modelProvider: string;
    modelIcon: string;
    modelColor: string;
    modelBg: string;
    executions: string;
    active: boolean;
    gradient: string;
    initials: string;
}

const initialAgents: Agent[] = [
    {
        id: '1',
        name: 'Copywriter de Reels',
        description: 'Especialista em criar roteiros virais para Instagram Reels e TikTok. Usa gatilhos mentais de curiosidade e storytelling para maximizar engajamento e compartilhamento.',
        category: 'Copywriting',
        model: 'Claude 4.5 Sonnet',
        modelProvider: 'Anthropic',
        modelIcon: 'smart_toy',
        modelColor: 'text-amber-400',
        modelBg: 'bg-amber-500/15',
        executions: '14.2k',
        active: true,
        gradient: 'from-violet-600 to-purple-500',
        initials: 'CR',
    },
    {
        id: '2',
        name: 'Vendedor Inteligente',
        description: 'Agente treinado para conduzir conversas de vendas consultivas via chat. Identifica objeções, aplica técnicas de fechamento e gera orçamentos automáticos.',
        category: 'Vendas',
        model: 'GPT-4o',
        modelProvider: 'OpenAI',
        modelIcon: 'psychology',
        modelColor: 'text-emerald-400',
        modelBg: 'bg-emerald-500/15',
        executions: '8.7k',
        active: true,
        gradient: 'from-emerald-600 to-teal-500',
        initials: 'VI',
    },
    {
        id: '3',
        name: 'Suporte Nível 1',
        description: 'Atendimento automatizado de primeiro nível. Responde dúvidas frequentes, abre tickets e escala para humanos quando necessário, usando base de conhecimento interna.',
        category: 'Suporte',
        model: 'Gemini 2.5 Flash',
        modelProvider: 'Google',
        modelIcon: 'auto_awesome',
        modelColor: 'text-blue-400',
        modelBg: 'bg-blue-500/15',
        executions: '23.1k',
        active: false,
        gradient: 'from-blue-600 to-cyan-500',
        initials: 'S1',
    },
    {
        id: '4',
        name: 'Analista de Dados',
        description: 'Interpreta relatórios, gera insights de métricas de marketing e vendas, cria resumos executivos semanais e identifica tendências de crescimento.',
        category: 'Analytics',
        model: 'DeepSeek R1',
        modelProvider: 'OpenRouter',
        modelIcon: 'route',
        modelColor: 'text-rose-400',
        modelBg: 'bg-rose-500/15',
        executions: '5.4k',
        active: true,
        gradient: 'from-rose-600 to-pink-500',
        initials: 'AD',
    },
];

const categoryFilters = ['Todas', 'Vendas', 'Copywriting', 'Suporte', 'Analytics', 'Educação'];
const modelFilters = ['Todos', 'GPT-4o', 'Claude 4.5 Sonnet', 'Gemini 2.5 Flash', 'DeepSeek R1'];

/* ── Category Badge ── */
function CategoryTag({ category }: { category: string }) {
    const colorMap: Record<string, string> = {
        Vendas: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        Copywriting: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
        Suporte: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        Analytics: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        Educação: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colorMap[category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
            {category}
        </span>
    );
}

/* ═══════════════════════════════════════════
   GESTÃO DE AGENTES PAGE
   ═══════════════════════════════════════════ */
export default function GestaoAgentesPage() {
    const [agents, setAgents] = useState<Agent[]>(initialAgents);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todas');
    const [modelFilter, setModelFilter] = useState('Todos');

    /* ── Toggle Agent ── */
    const toggleAgent = (id: string) => {
        setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
    };

    /* ── Filtered Agents ── */
    const filtered = useMemo(() => {
        return agents.filter((a) => {
            const matchesSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
            const matchesCat = categoryFilter === 'Todas' || a.category === categoryFilter;
            const matchesModel = modelFilter === 'Todos' || a.model === modelFilter;
            return matchesSearch && matchesCat && matchesModel;
        });
    }, [agents, search, categoryFilter, modelFilter]);

    return (
        <div className="flex min-h-screen bg-background-dark font-display text-slate-100">
            <AdminSidebar />

            <main
                className="flex-1 ml-72 p-10 overflow-y-auto w-full relative"
                style={{
                    backgroundImage: 'radial-gradient(circle at top center, rgba(123,97,255,0.1), transparent 60%)',
                }}
            >
                {/* ─── HEADER ─── */}
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/15 p-3 rounded-xl border border-primary/20 shadow-[0_0_20px_rgba(123,97,255,0.2)]">
                            <span className="material-symbols-outlined text-primary text-2xl">groups</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-sora text-white tracking-tight">Gestão de Agentes</h1>
                            <p className="text-slate-400 mt-0.5 text-sm">Gerencie, edite e monitore os agentes disponíveis na plataforma.</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/agentes/novo"
                        className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-sora font-semibold text-sm bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(123,97,255,0.35)] hover:shadow-[0_0_30px_rgba(123,97,255,0.5)] transition-all duration-300 border border-white/10"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Criar Novo Agente
                    </Link>
                </header>

                {/* ─── FILTER BAR ─── */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[260px]">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="material-symbols-outlined text-slate-600 text-lg">search</span>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar agente por nome ou prompt..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="material-symbols-outlined text-slate-600 text-[16px]">category</span>
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 appearance-none cursor-pointer"
                        >
                            {categoryFilters.map((c) => (
                                <option key={c} value={c} className="bg-[#1a1a2e] text-slate-200">{c}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="material-symbols-outlined text-slate-500 text-[16px]">expand_more</span>
                        </div>
                    </div>

                    {/* Model Filter */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="material-symbols-outlined text-slate-600 text-[16px]">memory</span>
                        </div>
                        <select
                            value={modelFilter}
                            onChange={(e) => setModelFilter(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 appearance-none cursor-pointer"
                        >
                            {modelFilters.map((m) => (
                                <option key={m} value={m} className="bg-[#1a1a2e] text-slate-200">{m}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="material-symbols-outlined text-slate-500 text-[16px]">expand_more</span>
                        </div>
                    </div>
                </div>

                {/* ─── AGENTS GRID ─── */}
                {filtered.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-16 text-center">
                        <span className="material-symbols-outlined text-slate-600 text-5xl mb-4 block">search_off</span>
                        <p className="text-lg font-semibold text-slate-400 mb-1">Nenhum agente encontrado</p>
                        <p className="text-sm text-slate-600">Tente ajustar os filtros ou crie um novo agente.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filtered.map((agent) => (
                            <div
                                key={agent.id}
                                className={`bg-white/5 backdrop-blur-md border rounded-2xl flex flex-col transition-all duration-500 group hover:-translate-y-1 ${agent.active
                                    ? 'border-white/10 hover:border-primary/30 hover:shadow-[0_0_25px_rgba(123,97,255,0.1)]'
                                    : 'border-white/5 opacity-60 hover:opacity-80'
                                    }`}
                            >
                                {/* Card Header: Avatar + Toggle */}
                                <div className="p-5 pb-0 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-12 rounded-xl bg-gradient-to-tr ${agent.gradient} flex items-center justify-center font-bold text-white text-sm border border-white/20 shadow-lg`}>
                                            {agent.initials}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-base font-bold font-sora text-white truncate group-hover:text-primary transition-colors duration-300">
                                                {agent.name}
                                            </h3>
                                            <CategoryTag category={agent.category} />
                                        </div>
                                    </div>

                                    {/* Toggle */}
                                    <button
                                        onClick={() => toggleAgent(agent.id)}
                                        className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 mt-1 ${agent.active
                                            ? 'bg-primary shadow-[0_0_12px_rgba(123,97,255,0.4)]'
                                            : 'bg-white/10'
                                            }`}
                                        title={agent.active ? 'Desativar agente' : 'Ativar agente'}
                                    >
                                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${agent.active ? 'left-[calc(100%-1.375rem)]' : 'left-0.5'
                                            }`} />
                                    </button>
                                </div>

                                {/* Description */}
                                <div className="px-5 pt-3 pb-4 flex-1">
                                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                                        {agent.description}
                                    </p>

                                    {/* Model Badge + Stats */}
                                    <div className="flex items-center justify-between mt-4">
                                        <div className={`inline-flex items-center gap-1.5 ${agent.modelBg} border border-white/5 px-2.5 py-1 rounded-lg`}>
                                            <span className={`material-symbols-outlined text-[13px] ${agent.modelColor}`}>{agent.modelIcon}</span>
                                            <span className={`text-[11px] font-semibold ${agent.modelColor}`}>{agent.model}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <span className="material-symbols-outlined text-[14px]">bolt</span>
                                            <span className="text-[11px] font-bold">{agent.executions} execuções</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer: Actions */}
                                <div className="border-t border-white/5 px-5 py-3 flex items-center">
                                    <Link href={`/admin/agentes/${agent.id}`} className="flex items-center gap-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs font-semibold">
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                        Editar
                                    </Link>
                                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-slate-200 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs font-semibold">
                                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                        Duplicar
                                    </button>
                                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs font-semibold ml-auto">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ─── FOOTER STATS ─── */}
                <div className="mt-6 flex items-center justify-between text-xs text-slate-600">
                    <p>
                        Mostrando <span className="text-slate-400 font-bold">{filtered.length}</span> de <span className="text-slate-400 font-bold">{agents.length}</span> agentes
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="size-2 bg-primary rounded-full" />
                            {agents.filter((a) => a.active).length} Ativos
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="size-2 bg-slate-600 rounded-full" />
                            {agents.filter((a) => !a.active).length} Inativos
                        </span>
                    </div>
                </div>

            </main>
        </div>
    );
}
