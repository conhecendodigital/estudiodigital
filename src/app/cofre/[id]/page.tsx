'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function CofreDetalhePage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const { profile } = useAuth();

    const [reference, setReference] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (profile?.id && params?.id) {
            fetchReference();
        }
    }, [profile?.id, params?.id]);

    const fetchReference = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('vault_references')
                .select('*')
                .eq('id', params.id)
                .eq('user_id', profile?.id)
                .single();

            if (data && !error) {
                setReference(data);
            } else {
                router.push('/cofre');
            }
        } catch (err) {
            console.error("Error fetching reference", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-background-dark min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!reference) return null;

    const analise = reference.analise_ia || {};

    return (
        <div className="bg-background-dark text-slate-100 font-display min-h-screen flex overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-y-auto relative md:ml-[280px]">
                {/* Decorative Accents */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none z-0"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 relative z-10">

                    {/* Header Back Button */}
                    <div className="mb-8">
                        <Link href="/cofre" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-xl">arrow_back</span>
                            <span className="font-semibold text-sm tracking-wide uppercase">Voltar para o Cofre</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                        {/* Video Player Column */}
                        <div className="lg:col-span-4 flex justify-center">
                            <div className="relative w-full max-w-[340px] aspect-[9/16] bg-black rounded-[2.5rem] p-2 border-4 border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl z-20"></div> {/* Notch */}

                                {/* Se é referência do Instagram (sem vídeo local), mostra thumbnail */}
                                {reference.analise_ia?.tipo === 'referencia_visual' ? (
                                    <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                                        {reference.thumbnail_url ? (
                                            <img
                                                className="w-full h-full object-cover"
                                                src={reference.thumbnail_url}
                                                alt={reference.title}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-purple-900/20 to-slate-900">
                                                <span className="material-symbols-outlined text-6xl text-slate-600">photo_camera</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    </div>
                                ) : (
                                    <video
                                        className="w-full h-full object-cover rounded-[2rem]"
                                        src={reference.file_url}
                                        poster={reference.thumbnail_url}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        controls
                                    />
                                )}

                                <div className="absolute bottom-6 left-6 right-6 z-10">
                                    <a href={reference.url} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full py-2 px-4 text-xs font-bold w-full flex items-center justify-center gap-2 transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                        Abrir Original
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Column */}
                        <div className="lg:col-span-8 flex flex-col space-y-6">

                            <header className="mb-4">
                                <h1 className="font-sora text-3xl font-bold tracking-tight mb-2 text-white">
                                    {reference.analise_ia?.tipo === 'referencia_visual' ? 'Referência Visual' : 'Raio-X Viral'}
                                </h1>
                                <p className="text-primary font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                                    {reference.analise_ia?.tipo === 'referencia_visual'
                                        ? 'Salvo como referência — análise IA indisponível'
                                        : 'Analisado por Gemini 2.0 Flash'}
                                </p>
                            </header>

                            {/* Cards de Análise */}

                            {/* Gancho */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center border border-yellow-500/30">
                                        <span className="material-symbols-outlined">phishing</span>
                                    </div>
                                    <h2 className="font-sora font-bold text-lg text-white">O Gancho</h2>
                                </div>
                                <p className="text-slate-300 leading-relaxed font-medium">
                                    {analise.gancho || "Gancho não identificado."}
                                </p>
                            </div>

                            {/* Estrutura & Emoção */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="size-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                                            <span className="material-symbols-outlined">account_tree</span>
                                        </div>
                                        <h2 className="font-sora font-bold text-lg text-white">Estrutura</h2>
                                    </div>
                                    <p className="text-slate-300 font-medium">
                                        {analise.estrutura || "Indefinida"}
                                    </p>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="size-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                                            <span className="material-symbols-outlined">favorite</span>
                                        </div>
                                        <h2 className="font-sora font-bold text-lg text-white">Emoção Principal</h2>
                                    </div>
                                    <p className="text-slate-300 font-medium capitalize">
                                        {analise.emocao || "Indefinida"}
                                    </p>
                                </div>
                            </div>

                            {/* Por que funcionou */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                                        <span className="material-symbols-outlined">psychology</span>
                                    </div>
                                    <h2 className="font-sora font-bold text-lg text-white">Por que funcionou?</h2>
                                </div>
                                <p className="text-slate-300 leading-relaxed">
                                    {analise.por_que_funcionou || "Nenhuma análise detalhada encontrada."}
                                </p>
                            </div>

                            {/* Sugestões de Viralização */}
                            <div className="bg-gradient-to-br from-primary/10 to-purple-600/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="size-10 rounded-xl bg-primary/30 text-primary-light flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(123,97,255,0.4)]">
                                        <span className="material-symbols-outlined">rocket_launch</span>
                                    </div>
                                    <h2 className="font-sora font-bold text-lg text-white">Sugestões de Viralização</h2>
                                </div>
                                <p className="text-slate-100 leading-relaxed font-medium relative z-10">
                                    {analise.sugestoes || "Sem sugestões adiconais."}
                                </p>
                            </div>

                            {/* Roteiro Completo */}
                            <div className="bg-black/20 border border-white/5 rounded-2xl p-6 relative overflow-hidden mt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700">
                                            <span className="material-symbols-outlined text-sm">notes</span>
                                        </div>
                                        <h2 className="font-sora font-bold text-sm text-slate-300 uppercase tracking-widest">Roteiro Completo (Transcrição)</h2>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl text-slate-400 text-sm leading-relaxed whitespace-pre-wrap font-serif italic border border-white/5">
                                    "{analise.roteiro || "Roteiro não extraído."}"
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
