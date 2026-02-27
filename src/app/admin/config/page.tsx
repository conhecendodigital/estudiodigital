'use client';

import React, { useState, useRef } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

/* ── Tab Definitions ── */
interface SettingsTab {
    id: string;
    label: string;
    icon: string;
    description: string;
}

const settingsTabs: SettingsTab[] = [
    { id: 'geral', label: 'Geral', icon: 'tune', description: 'Configurações básicas da plataforma' },
    { id: 'pagamentos', label: 'Gateways de Pagamento', icon: 'account_balance_wallet', description: 'Mercado Pago, Stripe' },
    { id: 'ia', label: 'Integrações de IA', icon: 'smart_toy', description: 'OpenAI, Claude' },
    { id: 'notificacoes', label: 'Notificações', icon: 'notifications', description: 'E-mail, Push, Webhooks' },
];

/* ── Select Input Component ── */
function SelectField({
    label,
    icon,
    value,
    options,
    onChange,
}: {
    label: string;
    icon: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
}) {
    return (
        <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="material-symbols-outlined text-slate-600 text-lg">{icon}</span>
                </div>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-10 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 appearance-none cursor-pointer"
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#1a1a2e] text-slate-200">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="material-symbols-outlined text-slate-500 text-lg">expand_more</span>
                </div>
            </div>
        </div>
    );
}

/* ── Text Input Component ── */
function TextField({
    label,
    icon,
    value,
    placeholder,
    onChange,
    type = 'text',
}: {
    label: string;
    icon: string;
    value: string;
    placeholder: string;
    onChange: (v: string) => void;
    type?: string;
}) {
    return (
        <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="material-symbols-outlined text-slate-600 text-lg">{icon}</span>
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300"
                />
            </div>
        </div>
    );
}

