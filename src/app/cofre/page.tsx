'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CofrePage() {
    const supabase = createClient();
    const router = useRouter();
    const { profile } = useAuth();

    const [links, setLinks] = useState<any[]>([]);
    const [urlInput, setUrlInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('Todos');

    useEffect(() => {
        if (!profile?.id) return;
        fetchLinks();
    }, [profile?.id]);

    const fetchLinks = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('vault_references')
                .select('*')
                .eq('user_id', profile?.id)
                .order('created_at', { ascending: false });

            if (data && !error) {
                setLinks(data);
            }
        } catch (err) {
            console.error("Error fetching vault links", err);
        } finally {
            setIsLoading(false);
        }
    };

    const detectPlatform = (url: string) => {
        if (!url) return 'Outros';
        const u = url.toLowerCase();
        if (u.includes('tiktok.com')) return 'TikTok';
        if (u.includes('instagram.com/reel')) return 'Instagram Reels';
        if (u.includes('youtube.com/shorts')) return 'YouTube Shorts';
        return 'Outros';
    };

    const [loadingStatus, setLoadingStatus] = useState('');

    const handleSaveLink = async () => {
        if (!urlInput.trim() || !profile?.id) return;

        setIsSaving(true);
        setLoadingStatus('Enviando para análise...');

        try {
            // Chamar a nova API unificada server-side
            setLoadingStatus('Extraindo vídeo...');

            const res = await fetch('/api/vault/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlInput }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Erro ${res.status} no processamento`);
            }

            console.log("[VAULT UI] Processamento completo:", data);

            // Limpar input e recarregar lista
            setUrlInput('');
            await fetchLinks();

            // Redirecionar para a página de análise
            if (data.reference?.id) {
                router.push(`/cofre/${data.reference.id}`);
            }

        } catch (err: any) {
            console.error('[VAULT UI] Erro:', err);
            alert(err.message || "Erro ao processar o vídeo.");
            // Recarregar lista para mostrar estado atual
            await fetchLinks();
        } finally {
            setIsSaving(false);
            setLoadingStatus('');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja realmente remover este link?')) return;

        try {
            await supabase
                .from('vault_references')
                .delete()
                .eq('id', id)
                .eq('user_id', profile?.id);

            setLinks(links.filter(l => l.id !== id));
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    const filteredLinks = links.filter(link => {
        const platform = detectPlatform(link.url);
        if (activeFilter === 'Todos') return true;
        return platform === activeFilter;
    });

    return (
        <div className="bg-background-dark text-slate-100 font-display selection:bg-primary/30 min-h-screen flex overflow-hidden">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative md:ml-[280px]">
                {/* Decorative Accents */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none z-0"></div>

                <div className="max-w-7xl mx-auto px-12 py-12 relative z-10">
                    {/* Header Section */}
                    <header className="mb-12">
                        <h1 className="font-sora text-5xl font-bold tracking-tight mb-2">Cofre de Referências</h1>
                        <p className="font-serif text-3xl italic text-slate-400">Armazene e analise conteúdos virais com IA.</p>
                    </header>

                    {/* Link Input Section */}
                    <section className="mb-16">
                        <div className="flex items-center gap-4 max-w-4xl">
                            <div className="relative flex-1 group">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-primary/50">
                                    <span className="material-symbols-outlined">link</span>
                                </div>
                                <input
                                    className="w-full bg-primary/5 backdrop-blur-md border border-primary/20 h-16 pl-14 pr-6 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-display"
                                    placeholder="Cole aqui o link do TikTok ou Reels..."
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveLink()}
                                />
                            </div>
                            <button
                                onClick={handleSaveLink}
                                disabled={isSaving || !urlInput.trim()}
                                className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-sora font-bold px-10 h-16 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(123,97,255,0.3)] active:scale-95 group"
                            >
                                <span>{isSaving ? (loadingStatus || 'Analisando via IA...') : 'Analisar'}</span>
                                {isSaving && <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></span>}
                                {!isSaving && <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">auto_awesome</span>}
                            </button>
                        </div>
                    </section>

                    {/* Filters */}
                    <div className="flex items-center gap-8 mb-8 border-b border-white/5 pb-2">
                        {['Todos', 'TikTok', 'Instagram Reels', 'YouTube Shorts'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`pb-4 border-b-2 font-bold text-sm tracking-wide transition-colors ${activeFilter === filter
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-card-dark rounded-lg overflow-hidden border border-white/5 flex flex-col h-80 animate-pulse">
                                    <div className="aspect-[9/16] bg-white/5"></div>
                                </div>
                            ))
                        ) : filteredLinks.length === 0 ? (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">folder_off</span>
                                <p className="font-sora text-lg">Nenhum link salvo nesta categoria ainda.</p>
                            </div>
                        ) : filteredLinks.map((link) => {
                            // Determine platform colors
                            const platform = detectPlatform(link.url);
                            const isTiktok = platform === 'TikTok';
                            const isYT = platform === 'YouTube Shorts';
                            const badgeColor = isTiktok ? 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30' :
                                (isYT ? 'text-red-400 bg-red-500/20 border-red-500/30' :
                                    'text-[#FF0050] bg-[#FF0050]/20 border-[#FF0050]/30'); // Reels default

                            const isPending = link.status === 'PENDENTE';
                            const isDownloading = link.status === 'DOWNLOAD_COMPLETE';
                            const isError = link.status === 'ERRO';
                            const isProcessing = isPending || isDownloading;

                            return (
                                <div key={link.id} className="bg-card-dark rounded-lg overflow-hidden border border-white/5 flex flex-col group hover:border-primary/30 transition-all hover:translate-y-[-4px]">
                                    <div className="relative aspect-[9/16] overflow-hidden bg-slate-800">
                                        {link.thumbnail_url && !isProcessing ? (
                                            <img
                                                className="w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
                                                alt="Thumbnail"
                                                src={link.thumbnail_url}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-900 border border-white/5">
                                                {isPending && (
                                                    <div className="flex flex-col items-center gap-3 animate-pulse">
                                                        <span className="material-symbols-outlined text-4xl text-primary/70">hourglass_empty</span>
                                                    </div>
                                                )}
                                                {isDownloading && (
                                                    <div className="flex flex-col items-center gap-3 animate-pulse">
                                                        <span className="material-symbols-outlined text-4xl text-teal-400">robot_2</span>
                                                    </div>
                                                )}
                                                {!isProcessing && (
                                                    <span className="material-symbols-outlined text-4xl text-slate-700">video_library</span>
                                                )}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>

                                        {/* Source Badge */}
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className={`backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full border uppercase tracking-tighter ${badgeColor}`}>
                                                {platform}
                                            </span>
                                            {isPending && (
                                                <span className={`backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full border border-primary/40 bg-primary/20 text-primary uppercase tracking-tighter animate-pulse`}>
                                                    Extraindo Cópia...
                                                </span>
                                            )}
                                            {isDownloading && (
                                                <span className={`backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full border border-teal-400/40 bg-teal-400/20 text-teal-400 uppercase tracking-tighter animate-pulse`}>
                                                    IA Assistindo...
                                                </span>
                                            )}
                                        </div>

                                        {!isProcessing && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/cofre/${link.id}`} className="size-14 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:scale-110 transition-transform">
                                                    <span className="material-symbols-outlined text-3xl">play_arrow</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-sora font-semibold text-sm line-clamp-2 mb-3 leading-relaxed" title={link.url}>
                                            {link.title && link.title !== 'Nova Referência' ? link.title : `Análise: ${platform}`}
                                        </h3>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="font-mono text-[10px] text-slate-500 uppercase">
                                                {format(new Date(link.created_at), "dd MMM yyyy", { locale: ptBR })}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDelete(link.id)}
                                                    title="Remover Link"
                                                    className="size-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-400/30 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                                {!isProcessing ? (
                                                    <Link href={`/cofre/${link.id}`} className="bg-primary px-4 py-2 rounded-full text-[11px] font-bold text-white shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:scale-105 transition-transform">
                                                        Abrir Análise
                                                    </Link>
                                                ) : (
                                                    <div className="bg-slate-800 border border-white/10 px-4 py-2 rounded-full text-[11px] font-bold text-slate-400 cursor-not-allowed flex items-center gap-2">
                                                        <span className="size-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></span>
                                                        Aguarde
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </main>
        </div>
    );
}
