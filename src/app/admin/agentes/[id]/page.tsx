'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

/* ── AI Provider & Model Definitions ── */
interface AIModelOption {
    id: string;
    name: string;
}

interface AIProvider {
    id: string;
    label: string;
    icon: string;
    color: string;
    bg: string;
    borderColor: string;
    models: AIModelOption[];
}

const aiProviders: AIProvider[] = [
    {
        id: 'openai', label: 'OpenAI', icon: 'psychology', color: 'text-emerald-400', bg: 'bg-emerald-500/15', borderColor: 'border-emerald-500/30',
        models: [
            { id: 'gpt-5', name: 'GPT-5' },
            { id: 'gpt-4.1', name: 'GPT-4.1' },
            { id: 'o3', name: 'o3' },
            { id: 'o1', name: 'o1' },
            { id: 'gpt-4o', name: 'GPT-4o' },
        ],
    },
    {
        id: 'anthropic', label: 'Anthropic', icon: 'smart_toy', color: 'text-amber-400', bg: 'bg-amber-500/15', borderColor: 'border-amber-500/30',
        models: [
            { id: 'claude-4.6-opus', name: 'Claude 4.6 Opus' },
            { id: 'claude-4.5-sonnet', name: 'Claude 4.5 Sonnet' },
            { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet' },
            { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
            { id: 'claude-3.5-haiku', name: 'Claude 3.5 Haiku' },
        ],
    },
    {
        id: 'google', label: 'Google', icon: 'auto_awesome', color: 'text-blue-400', bg: 'bg-blue-500/15', borderColor: 'border-blue-500/30',
        models: [
            { id: 'gemini-3.0-pro-preview', name: 'Gemini 3.0 Pro Preview' },
            { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
            { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
            { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
            { id: 'gemini-2.0-flash-thinking', name: 'Gemini 2.0 Flash Thinking' },
        ],
    },
    {
        id: 'openrouter', label: 'OpenRouter (Open Source)', icon: 'route', color: 'text-rose-400', bg: 'bg-rose-500/15', borderColor: 'border-rose-500/30',
        models: [
            { id: 'deepseek-r1', name: 'DeepSeek R1' },
            { id: 'deepseek-v3', name: 'DeepSeek V3' },
            { id: 'llama-4-maverick', name: 'Meta Llama 4 Maverick' },
            { id: 'llama-3.3-70b', name: 'Meta Llama 3.3 70B' },
            { id: 'qwen-2.5-72b', name: 'Qwen 2.5 72B' },
            { id: 'mixtral-8x22b', name: 'Mixtral 8x22B' },
        ],
    },
];

/* ── Helper: find provider & model by model id ── */
function findModelInfo(modelId: string) {
    for (const provider of aiProviders) {
        const model = provider.models.find((m) => m.id === modelId);
        if (model) return { provider, model };
    }
    return null;
}

/* ── Category Options ── */
const categoryOptions = [
    { value: '', label: 'Selecionar categoria...' },
    { value: 'vendas', label: '💰 Vendas' },
    { value: 'conteudo', label: '✍️ Conteúdo' },
    { value: 'suporte', label: '🎧 Suporte ao Cliente' },
    { value: 'estrategico', label: '🚀 Estratégico' },
    { value: 'produtividade', label: '📊 Produtividade' },
];

/* ── Mock uploaded files ── */
interface UploadedFile {
    id: string;
    name: string;
    size: string;
    type: string;
    file?: File;
}

/* ── Chat Message Type ── */
interface ChatMessage {
    role: 'assistant' | 'user';
    content: string;
}

/* ═══════════════════════════════════════════
   EDITAR AGENTE PAGE
   ═══════════════════════════════════════════ */
export default function EditarAgentePage() {
    /* ── Pre-filled form state (mock existing agent) ── */
    const [agentName, setAgentName] = useState('Copywriter de Reels');
    const [description, setDescription] = useState('Especialista em criar roteiros virais e retenção.');
    const [category, setCategory] = useState('conteudo');
    const [selectedModel, setSelectedModel] = useState('claude-3.5-sonnet');
    const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
    const [systemPrompt, setSystemPrompt] = useState(
        'Você é um copywriter sênior focado em vídeos curtos para Instagram e TikTok. Sua meta é reter a atenção nos primeiros 3 segundos. Use ganchos de curiosidade, frases de impacto e CTAs diretos. Nunca use linguagem genérica. Sempre adapte o tom à marca do cliente. Responda em português (Brasil).'
    );
    const [files, setFiles] = useState<UploadedFile[]>([
        { id: '1', name: 'regras_de_copy.pdf', size: '1.8 MB', type: 'PDF' },
        { id: '2', name: 'tom_de_voz_marca.docx', size: '420 KB', type: 'DOCX' },
    ]);
    const [avatarName, setAvatarName] = useState('avatar-copywriter.png');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    /* ── Chat State (pre-filled with previous test messages) ── */
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { role: 'user', content: 'Crie um gancho de Reel para uma loja de roupas femininas com promoção de 50%.' },
        { role: 'assistant', content: '🔥 "Você tá jogando dinheiro fora se não assistir esse vídeo até o final..." 👗 Imagina renovar o guarda-roupa inteiro pela METADE do preço? É isso que tá rolando agora. Mas ó: é por tempo limitado. Arrasta pra cima antes que acabe! ⏰' },
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const avatarRef = useRef<HTMLInputElement>(null);
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const modelDropdownRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const agentId = params?.id as string;

    /* ── Load agent data from API ── */
    useEffect(() => {
        if (!agentId) return;
        fetch(`/api/admin/agentes/${agentId}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.agent) {
                    const a = data.agent;
                    if (a.name) setAgentName(a.name);
                    if (a.description) setDescription(a.description);
                    if (a.category) setCategory(a.category);
                    if (a.ai_model) setSelectedModel(a.ai_model);
                    if (a.system_prompt) setSystemPrompt(a.system_prompt);
                    if (a.avatar_url) setAvatarName(a.avatar_url);
                    if (a.files && Array.isArray(a.files)) {
                        setFiles(a.files.map((f: Record<string, string>) => ({
                            id: f.id || Date.now().toString(),
                            name: f.file_name || f.name,
                            size: f.file_size ? `${(Number(f.file_size) / 1024).toFixed(0)} KB` : '—',
                            type: (f.file_name || f.name || '').split('.').pop()?.toUpperCase() || 'FILE',
                        })));
                    }
                }
            })
            .catch(() => { });
    }, [agentId]);

    /* ── Click outside to close dropdown ── */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
                setModelDropdownOpen(false);
            }
        };
        if (modelDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [modelDropdownOpen]);

    /* ── Handlers ── */
    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setAvatarName(e.target.files[0].name);
    };

    const handleRemoveFile = async (id: string) => {
        const fileToRemove = files.find(f => f.id === id);
        setFiles((prev) => prev.filter((f) => f.id !== id));

        if (fileToRemove && !fileToRemove.file) {
            try {
                await fetch(`/api/admin/agentes/${agentId}/files?fileId=${id}`, {
                    method: 'DELETE'
                });
            } catch (err) {
                console.error("Erro ao deletar arquivo", err);
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const f = e.target.files[0];
            setFiles((prev) => [
                ...prev,
                { id: Date.now().toString(), name: f.name, size: `${(f.size / 1024).toFixed(0)} KB`, type: f.name.split('.').pop()?.toUpperCase() || 'FILE', file: f },
            ]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const provider = aiProviders.find((p) => p.models.some((m) => m.id === selectedModel));
        try {
            const res = await fetch(`/api/admin/agentes/${agentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: agentName,
                    description,
                    category,
                    ai_provider: provider?.id || 'openai',
                    ai_model: selectedModel,
                    system_prompt: systemPrompt,
                }),
            });
            if (res.ok) {
                const newFiles = files.filter(f => f.file);
                if (newFiles.length > 0) {
                    const uploadPromises = newFiles.map(async (fileObj) => {
                        if (!fileObj.file) return;
                        const formData = new FormData();
                        formData.append('file', fileObj.file);

                        await fetch(`/api/admin/agentes/${agentId}/files`, {
                            method: 'POST',
                            body: formData,
                        });
                    });
                    await Promise.allSettled(uploadPromises);
                }

                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch { /* ignore */ }
        setSaving(false);
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput.trim();
        const newMessages = [...chatMessages, { role: 'user' as const, content: userMsg }];

        setChatMessages(newMessages);
        setChatInput('');
        setIsTyping(true);

        try {
            const res = await fetch('/api/admin/agentes/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    system_prompt: systemPrompt || 'Você é um assistente útil e amigável.',
                    model: selectedModel
                })
            });

            if (res.ok) {
                const data = await res.json();
                setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                setChatMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, ocorreu um erro ao se conectar com a inteligência artificial para este preview.' }]);
            }
        } catch (error) {
            setChatMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, ocorreu um erro de conexão.' }]);
        } finally {
            setIsTyping(false);
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleChatKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const selectedModelInfo = findModelInfo(selectedModel);

    return (
        <div className="flex min-h-screen bg-background-dark font-display text-slate-100">
            <AdminSidebar />

            <main
                className="flex-1 ml-72 p-10 overflow-y-auto w-full relative"
                style={{
                    backgroundImage: 'radial-gradient(circle at top right, rgba(123,97,255,0.1), transparent 40%), radial-gradient(circle at bottom left, rgba(123,97,255,0.05), transparent 30%)',
                }}
            >
                {/* ─── HEADER ─── */}
                <header className="mb-8 z-10 relative">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-500/15 p-3 rounded-xl border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                            <span className="material-symbols-outlined text-amber-400 text-2xl">edit_note</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-sora text-white tracking-tight">Editar Agente</h1>
                            <p className="text-slate-400 mt-0.5 text-sm">Atualize as configurações e o comportamento do agente.</p>
                        </div>
                    </div>
                </header>

                {/* ─── TWO COLUMN LAYOUT ─── */}
                <div className="flex gap-6 items-start">

                    {/* ══════════════════════════════
                       LEFT COLUMN — CONFIGURATION
                       ══════════════════════════════ */}
                    <div className="flex-[3] space-y-6 min-w-0">

                        {/* ── Avatar & Basic Info ── */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                            <div className="flex items-start gap-6">
                                {/* Avatar Upload */}
                                <div className="relative flex-shrink-0 group">
                                    <div className="size-24 rounded-2xl bg-gradient-to-tr from-violet-600/40 to-purple-500/40 border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(123,97,255,0.15)]">
                                        {avatarName ? (
                                            <span className="material-symbols-outlined text-emerald-400 text-4xl">face</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-primary/60 text-4xl">smart_toy</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => avatarRef.current?.click()}
                                        className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
                                    </button>
                                    <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" />
                                    {avatarName && (
                                        <div className="absolute -bottom-1 -right-1 size-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-background-dark">
                                            <span className="material-symbols-outlined text-white text-[12px]">check</span>
                                        </div>
                                    )}
                                </div>

                                {/* Name & Description */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Nome do Agente</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-600 text-lg">badge</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={agentName}
                                                onChange={(e) => setAgentName(e.target.value)}
                                                placeholder="Ex: Vendedor IA, Suporte Premium..."
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Descrição Curta</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-600 text-lg">description</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Uma breve descrição do que este agente faz..."
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Category Select */}
                            <div className="mt-5">
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Categoria</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-600 text-lg">category</span>
                                    </div>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-10 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 appearance-none cursor-pointer"
                                    >
                                        {categoryOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value} className="bg-[#1a1a2e] text-slate-200">{opt.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-500 text-lg">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── AI Model Selection ── */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-visible relative z-20">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <span className="material-symbols-outlined text-primary text-xl">memory</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold font-sora text-white">Motor de Inteligência</h3>
                                    <p className="text-xs text-slate-500">Escolha o modelo de IA que vai alimentar o agente</p>
                                </div>
                            </div>

                            {/* Custom Model Dropdown */}
                            <div ref={modelDropdownRef} className="relative">
                                {/* Trigger button */}
                                <button
                                    onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                                    className={`w-full bg-black/40 border rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-300 text-left group ${modelDropdownOpen
                                        ? 'border-primary ring-1 ring-primary'
                                        : 'border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    {selectedModelInfo ? (
                                        <>
                                            <div className={`${selectedModelInfo.provider.bg} p-1.5 rounded-lg flex-shrink-0`}>
                                                <span className={`material-symbols-outlined text-[16px] ${selectedModelInfo.provider.color}`}>{selectedModelInfo.provider.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">{selectedModelInfo.model.name}</p>
                                                <p className="text-[10px] text-slate-500">{selectedModelInfo.provider.label}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-slate-600 text-lg">memory</span>
                                            <span className="text-sm text-slate-500">Selecionar modelo...</span>
                                        </>
                                    )}
                                    <span className={`material-symbols-outlined text-slate-500 text-lg ml-auto transition-transform duration-300 ${modelDropdownOpen ? 'rotate-180' : ''
                                        }`}>expand_more</span>
                                </button>

                                {/* Dropdown Panel */}
                                {modelDropdownOpen && (
                                    <div className="absolute z-50 mt-2 w-full bg-[#0d0d1a] border border-white/10 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] overflow-hidden">
                                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                            {aiProviders.map((provider, pi) => (
                                                <div key={provider.id}>
                                                    {/* Provider Group Header */}
                                                    <div className={`sticky top-0 z-10 bg-[#0d0d1a] px-4 py-2.5 flex items-center gap-2 ${pi > 0 ? 'border-t border-white/5' : ''}`}>
                                                        <div className={`${provider.bg} p-1 rounded-md`}>
                                                            <span className={`material-symbols-outlined text-[14px] ${provider.color}`}>{provider.icon}</span>
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{provider.label}</span>
                                                    </div>
                                                    {/* Model Options */}
                                                    {provider.models.map((model) => {
                                                        const isSelected = selectedModel === model.id;
                                                        return (
                                                            <button
                                                                key={model.id}
                                                                onClick={() => { setSelectedModel(model.id); setModelDropdownOpen(false); }}
                                                                className={`w-full text-left px-4 py-2.5 pl-11 flex items-center justify-between transition-all duration-200 ${isSelected
                                                                    ? 'bg-primary/10 text-primary'
                                                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                                                    }`}
                                                            >
                                                                <span className={`text-sm ${isSelected ? 'font-bold' : 'font-medium'}`}>{model.name}</span>
                                                                {isSelected && (
                                                                    <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Selected model info pill */}
                            {selectedModelInfo && (
                                <div className="mt-3 flex items-center gap-2">
                                    <div className={`inline-flex items-center gap-1.5 ${selectedModelInfo.provider.bg} border ${selectedModelInfo.provider.borderColor} px-3 py-1 rounded-full`}>
                                        <span className={`material-symbols-outlined text-[13px] ${selectedModelInfo.provider.color}`}>{selectedModelInfo.provider.icon}</span>
                                        <span className={`text-[11px] font-bold ${selectedModelInfo.provider.color}`}>{selectedModelInfo.provider.label}</span>
                                    </div>
                                    <span className="text-[11px] text-slate-600">→</span>
                                    <span className="text-[11px] text-slate-400 font-mono font-semibold">{selectedModelInfo.model.name}</span>
                                </div>
                            )}
                        </div>

                        {/* ── System Prompt ── */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-amber-500/10 p-2 rounded-lg">
                                    <span className="material-symbols-outlined text-amber-400 text-xl">code</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold font-sora text-white">System Prompt</h3>
                                    <p className="text-xs text-slate-500">Instruções comportamentais — define a personalidade da IA</p>
                                </div>
                            </div>

                            {/* Tip callout */}
                            <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 mb-4 flex items-start gap-3">
                                <span className="material-symbols-outlined text-amber-400 text-lg flex-shrink-0 mt-0.5">lightbulb</span>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    O system prompt define <strong className="text-amber-300">quem é o agente</strong>, como ele se comporta, que tom usa e quais são suas regras. Quanto mais detalhado, melhores serão as respostas.
                                </p>
                            </div>

                            <textarea
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                rows={8}
                                placeholder="Você é um especialista em vendas da plataforma X..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 resize-none font-mono leading-relaxed"
                            />
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-[10px] text-slate-600">
                                    {systemPrompt.length} caracteres
                                </p>
                                <p className="text-[10px] text-slate-600">
                                    Modelo: <span className="text-primary font-semibold">{selectedModelInfo?.model.name}</span>
                                </p>
                            </div>
                        </div>

                        {/* ── Knowledge Base (RAG) ── */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="bg-blue-500/10 p-2 rounded-lg">
                                    <span className="material-symbols-outlined text-blue-400 text-xl">folder_open</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold font-sora text-white">Base de Conhecimento (RAG)</h3>
                                    <p className="text-xs text-slate-500">Faça upload de documentos para o agente usar como referência</p>
                                </div>
                            </div>

                            {/* Drag & Drop Zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                                onClick={() => fileUploadRef.current?.click()}
                                className={`border-dashed border-2 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${dragOver
                                    ? 'border-primary bg-primary/5'
                                    : 'border-white/20 hover:border-primary/50 hover:bg-white/[0.02]'
                                    }`}
                            >
                                <div className={`mx-auto size-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${dragOver ? 'bg-primary/20' : 'bg-white/5'
                                    }`}>
                                    <span className={`material-symbols-outlined text-3xl transition-colors ${dragOver ? 'text-primary' : 'text-slate-500'}`}>cloud_upload</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-300 mb-1">
                                    {dragOver ? 'Solte o arquivo aqui!' : 'Arraste arquivos ou clique para enviar'}
                                </p>
                                <p className="text-[11px] text-slate-600">PDF, TXT, DOCX — Máx. 10MB por arquivo</p>
                                <input ref={fileUploadRef} type="file" accept=".pdf,.txt,.docx" onChange={handleFileUpload} className="hidden" />
                            </div>

                            {/* Uploaded Files List */}
                            {files.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Arquivos carregados ({files.length})
                                    </p>
                                    {files.map((file) => {
                                        const iconMap: Record<string, { icon: string; color: string; bg: string }> = {
                                            PDF: { icon: 'picture_as_pdf', color: 'text-rose-400', bg: 'bg-rose-500/15' },
                                            DOCX: { icon: 'article', color: 'text-blue-400', bg: 'bg-blue-500/15' },
                                            TXT: { icon: 'text_snippet', color: 'text-sky-400', bg: 'bg-sky-500/15' },
                                        };
                                        const fileStyle = iconMap[file.type] || iconMap.TXT;
                                        return (
                                            <div
                                                key={file.id}
                                                className="flex items-center justify-between bg-black/30 border border-white/5 rounded-xl px-4 py-3 group hover:border-white/10 transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-1.5 rounded-lg ${fileStyle.bg}`}>
                                                        <span className={`material-symbols-outlined text-[16px] ${fileStyle.color}`}>
                                                            {fileStyle.icon}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-300 font-medium">{file.name}</p>
                                                        <p className="text-[10px] text-slate-600">{file.size} • {file.type}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveFile(file.id)}
                                                    className="text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ── Save Button ── */}
                        <div className="flex items-center justify-between">
                            <div>
                                {saved && (
                                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                        Alterações salvas com sucesso!
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`btn-magnetic flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-sora font-semibold text-sm transition-all duration-300 border border-white/10 ${saving
                                    ? 'bg-primary/50 text-white/60 cursor-wait'
                                    : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-[0_0_30px_rgba(123,97,255,0.4)]'
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

                    {/* ══════════════════════════════
                       RIGHT COLUMN — CHAT PREVIEW
                       ══════════════════════════════ */}
                    <div className="flex-[2] sticky top-10 min-w-0">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-8rem)] shadow-[0_0_30px_rgba(123,97,255,0.05)]">

                            {/* Chat Header */}
                            <div className="px-5 py-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
                                <div className="size-9 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center shadow-[0_0_10px_rgba(123,97,255,0.3)] border border-white/20">
                                    <span className="text-white text-xs font-bold">CR</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">
                                        {agentName || 'Preview do Agente'}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-emerald-400 font-semibold">Online</span>
                                        {selectedModelInfo && (
                                            <>
                                                <span className="text-slate-600 text-[10px]">•</span>
                                                <span className="text-[10px] text-slate-500">{selectedModelInfo.model.name}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <button className="text-slate-500 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all">
                                    <span className="material-symbols-outlined text-lg">refresh</span>
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                {chatMessages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'assistant' && (
                                            <div className="size-7 rounded-lg bg-gradient-to-tr from-violet-600/30 to-purple-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                                <span className="text-primary text-[10px] font-bold">CR</span>
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-primary text-white rounded-br-md shadow-[0_0_12px_rgba(123,97,255,0.2)]'
                                                : 'bg-white/5 border border-white/10 text-slate-300 rounded-bl-md'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="size-7 rounded-lg bg-gradient-to-tr from-violet-600/30 to-purple-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                            <span className="text-primary text-[10px] font-bold">CR</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                                            <div className="flex items-center gap-1.5">
                                                <span className="size-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0ms]" />
                                                <span className="size-2 bg-slate-500 rounded-full animate-bounce [animation-delay:150ms]" />
                                                <span className="size-2 bg-slate-500 rounded-full animate-bounce [animation-delay:300ms]" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-white/10 bg-black/20">
                                <div className="relative flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={handleChatKeyDown}
                                        placeholder="Teste seu agente aqui..."
                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl pl-4 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!chatInput.trim() || isTyping}
                                        className={`flex-shrink-0 size-11 rounded-xl flex items-center justify-center transition-all duration-300 ${chatInput.trim() && !isTyping
                                            ? 'bg-primary text-white shadow-[0_0_12px_rgba(123,97,255,0.4)] hover:bg-primary/90'
                                            : 'bg-white/5 text-slate-600 cursor-not-allowed'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-xl">send</span>
                                    </button>
                                </div>
                                <p className="text-[10px] text-emerald-500/80 mt-2 text-center flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                                    Preview conectado à {findModelInfo(selectedModel)?.model?.name || selectedModel}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}
