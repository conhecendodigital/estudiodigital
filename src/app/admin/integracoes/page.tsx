'use client';

import React, { useState, useCallback } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

/* ── Provider Config ── */
interface Provider {
    id: string;
    name: string;
    model: string;
    icon: string;
    description: string;
    accentColor: string;
    accentBg: string;
    accentGlow: string;
}

const providers: Provider[] = [
    {
        id: 'openai',
        name: 'OpenAI',
        model: 'GPT-4 Turbo',
        icon: 'psychology',
        description: 'Modelos de linguagem avançados para geração de texto, análise e assistentes.',
        accentColor: 'text-emerald-400',
        accentBg: 'bg-emerald-500/15',
        accentGlow: 'shadow-[0_0_20px_rgba(52,211,153,0.15)]',
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        model: 'Claude 3.5 Sonnet',
        icon: 'smart_toy',
        description: 'IA conversacional focada em segurança, raciocínio e análise de documentos.',
        accentColor: 'text-amber-400',
        accentBg: 'bg-amber-500/15',
        accentGlow: 'shadow-[0_0_20px_rgba(251,191,36,0.15)]',
    },
    {
        id: 'google',
        name: 'Google',
        model: 'Gemini 2.0 Pro',
        icon: 'auto_awesome',
        description: 'Modelo multimodal do Google para texto, imagem, áudio e código.',
        accentColor: 'text-blue-400',
        accentBg: 'bg-blue-500/15',
        accentGlow: 'shadow-[0_0_20px_rgba(96,165,250,0.15)]',
    },
    {
        id: 'image',
        name: 'Geração de Imagem',
        model: 'DALL·E 3 / Midjourney',
        icon: 'palette',
        description: 'Geração de imagens a partir de prompts de texto para criativos e anúncios.',
        accentColor: 'text-fuchsia-400',
        accentBg: 'bg-fuchsia-500/15',
        accentGlow: 'shadow-[0_0_20px_rgba(192,132,252,0.15)]',
    },
];

