'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase';
import { Zap, Bot, Edit3, CalendarDays, DollarSign, Mail, Search, MessageSquare } from 'lucide-react';

export default function DashboardHome() {
    const { profile } = useAuth();
    const supabase = createClient();

    // State for dashboard data
    const [recentAgents, setRecentAgents] = useState<any[]>([]);
    const [weeklyProgress, setWeeklyProgress] = useState(0);
    const [weeklyTrend, setWeeklyTrend] = useState(0);
    const [weeklyDistribution, setWeeklyDistribution] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
    const [isPremium, setIsPremium] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fallback to unlock loading UI if Supabase hangs
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        async function fetchDashboardData() {
            try {
                // Fetch recent/active agents
                const { data: agentsData } = await supabase
                    .from('agents')
                    .select('*')
                    .eq('status', 'ativo')
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (agentsData) {
                    setRecentAgents(agentsData);
                }

                if (profile?.id) {
                    // Fetch existing subscription to check if user is Premium
                    const { data: subData } = await supabase
                        .from('subscriptions')
                        .select('status')
                        .eq('user_id', profile.id)
                        .eq('status', 'ativo')
                        .maybeSingle();

                    if (subData) {
                        setIsPremium(true);
                    }

                    // Fetch weekly logs to calculate "Progresso da Semana"
                    const now = new Date();
                    const oneWeekAgo = new Date(now);
                    oneWeekAgo.setDate(now.getDate() - 7);

                    const twoWeeksAgo = new Date(now);
                    twoWeeksAgo.setDate(now.getDate() - 14);

                    const { data: logsData, error: logsError } = await supabase
                        .from('content_history')
                        .select('created_at')
                        .eq('user_id', profile.id)
                        .gte('created_at', twoWeeksAgo.toISOString());

                    if (logsError) {
                        console.error("Error fetching progress logs:", logsError);
                    } else if (logsData) {
                        const currentWeekLogs = logsData.filter((log: any) => new Date(log.created_at) >= oneWeekAgo);
                        const previousWeekLogs = logsData.filter((log: any) => new Date(log.created_at) >= twoWeeksAgo && new Date(log.created_at) < oneWeekAgo);

                        const current = currentWeekLogs.length;
                        const previous = previousWeekLogs.length;

                        setWeeklyProgress(current);

                        // 7-day distribution (Mon-Sun)
                        const dailyCounts = [0, 0, 0, 0, 0, 0, 0];
                        currentWeekLogs.forEach((log: any) => {
                            const date = new Date(log.created_at);
                            const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
                            dailyCounts[dayIndex]++;
                        });
                        setWeeklyDistribution(dailyCounts);

                        // Calcular a variação percentual
                        if (previous === 0) {
                            setWeeklyTrend(current > 0 ? 100 : 0);
                        } else {
                            const trend = ((current - previous) / previous) * 100;
                            setWeeklyTrend(Math.round(trend));
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                clearTimeout(timeoutId);
                setIsLoading(false);
            }
        }

        fetchDashboardData();
        return () => clearTimeout(timeoutId);
    }, [profile?.id]);

    const firstName = profile?.full_name?.split(' ')[0] || 'Usuário';
    const creditsTotal = profile?.credits_total || 0;
    const creditsAvailable = profile?.credits_available || 0;
    const creditsUsed = Math.max(0, creditsTotal - creditsAvailable);

    const usagePercentage = creditsTotal > 0 ? Math.min(100, Math.max(0, (creditsUsed / creditsTotal) * 100)) : 0;
    const availablePercentage = creditsTotal > 0 ? Math.min(100, Math.max(0, (creditsAvailable / creditsTotal) * 100)) : 0;

    // Format the date properly for the UI (e.g. "03 ABR")
    let nextRenewal = 'Não definida';
    if (profile?.credits_renewal_date) {
        const dateObj = new Date(profile.credits_renewal_date);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
        const month = monthNames[dateObj.getMonth()];
        nextRenewal = `${day} ${month}`;
    }

    // Agent icon mapping helper
    const getAgentIcon = (categoryStr: string) => {
        const category = categoryStr?.toLowerCase() || '';
        if (category === 'conteudo') return <Edit3 className="text-white" />;
        if (category === 'vendas') return <DollarSign className="text-white" />;
        if (category === 'produtividade') return <Mail className="text-white" />;
        if (category === 'estrategico') return <Search className="text-white" />;
        if (category === 'suporte') return <MessageSquare className="text-white" />;
        return <Zap className="text-white" />;
    };

    const getAgentColor = (categoryStr: string) => {
        const category = (categoryStr || '').toLowerCase();

        const colorMap: Record<string, string> = {
            vendas: 'bg-emerald-500/20 text-emerald-400',
            conteudo: 'bg-indigo-500/20 text-indigo-400',
            suporte: 'bg-blue-500/20 text-blue-400',
            estrategico: 'bg-rose-500/20 text-rose-400',
            produtividade: 'bg-amber-500/20 text-amber-400',
        };

        return colorMap[category] || 'bg-pink-500/20 text-pink-400';
    };
    return (
        <div className="flex min-h-screen bg-background-dark font-display">
            {/* Sidebar Overlay */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10 overflow-y-auto w-full relative">
                {/* Top Row Grid */}
                <div className="grid grid-cols-12 gap-6 mb-10">
                    {/* Credits Card */}
                    <div className="col-span-12 lg:col-span-5 glass-card rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden bg-card-dark">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <span className="material-symbols-outlined text-primary text-3xl">token</span>
                                <span className="text-xs font-mono text-slate-400">RENOVA EM: {nextRenewal}</span>
                            </div>
                            <h3 className="text-slate-300 text-sm font-medium uppercase tracking-widest mb-1 font-sora">Créditos Disponíveis</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-white">{creditsAvailable?.toLocaleString('pt-BR')}</span>
                                <span className="text-slate-500 font-medium font-sora">/ {creditsTotal?.toLocaleString('pt-BR')}</span>
                            </div>
                        </div>
                        <div className="mt-8 relative z-10">
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{ background: 'linear-gradient(90deg, #7b61ff 0%, #a855f7 50%, #ec4899 100%)', width: `${availablePercentage}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-3">
                                <span className="text-xs text-slate-500 font-mono">Consumo atual: {usagePercentage.toFixed(0)}%</span>
                                <a className="text-xs text-primary font-semibold hover:underline" href="/configuracoes">Recarregar agora</a>
                            </div>
                        </div>
                    </div>

                    {/* Shortcuts */}
                    <div className="col-span-12 lg:col-span-7 grid grid-cols-3 gap-6">
                        <div onClick={() => window.location.href = '/agentes?category=Conteúdo'} className="bg-card-dark border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all cursor-pointer shadow-lg hover:shadow-primary/5">
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-primary text-3xl">edit_note</span>
                            </div>
                            <span className="text-sm font-semibold text-white font-sora line-clamp-1">Agentes de Texto</span>
                            <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Copy & Scripts</span>
                        </div>

                        <div onClick={() => window.location.href = '/agentes?category=Produtividade'} className="bg-card-dark border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all cursor-pointer shadow-lg hover:shadow-primary/5">
                            <div className="size-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-orange-400 text-3xl">mail</span>
                            </div>
                            <span className="text-sm font-semibold text-white font-sora line-clamp-1">Produtividade</span>
                            <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Organizar</span>
                        </div>

                        <div onClick={() => window.location.href = '/agentes?category=Estratégico'} className="bg-card-dark border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all cursor-pointer shadow-lg hover:shadow-primary/5">
                            <div className="size-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-blue-400 text-3xl">search</span>
                            </div>
                            <span className="text-sm font-semibold text-white font-sora line-clamp-1">Estratégico</span>
                            <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Analisar SEO</span>
                        </div>
                    </div>
                </div>

                {/* Agents Grid */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white font-sora">Agentes Ativos</h3>
                        <a href="/agentes" className="text-sm text-slate-400 hover:text-white flex items-center gap-1 font-sora transition-colors">
                            Ver todos <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {isLoading ? (
                            // Loading Skeletons
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-card-dark border border-white/5 rounded-2xl p-6 h-48 animate-pulse flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-12 bg-white/5 rounded-xl"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 bg-white/5 rounded"></div>
                                                <div className="h-3 w-16 bg-white/5 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full mt-auto"></div>
                                </div>
                            ))
                        ) : recentAgents.length > 0 ? (
                            recentAgents.map((agent, index) => (
                                <div key={agent.id} className="bg-card-dark border border-white/5 rounded-2xl p-6 hover:-translate-y-1 transition-all hover:shadow-xl hover:shadow-primary/5 cursor-pointer group" onClick={() => window.location.href = `/chat?agent=${agent.id}`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-12 rounded-xl flex items-center justify-center ${getAgentColor(agent.category || '').split(' ')[0]}`}>
                                                {getAgentIcon(agent.category || '')}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white font-sora group-hover:text-primary transition-colors">{agent.name}</h4>
                                                <p className="text-xs text-slate-500 line-clamp-1 capitalize">{agent.category || 'Assistente'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded">
                                            <span className="size-2 bg-green-500 rounded-full animate-pulse" style={{ boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)' }}></span>
                                            <span className="text-[10px] font-bold text-green-500 uppercase">Online</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">Pronto para iniciar nova tarefa</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-12 text-center p-8 border border-dashed border-white/10 rounded-2xl">
                                <p className="text-slate-400">Nenhum agente ativo no momento.</p>
                                <a href="/agentes" className="text-primary hover:underline text-sm font-medium mt-2 inline-block">Explorar Biblioteca</a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats & Banner */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Progress Card */}
                    <div className="col-span-12 lg:col-span-4 bg-card-dark border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors">
                        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4 font-sora">Progresso da Semana</h3>
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <p className="text-5xl font-mono text-white leading-none">{weeklyProgress}</p>
                                <p className="text-sm text-slate-400 mt-2 font-medium font-sora">Interações na semana</p>
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-bold font-sora ${weeklyTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                <span className="material-symbols-outlined text-sm">
                                    {weeklyTrend >= 0 ? 'trending_up' : 'trending_down'}
                                </span>
                                <span>{weeklyTrend >= 0 ? '+' : ''}{weeklyTrend}%</span>
                            </div>
                        </div>

                        {/* Mini Chart */}
                        <div className="flex items-end gap-2 h-24">
                            {weeklyDistribution.map((count, index) => {
                                const maxCount = Math.max(...weeklyDistribution, 1); // Avoid division by zero
                                const heightPercentage = count === 0 ? 5 : Math.max(10, Math.round((count / maxCount) * 100));
                                const isToday = index === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

                                return (
                                    <div
                                        key={index}
                                        className={`w-full rounded-t transition-all duration-1000 cursor-pointer ${isToday
                                            ? 'bg-primary shadow-[0_0_15px_rgba(123,97,255,0.4)]'
                                            : count > 0
                                                ? 'bg-primary/60 hover:bg-primary/80'
                                                : 'bg-primary/20 hover:bg-primary/40'
                                            }`}
                                        style={{ height: `${heightPercentage}%` }}
                                        title={`${count} interações`}
                                    ></div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] text-slate-600 font-mono">
                            <span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SAB</span><span className="text-primary font-bold shadow-primary">DOM</span>
                        </div>
                    </div>

                    {/* Upgrade Banner - ONLY SHOW IF NOT PREMIUM */}
                    {!isPremium && (
                        <div className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-2xl group border border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-900 to-black"></div>
                            {/* Abstract Design for Banner */}
                            <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBuy4vKCHiLP9M0xXTkvA7EZS125hd8rnQcgenuw07VrGZVdkeTtVYthdYvoqyM-9mepKyAI2vfpKSBFCFNmQTKMcPH9XDv2_BKiOMA3XuX-TJiSCnuJJ3eoyV5LPUJN9wM7qjXQRE8PGBKqLRCJ-PEIkZgpIQywUbVAZLzFPJe8N9w-TUIYJBVgbb2EdDKL6_QBGmDTa7w60Ywjq31ecB4WKSaBmaaU886zie8TYUXaL_WC7WfsDhNY5NEog4NqC2ln18Y4c3WNIk")' }}></div>
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-500/30 blur-[100px] rounded-full"></div>

                            <div className="relative h-full p-10 flex flex-col md:flex-row items-center gap-10 z-10">
                                <div className="size-32 md:size-48 glass-card bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 group-hover:scale-105 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-7xl group-hover:text-white transition-colors">lock</span>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-3xl font-bold text-white mb-2 font-display">Upgrade para Premium</h3>
                                    <p className="text-slate-200/70 mb-8 max-w-md font-sora">Desbloqueie agentes ilimitados, modelos exclusivos e acesso antecipado às novas ferramentas de IA generativa.</p>
                                    <button className="btn-magnetic px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-slate-100 transition-all flex items-center gap-3 mx-auto md:mx-0 shadow-lg font-sora">
                                        Liberar Acesso <span className="material-symbols-outlined">bolt</span>
                                    </button>
                                </div>
                            </div>

                            {/* Frosted glass overlay for "Locked" feel */}
                            <div className="absolute top-0 right-0 p-4 z-20">
                                <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white/90 uppercase tracking-widest font-sora">
                                    Exclusive
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