/* ── Geral Tab Content ── */
function GeralContent() {
    const [platformName, setPlatformName] = useState('Escritório Digital');
    const [supportEmail, setSupportEmail] = useState('suporte@estudiodigital.com');
    const [timezone, setTimezone] = useState('america-sp');
    const [language, setLanguage] = useState('pt-br');
    const [logoName, setLogoName] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1500);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setLogoName(e.target.files[0].name);
        }
    };

    return (
        <div className="space-y-6">
            {/* ── Platform Info Card ── */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-primary text-xl">domain</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-sora text-white">Informações da Plataforma</h3>
                        <p className="text-xs text-slate-500">Dados gerais exibidos aos usuários</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextField
                        label="Nome da Plataforma"
                        icon="badge"
                        value={platformName}
                        placeholder="Ex: Minha Plataforma"
                        onChange={setPlatformName}
                    />
                    <TextField
                        label="E-mail de Suporte"
                        icon="mail"
                        value={supportEmail}
                        placeholder="suporte@email.com"
                        onChange={setSupportEmail}
                        type="email"
                    />
                </div>

                {/* Logo Upload */}
                <div className="mt-5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Logo do Painel</label>
                    <div className="flex items-center gap-4">
                        {/* Preview placeholder */}
                        <div className="size-16 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {logoName ? (
                                <span className="material-symbols-outlined text-emerald-400 text-2xl">image</span>
                            ) : (
                                <span className="material-symbols-outlined text-slate-600 text-2xl">photo_camera</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                            >
                                <span className="material-symbols-outlined text-lg">upload</span>
                                {logoName ? 'Trocar Imagem' : 'Escolher Imagem'}
                            </button>
                            {logoName ? (
                                <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                    {logoName}
                                </p>
                            ) : (
                                <p className="text-[11px] text-slate-600 mt-1.5">PNG, JPG ou SVG. Máx. 2MB.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Regional Card ── */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-blue-400 text-xl">language</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-sora text-white">Configurações Regionais</h3>
                        <p className="text-xs text-slate-500">Fuso horário e idioma padrão</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <SelectField
                        label="Fuso Horário"
                        icon="schedule"
                        value={timezone}
                        onChange={setTimezone}
                        options={[
                            { value: 'america-sp', label: 'América/São Paulo (GMT-3)' },
                            { value: 'america-mg', label: 'América/Manaus (GMT-4)' },
                            { value: 'america-fn', label: 'América/Noronha (GMT-2)' },
                            { value: 'america-ba', label: 'América/Bahia (GMT-3)' },
                            { value: 'utc', label: 'UTC (GMT+0)' },
                        ]}
                    />
                    <SelectField
                        label="Idioma Padrão"
                        icon="translate"
                        value={language}
                        onChange={setLanguage}
                        options={[
                            { value: 'pt-br', label: 'Português (Brasil)' },
                            { value: 'en-us', label: 'English (US)' },
                            { value: 'es', label: 'Español' },
                        ]}
                    />
                </div>
            </div>

            {/* ── Save Button ── */}
            <div className="flex items-center justify-end gap-4 pt-2">
                {saved && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-semibold animate-in fade-in duration-300">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Alterações salvas com sucesso!
                    </span>
                )}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`btn-magnetic flex items-center gap-2 px-8 py-3 rounded-xl font-sora font-semibold text-sm transition-all duration-300 border border-white/10 ${saving
                            ? 'bg-primary/50 text-white/60 cursor-wait'
                            : 'bg-primary hover:bg-primary-dark text-white shadow-[0_0_15px_rgba(123,97,255,0.3)] hover:shadow-[0_0_25px_rgba(123,97,255,0.5)]'
                        }`}
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin size-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            Salvando...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            Salvar Alterações
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

/* ── Pagamentos Tab Content ── */
function PagamentosContent() {
    const gateways = [
        { name: 'Mercado Pago', icon: 'account_balance_wallet', color: 'text-sky-400', bg: 'bg-sky-500/15', desc: 'Receba por Pix, boleto e cartão de crédito.', status: true },
        { name: 'Stripe', icon: 'credit_card', color: 'text-violet-400', bg: 'bg-violet-500/15', desc: 'Pagamentos globais com Apple Pay e Google Pay.', status: false },
    ];
    return (
        <div className="space-y-4">
            {gateways.map((gw) => (
                <div key={gw.name} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center justify-between hover:border-primary/20 transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className={`${gw.bg} p-3 rounded-xl`}>
                            <span className={`material-symbols-outlined ${gw.color} text-2xl`}>{gw.icon}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold font-sora text-white">{gw.name}</h4>
                                {gw.status && (
                                    <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        Conectado
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{gw.desc}</p>
                        </div>
                    </div>
                    <button className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${gw.status
                            ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                            : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
                        }`}>
                        {gw.status ? 'Configurar' : 'Conectar'}
                    </button>
                </div>
            ))}
        </div>
    );
}

/* ── AI Integrations Tab Content ── */
function IAContent() {
    const integrations = [
        { name: 'OpenAI', icon: 'psychology', color: 'text-emerald-400', bg: 'bg-emerald-500/15', desc: 'GPT-4o, GPT-4o mini — Geração de texto e análise.', status: true, model: 'gpt-4o' },
        { name: 'Anthropic (Claude)', icon: 'smart_toy', color: 'text-amber-400', bg: 'bg-amber-500/15', desc: 'Claude 3.5 Sonnet — Raciocínio avançado e análise.', status: true, model: 'claude-sonnet-4-5' },
    ];
    return (
        <div className="space-y-4">
            {integrations.map((ai) => (
                <div key={ai.name} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-primary/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`${ai.bg} p-3 rounded-xl`}>
                                <span className={`material-symbols-outlined ${ai.color} text-2xl`}>{ai.icon}</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold font-sora text-white">{ai.name}</h4>
                                    {ai.status && (
                                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            Ativo
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">{ai.desc}</p>
                            </div>
                        </div>
                        <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300">
                            Configurar
                        </button>
                    </div>
                    {ai.status && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-6">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="material-symbols-outlined text-[14px]">memory</span>
                                Modelo: <span className="text-slate-300 font-mono font-semibold">{ai.model}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="material-symbols-outlined text-[14px]">speed</span>
                                Status: <span className="text-emerald-400 font-semibold">Operacional</span>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ── Notifications Tab Content ── */
function NotificacoesContent() {
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [pushEnabled, setPushEnabled] = useState(false);
    const [webhookEnabled, setWebhookEnabled] = useState(true);

    const toggles = [
        { label: 'Notificações por E-mail', desc: 'Novos assinantes, pagamentos e cancelamentos', icon: 'mail', enabled: emailEnabled, toggle: () => setEmailEnabled(!emailEnabled) },
        { label: 'Push Notifications', desc: 'Alertas em tempo real no navegador', icon: 'notifications_active', enabled: pushEnabled, toggle: () => setPushEnabled(!pushEnabled) },
        { label: 'Webhooks', desc: 'Enviar eventos para URLs externas em tempo real', icon: 'webhook', enabled: webhookEnabled, toggle: () => setWebhookEnabled(!webhookEnabled) },
    ];

    return (
        <div className="space-y-4">
            {toggles.map((item) => (
                <div key={item.label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center justify-between hover:border-primary/20 transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-xl">
                            <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
                        </div>
                        <div>
                            <h4 className="font-bold font-sora text-white">{item.label}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                    </div>
                    <button
                        onClick={item.toggle}
                        className={`relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${item.enabled
                                ? 'bg-primary shadow-[0_0_15px_rgba(123,97,255,0.4)]'
                                : 'bg-white/10'
                            }`}
                    >
                        <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${item.enabled ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'
                            }`} />
                    </button>
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════
   CONFIGURAÇÕES PAGE
   ═══════════════════════════════════════════ */
export default function ConfiguracoesPage() {
    const [activeTab, setActiveTab] = useState('geral');

    const renderContent = () => {
        switch (activeTab) {
            case 'geral': return <GeralContent />;
            case 'pagamentos': return <PagamentosContent />;
            case 'ia': return <IAContent />;
            case 'notificacoes': return <NotificacoesContent />;
            default: return <GeralContent />;
        }
    };

    const activeTabData = settingsTabs.find(t => t.id === activeTab);

    return (
        <div className="flex min-h-screen bg-background-dark font-display text-slate-100">
            <AdminSidebar />

            <main className="flex-1 ml-72 p-10 overflow-y-auto w-full relative">

                {/* ─── HEADER ─── */}
                <header className="mb-8 z-10 relative">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-white/10 p-3 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                            <span className="material-symbols-outlined text-slate-300 text-2xl">settings</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-sora text-white tracking-tight">Configurações</h1>
                            <p className="text-slate-400 mt-0.5 text-sm">Gerencie as preferências da plataforma, integrações e pagamentos.</p>
                        </div>
                    </div>
                </header>

                {/* ─── LAYOUT: SIDEBAR TABS + CONTENT ─── */}
                <div className="grid grid-cols-12 gap-6">

                    {/* ── Vertical Tabs Menu ── */}
                    <div className="col-span-3">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 sticky top-10">
                            <p className="px-4 pt-2 pb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Menu</p>
                            <nav className="space-y-1">
                                {settingsTabs.map((tab) => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${isActive
                                                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                                                    : 'text-slate-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                                                }`}
                                        >
                                            <span className={`material-symbols-outlined text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                                {tab.icon}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold truncate">{tab.label}</p>
                                                <p className={`text-[10px] truncate ${isActive ? 'text-primary/60' : 'text-slate-600'}`}>{tab.description}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* ── Content Area ── */}
                    <div className="col-span-9">
                        {/* Content Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <span className="material-symbols-outlined text-primary text-xl">
                                    {activeTabData?.icon}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold font-sora text-white">{activeTabData?.label}</h2>
                                <p className="text-xs text-slate-500">{activeTabData?.description}</p>
                            </div>
                        </div>

                        {/* Rendered Content */}
                        {renderContent()}
                    </div>

                </div>

            </main>
        </div>
    );
}