/* ── Main Page ── */
export default function IntegracoesPage() {
    const [states, setStates] = useState<Record<string, {
        enabled: boolean;
        apiKey: string;
        visible: boolean;
        testing: boolean;
        connected: boolean | null;
    }>>(
        Object.fromEntries(
            providers.map((p) => [
                p.id,
                { enabled: p.id === 'openai' || p.id === 'google', apiKey: '', visible: false, testing: false, connected: null },
            ])
        )
    );

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggle = useCallback((id: string, field: 'enabled' | 'visible') => {
        setStates((prev) => ({ ...prev, [id]: { ...prev[id], [field]: !prev[id][field] } }));
    }, []);

    const setKey = useCallback((id: string, value: string) => {
        setStates((prev) => ({ ...prev, [id]: { ...prev[id], apiKey: value, connected: null } }));
    }, []);

    const testConnection = useCallback((id: string) => {
        setStates((prev) => ({ ...prev, [id]: { ...prev[id], testing: true, connected: null } }));
        setTimeout(() => {
            setStates((prev) => ({ ...prev, [id]: { ...prev[id], testing: false, connected: true } }));
        }, 1800);
    }, []);

    const handleSave = () => {
        setSaving(true);
        setSaved(false);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen bg-background-dark font-display text-slate-100">
            <AdminSidebar />

            <main className="flex-1 ml-72 p-10 overflow-y-auto w-full relative pb-32">

                {/* ─── HEADER ─── */}
                <header className="mb-10 z-10 relative">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-primary/15 p-3 rounded-xl border border-primary/20">
                            <span className="material-symbols-outlined text-primary text-2xl">hub</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold font-sora text-white tracking-tight">Chaves de API</h1>
                            <p className="text-slate-400 mt-1 text-sm">Gerencie a conexão com os provedores de IA da plataforma.</p>
                        </div>
                    </div>
                </header>

                {/* ─── SECURITY NOTICE ─── */}
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-5 mb-8 flex items-start gap-4">
                    <div className="bg-amber-500/15 p-2 rounded-lg flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-amber-400 text-xl">shield_lock</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-amber-300">Segurança das Chaves</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Suas chaves de API são criptografadas e armazenadas de forma segura. Nunca compartilhe suas chaves.
                            Recomendamos rotacionar as chaves periodicamente.
                        </p>
                    </div>
                </div>

                {/* ─── PROVIDER CARDS ─── */}
                <div className="space-y-5">
                    {providers.map((provider) => {
                        const s = states[provider.id];
                        return (
                            <div
                                key={provider.id}
                                className={`bg-white/5 backdrop-blur-md border rounded-2xl p-8 transition-all duration-500 group ${s.enabled
                                        ? 'border-white/10 hover:shadow-[0_0_20px_rgba(123,97,255,0.12)] hover:border-primary/30'
                                        : 'border-white/5 opacity-60 hover:opacity-80'
                                    }`}
                            >
                                {/* Top Row: Icon + Name + Toggle */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`${provider.accentBg} p-3 rounded-xl transition-all duration-300 ${s.enabled ? provider.accentGlow : ''}`}>
                                            <span className={`material-symbols-outlined ${provider.accentColor} text-2xl`}>{provider.icon}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-bold font-sora text-white">{provider.name}</h3>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                                                    {provider.model}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">{provider.description}</p>
                                        </div>
                                    </div>

                                    {/* Toggle Switch */}
                                    <button
                                        onClick={() => toggle(provider.id, 'enabled')}
                                        className={`relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${s.enabled
                                                ? 'bg-primary shadow-[0_0_15px_rgba(123,97,255,0.4)]'
                                                : 'bg-white/10'
                                            }`}
                                    >
                                        <div
                                            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${s.enabled ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'
                                                }`}
                                        ></div>
                                    </button>
                                </div>

                                {/* API Key Input + Actions (only when enabled) */}
                                {s.enabled && (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                                        {/* API Key Input */}
                                        <div className="flex-1 w-full relative">
                                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                                API Key
                                            </label>
                                            <div className="relative group/input">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <span className="material-symbols-outlined text-slate-500 text-lg">key</span>
                                                </div>
                                                <input
                                                    type={s.visible ? 'text' : 'password'}
                                                    value={s.apiKey}
                                                    onChange={(e) => setKey(provider.id, e.target.value)}
                                                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-primary/40 focus:shadow-[0_0_20px_rgba(123,97,255,0.1)] transition-all duration-300"
                                                />
                                                <button
                                                    onClick={() => toggle(provider.id, 'visible')}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-lg">
                                                        {s.visible ? 'visibility_off' : 'visibility'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Test Connection Button */}
                                        <div className="flex flex-col items-start sm:items-end gap-2 sm:pt-6 flex-shrink-0">
                                            <button
                                                onClick={() => testConnection(provider.id)}
                                                disabled={s.testing || !s.apiKey}
                                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${s.testing
                                                        ? 'bg-white/5 border-white/10 text-slate-400 cursor-wait'
                                                        : !s.apiKey
                                                            ? 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed'
                                                            : 'bg-white/5 border-white/10 text-white hover:bg-primary/10 hover:border-primary/30 hover:text-primary hover:shadow-[0_0_15px_rgba(123,97,255,0.15)]'
                                                    }`}
                                            >
                                                {s.testing ? (
                                                    <>
                                                        <svg className="animate-spin size-4" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                        </svg>
                                                        Testando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined text-[18px]">cable</span>
                                                        Testar Conexão
                                                    </>
                                                )}
                                            </button>

                                            {/* Connection Status Badge */}
                                            {s.connected === true && (
                                                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-bold animate-in">
                                                    <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                    Conectado
                                                </span>
                                            )}
                                            {s.connected === false && (
                                                <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-full text-xs font-bold">
                                                    <span className="size-1.5 bg-rose-500 rounded-full"></span>
                                                    Erro na conexão
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ─── FLOATING SAVE BUTTON ─── */}
                <div className="fixed bottom-0 left-72 right-0 z-30">
                    <div className="bg-background-dark/80 backdrop-blur-xl border-t border-white/5 px-10 py-5">
                        <div className="flex items-center justify-between max-w-full">
                            <p className="text-xs text-slate-500">
                                <span className="material-symbols-outlined text-[14px] align-middle mr-1">info</span>
                                As alterações só entram em vigor após salvar.
                            </p>
                            <div className="flex items-center gap-4">
                                {saved && (
                                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-semibold animate-in">
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                        Salvo com sucesso!
                                    </span>
                                )}
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className={`btn-magnetic flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-sora font-semibold text-sm transition-all duration-300 border border-white/10 ${saving
                                            ? 'bg-primary/50 text-white/60 cursor-wait'
                                            : 'bg-primary hover:bg-primary-dark text-white shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:shadow-[0_0_35px_rgba(123,97,255,0.5)]'
                                        }`}
                                >
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin size-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[20px]">save</span>
                                            Salvar Configurações
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
