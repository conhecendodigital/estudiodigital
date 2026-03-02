'use client';

import React, { useState, useCallback, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

/* ── Types ── */
interface GatewayState {
    enabled: boolean;
    fields: Record<string, { value: string; visible: boolean }>;
    testing: boolean;
    testResult: 'success' | 'error' | null;
    saving: boolean;
    saved: boolean;
}

interface GatewayConfig {
    id: string;
    name: string;
    description: string;
    icon: string;
    accentColor: string;
    accentBg: string;
    accentGlow: string;
    fields: { key: string; label: string; placeholder: string; readOnly?: boolean }[];
    webhookUrl: string;
}

/* ── Masked Input Component ── */
function MaskedInput({
    label,
    value,
    visible,
    placeholder,
    readOnly,
    onChange,
    onToggleVisibility,
}: {
    label: string;
    value: string;
    visible: boolean;
    placeholder: string;
    readOnly?: boolean;
    onChange: (v: string) => void;
    onToggleVisibility: () => void;
}) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleToggleClick = () => {
        if (!visible && value.trim().length > 0) {
            setShowConfirm(true);
        } else {
            onToggleVisibility();
        }
    };

    const confirmVisibility = () => {
        setShowConfirm(false);
        onToggleVisibility();
    };

    return (
        <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">{label}</label>
            <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="material-symbols-outlined text-slate-600 text-lg">key</span>
                </div>
                <input
                    type={visible ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    className={`w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-sm font-mono text-slate-200 placeholder-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 ${readOnly ? 'cursor-default opacity-70' : ''}`}
                />
                <button
                    onClick={handleToggleClick}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all"
                    title={visible ? 'Ocultar' : 'Mostrar'}
                >
                    <span className="material-symbols-outlined text-lg">{visible ? 'visibility_off' : 'visibility'}</span>
                </button>

                {/* Confirmation Overlay */}
                {showConfirm && (
                    <div className="absolute inset-0 bg-background-dark/95 backdrop-blur-sm border border-rose-500/30 rounded-xl flex items-center justify-between px-4 z-10 animate-fade-in shadow-lg">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-rose-400 text-lg">warning</span>
                            <span className="text-xs font-semibold text-slate-200">Deseja mesmo reexibir essa credencial?</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setShowConfirm(false)} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-colors">Cancelar</button>
                            <button onClick={confirmVisibility} className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 hover:text-rose-300 px-3 py-1.5 rounded-md transition-colors border border-rose-500/20">Mostrar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Webhook URL Component ── */
function WebhookUrlField({ url }: { url: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                Webhook URL
                <span className="text-slate-600 normal-case tracking-normal font-normal ml-1">(configure no painel do provedor)</span>
            </label>
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <span className="material-symbols-outlined text-slate-600 text-lg">link</span>
                    </div>
                    <input
                        type="text"
                        value={url}
                        readOnly
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm font-mono text-slate-400 cursor-default outline-none"
                    />
                </div>
                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border flex-shrink-0 ${copied
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-primary/10 hover:border-primary/30 hover:text-primary'
                        }`}
                >
                    <span className="material-symbols-outlined text-lg">{copied ? 'check' : 'content_copy'}</span>
                    {copied ? 'Copiado!' : 'Copiar'}
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   PAYMENT GATEWAYS PAGE
   ═══════════════════════════════════════════ */
export default function PagamentosPage() {
    const [gatewaysConfig, setGatewaysConfig] = useState<GatewayConfig[]>([]);
    const [states, setStates] = useState<Record<string, GatewayState>>({});

    useEffect(() => {
        fetch('/api/admin/pagamentos')
            .then((r) => r.json())
            .then((data) => {
                if (data.gateways) {
                    const gwData = data.gateways as any[];
                    setGatewaysConfig(gwData);

                    // Build initial states mapping
                    const nextStates: Record<string, GatewayState> = {};
                    gwData.forEach((gw) => {
                        const id = gw.id;
                        const isEnabled = gw.is_enabled;
                        const credentials = gw.credentials || {};

                        // Map fields from dictionary setting their initial value if any
                        const mappedFields = Object.fromEntries(
                            (gw.fields || []).map((f: any) => [
                                f.key,
                                { value: credentials[f.key] || '', visible: false }
                            ])
                        );

                        nextStates[id] = {
                            enabled: isEnabled,
                            fields: mappedFields,
                            testing: false,
                            testResult: null,
                            saving: false,
                            saved: false,
                        };
                    });

                    setStates(nextStates);
                }
            })
            .catch(() => { });
    }, []);

    const toggleEnabled = useCallback((id: string) => {
        setStates((prev) => {
            const currentState = prev[id];
            const newState = !currentState.enabled;

            // Auto-save the toggle state to the backend
            fetch('/api/admin/pagamentos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider: id, is_active: newState }),
            }).catch(() => console.error("Falha ao salvar o novo estado do toggle."));

            return { ...prev, [id]: { ...currentState, enabled: newState } };
        });
    }, []);

    const setFieldValue = useCallback((gatewayId: string, fieldKey: string, value: string) => {
        setStates((prev) => ({
            ...prev,
            [gatewayId]: {
                ...prev[gatewayId],
                fields: { ...prev[gatewayId].fields, [fieldKey]: { ...prev[gatewayId].fields[fieldKey], value } },
            },
        }));
    }, []);

    const toggleFieldVisibility = useCallback((gatewayId: string, fieldKey: string) => {
        setStates((prev) => ({
            ...prev,
            [gatewayId]: {
                ...prev[gatewayId],
                fields: {
                    ...prev[gatewayId].fields,
                    [fieldKey]: { ...prev[gatewayId].fields[fieldKey], visible: !prev[gatewayId].fields[fieldKey].visible },
                },
            },
        }));
    }, []);

    const testWebhook = useCallback((id: string) => {
        setStates((prev) => ({ ...prev, [id]: { ...prev[id], testing: true, testResult: null } }));
        fetch('/api/admin/pagamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: id }),
        })
            .then((r) => r.json())
            .then((data) => {
                const result = data.success ? 'success' : 'error';
                setStates((prev) => ({ ...prev, [id]: { ...prev[id], testing: false, testResult: result as 'success' | 'error' } }));
                setTimeout(() => setStates((prev) => ({ ...prev, [id]: { ...prev[id], testResult: null } })), 4000);
            })
            .catch(() => {
                setStates((prev) => ({ ...prev, [id]: { ...prev[id], testing: false, testResult: 'error' } }));
                setTimeout(() => setStates((prev) => ({ ...prev, [id]: { ...prev[id], testResult: null } })), 4000);
            });
    }, []);

    const saveCredentials = useCallback((id: string) => {
        setStates((prev) => ({ ...prev, [id]: { ...prev[id], saving: true, saved: false } }));
        const s = states[id];
        const credentials: Record<string, string> = {};
        Object.entries(s.fields).forEach(([key, f]) => { credentials[key] = f.value; });
        fetch('/api/admin/pagamentos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: id, is_active: s.enabled, credentials }),
        })
            .then((r) => r.json())
            .then(() => {
                setStates((prev) => ({ ...prev, [id]: { ...prev[id], saving: false, saved: true } }));
                setTimeout(() => setStates((prev) => ({ ...prev, [id]: { ...prev[id], saved: false } })), 3000);
            })
            .catch(() => {
                setStates((prev) => ({ ...prev, [id]: { ...prev[id], saving: false } }));
            });
    }, [states]);

    return (
        <div className="flex min-h-screen bg-background-dark font-display text-slate-100">
            <AdminSidebar />

            <main className="flex-1 ml-72 p-10 overflow-y-auto w-full relative">

                {/* ─── HEADER ─── */}
                <header className="mb-8 z-10 relative">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-primary/15 p-3 rounded-xl border border-primary/20 shadow-[0_0_20px_rgba(123,97,255,0.15)]">
                            <span className="material-symbols-outlined text-primary text-2xl">payments</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-sora text-white tracking-tight">Configurações de Pagamento</h1>
                            <p className="text-slate-400 mt-0.5 text-sm">Configure como você recebe pelas assinaturas da plataforma.</p>
                        </div>
                    </div>
                </header>

                {/* ─── WARNING CALLOUT ─── */}
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-5 mb-8 flex items-start gap-4">
                    <div className="bg-amber-500/15 p-2 rounded-lg flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-amber-400 text-xl">warning</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-amber-300">Atenção: Impacto em cobranças ativas</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            A troca de credenciais pode pausar cobranças recorrentes ativas. Certifique-se de que as novas chaves estão corretas antes de salvar.
                            Recomendamos fazer essa alteração fora do horário de pico.
                        </p>
                    </div>
                </div>

                {/* ─── GATEWAY PANELS ─── */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {gatewaysConfig.map((gateway) => {
                        const s = states[gateway.id];
                        if (!s) return null; // Wait until loaded

                        return (
                            <div
                                key={gateway.id}
                                className={`bg-white/5 backdrop-blur-md border rounded-2xl transition-all duration-500 flex flex-col ${s.enabled
                                    ? 'border-white/10 hover:shadow-[0_0_25px_rgba(123,97,255,0.1)]'
                                    : 'border-white/5 opacity-60 hover:opacity-80'
                                    }`}
                            >
                                {/* Panel Header */}
                                <div className="p-8 pb-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`${gateway.accentBg} p-3 rounded-xl transition-all duration-300 ${s.enabled ? gateway.accentGlow : ''}`}>
                                                <span className={`material-symbols-outlined ${gateway.accentColor} text-2xl`}>{gateway.icon}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-bold font-sora text-white">{gateway.name}</h3>
                                                    {s.enabled && (
                                                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                            Ativo
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1 max-w-sm">{gateway.description}</p>
                                            </div>
                                        </div>

                                        {/* Toggle */}
                                        <button
                                            onClick={() => toggleEnabled(gateway.id)}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${s.enabled
                                                ? 'bg-primary shadow-[0_0_15px_rgba(123,97,255,0.4)]'
                                                : 'bg-white/10'
                                                }`}
                                        >
                                            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${s.enabled ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'}`}></div>
                                        </button>
                                    </div>
                                </div>

                                {/* Panel Body (visible only when enabled) */}
                                {s.enabled && (
                                    <div className="p-8 pt-6 flex-1 flex flex-col">
                                        <div className="space-y-4 flex-1">
                                            {/* API Key Fields */}
                                            {gateway.fields.map((field) => (
                                                <MaskedInput
                                                    key={field.key}
                                                    label={field.label}
                                                    value={s.fields[field.key].value}
                                                    visible={s.fields[field.key].visible}
                                                    placeholder={field.placeholder}
                                                    readOnly={field.readOnly}
                                                    onChange={(v) => setFieldValue(gateway.id, field.key, v)}
                                                    onToggleVisibility={() => toggleFieldVisibility(gateway.id, field.key)}
                                                />
                                            ))}

                                            {/* Webhook URL */}
                                            <div className="pt-2">
                                                <WebhookUrlField url={gateway.webhookUrl} />
                                            </div>
                                        </div>

                                        {/* Panel Footer: Test + Save */}
                                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => testWebhook(gateway.id)}
                                                    disabled={s.testing}
                                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${s.testing
                                                        ? 'bg-white/5 border-white/10 text-slate-400 cursor-wait'
                                                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                >
                                                    {s.testing ? (
                                                        <>
                                                            <svg className="animate-spin size-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                            Testando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="material-symbols-outlined text-[18px]">send</span>
                                                            Testar Webhook
                                                        </>
                                                    )}
                                                </button>

                                                {/* Test Result Badge */}
                                                {s.testResult === 'success' && (
                                                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-bold">
                                                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                        Webhook OK
                                                    </span>
                                                )}
                                                {s.testResult === 'error' && (
                                                    <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-full text-xs font-bold">
                                                        <span className="material-symbols-outlined text-[14px]">error</span>
                                                        Falhou
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {s.saved && (
                                                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
                                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                                        Salvo!
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => saveCredentials(gateway.id)}
                                                    disabled={s.saving}
                                                    className={`btn-magnetic flex items-center gap-2 px-6 py-2.5 rounded-xl font-sora font-semibold text-sm transition-all duration-300 border border-white/10 ${s.saving
                                                        ? 'bg-primary/50 text-white/60 cursor-wait'
                                                        : 'bg-primary hover:bg-primary-dark text-white shadow-[0_0_15px_rgba(123,97,255,0.3)] hover:shadow-[0_0_25px_rgba(123,97,255,0.5)]'
                                                        }`}
                                                >
                                                    {s.saving ? (
                                                        <>
                                                            <svg className="animate-spin size-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                            Salvando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="material-symbols-outlined text-[18px]">save</span>
                                                            Salvar Credenciais
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Disabled state message */}
                                {!s.enabled && (
                                    <div className="p-8 pt-4">
                                        <p className="text-xs text-slate-600 italic">Ative este gateway para configurar as credenciais.</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ─── BOTTOM INFO ─── */}
                <div className="mt-8 bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-xl">help</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-300 mb-1">Precisa de ajuda?</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Configure o <strong className="text-slate-400">Webhook URL</strong> no painel do provedor de pagamento para receber notificações automáticas de cobranças,
                            cancelamentos e renovações. Cada gateway possui um endpoint exclusivo.
                        </p>
                    </div>
                </div>

            </main>
        </div>
    );
}
