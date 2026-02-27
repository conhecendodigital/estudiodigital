'use client';

import React, { useState, useRef, useCallback } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

/* ── Types ── */
interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    time: string;
}

interface UploadedFile {
    id: string;
    name: string;
    size: string;
    type: 'pdf' | 'txt' | 'docx';
}

const categories = [
    { value: '', label: 'Selecione uma categoria...' },
    { value: 'vendas', label: '🎯 Vendas & Prospecção' },
    { value: 'copywriting', label: '✍️ Copywriting & Conteúdo' },
    { value: 'suporte', label: '🎧 Suporte ao Cliente' },
    { value: 'marketing', label: '📊 Marketing Digital' },
    { value: 'educacao', label: '📚 Educação & Treinamento' },
    { value: 'analise', label: '🔍 Análise de Dados' },
    { value: 'codigo', label: '💻 Programação & Código' },
    { value: 'rh', label: '👥 RH & Recrutamento' },
];

const fileIcons: Record<string, string> = {
    pdf: 'picture_as_pdf',
    txt: 'description',
    docx: 'article',
};

/* ═══════════════════════════════════════════
   CREATE NEW AI AGENT PAGE
   ═══════════════════════════════════════════ */
export default function NovoAgentePage() {
    /* ── Form State ── */
    const [agentName, setAgentName] = useState('');
    const [agentDesc, setAgentDesc] = useState('');
    const [category, setCategory] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [generatingAvatar, setGeneratingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    /* ── File upload state ── */
    const [files, setFiles] = useState<UploadedFile[]>([
        { id: '1', name: 'manual-vendas-2024.pdf', size: '2.4 MB', type: 'pdf' },
        { id: '2', name: 'faq-suporte.txt', size: '156 KB', type: 'txt' },
    ]);
    const [isDragging, setIsDragging] = useState(false);

    /* ── Chat Playground State ── */
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'system',
            content: '🤖 Olá! Eu sou o preview do seu agente. Configure o System Prompt à esquerda e me envie uma mensagem para testar como eu respondo.',
            time: 'Agora',
        },
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    /* ── Handlers ── */
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const generateAvatar = () => {
        setGeneratingAvatar(true);
        setTimeout(() => {
            setAvatarPreview(null);
            setGeneratingAvatar(false);
        }, 2000);
    };

    const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

    const handleFileDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        const newFiles: UploadedFile[] = droppedFiles.map((f, i) => ({
            id: `upload-${Date.now()}-${i}`,
            name: f.name,
            size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
            type: (f.name.split('.').pop() || 'txt') as UploadedFile['type'],
        }));
        setFiles((prev) => [...prev, ...newFiles]);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);
        const newFiles: UploadedFile[] = selected.map((f, i) => ({
            id: `select-${Date.now()}-${i}`,
            name: f.name,
            size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
            type: (f.name.split('.').pop() || 'txt') as UploadedFile['type'],
        }));
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const sendMessage = () => {
        if (!chatInput.trim()) return;
        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: chatInput,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, userMsg]);
        setChatInput('');
        setIsTyping(true);

        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);

        // Simulate AI response
        setTimeout(() => {
            const aiMsg: ChatMessage = {
                id: `ai-${Date.now()}`,
                role: 'assistant',
                content: agentName
                    ? `Olá! Eu sou o **${agentName}**. ${systemPrompt ? 'Estou configurado com as instruções que você definiu. ' : ''}Como posso ajudar você hoje? 😊`
                    : 'Parece que você ainda não me deu um nome! Configure meu perfil à esquerda para personalizar minhas respostas.',
                time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
            setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        }, 1500 + Math.random() * 1000);
    };

    const handleSave = () => {
        setSaving(true);
        setSaved(false);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1800);
    };

    const promptCharCount = systemPrompt.length;

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
                <header className="flex items-center justify-between mb-8 z-10 relative">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/15 p-3 rounded-xl border border-primary/20 shadow-[0_0_20px_rgba(123,97,255,0.15)]">
                            <span className="material-symbols-outlined text-primary text-2xl">neurology</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-sora text-white tracking-tight">Criar Novo Agente</h1>
                            <p className="text-slate-400 mt-0.5 text-sm">Configure a personalidade, conhecimento e comportamento do seu agente de IA.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {saved && (
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                Salvo!
                            </span>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`btn-magnetic flex items-center gap-2.5 px-7 py-3 rounded-xl font-sora font-semibold text-sm transition-all duration-300 border border-white/10 ${saving
                                ? 'bg-primary/50 text-white/60 cursor-wait'
                                : 'bg-primary hover:bg-primary-dark text-white shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:shadow-[0_0_35px_rgba(123,97,255,0.5)]'
                                }`}
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin size-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                    Salvar na Biblioteca
                                </>
                            )}
                        </button>
                    </div>
                </header>

                {/* ─── MAIN CONTENT: 60/40 LAYOUT ─── */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">

                    {/* ════════ LEFT COLUMN: CONFIGURATION (3/5 = 60%) ════════ */}
                    <div className="xl:col-span-3 space-y-6">

                        {/* ── Avatar + Basic Info ── */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:shadow-[0_0_20px_rgba(123,97,255,0.08)] transition-all duration-500">
                            <h2 className="text-lg font-bold font-sora text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">badge</span>
                                Identidade do Agente
                            </h2>

                            <div className="flex flex-col sm:flex-row gap-6">
                                {/* Avatar */}
                                <div className="flex flex-col items-center gap-3 flex-shrink-0">
                                    <div className="relative group">
                                        <div className={`size-28 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-300 ${avatarPreview ? 'border-primary/40' : 'border-white/15 hover:border-primary/40'}`}>
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : generatingAvatar ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <svg className="animate-spin size-6 text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                    <span className="text-[10px] text-primary">Gerando...</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 text-slate-500">
                                                    <span className="material-symbols-outlined text-3xl">smart_toy</span>
                                                    <span className="text-[10px] font-medium">Avatar</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => avatarInputRef.current?.click()}
                                            className="text-[11px] font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-all flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">upload</span>
                                            Upload
                                        </button>
                                        <button
                                            onClick={generateAvatar}
                                            className="text-[11px] font-semibold text-primary hover:text-white bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/20 transition-all flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                                            Gerar IA
                                        </button>
                                    </div>
                                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                                </div>

                                {/* Name, Description, Category */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Nome do Agente *</label>
                                        <input
                                            type="text"
                                            value={agentName}
                                            onChange={(e) => setAgentName(e.target.value)}
                                            placeholder="Ex: Consultor de Vendas Pro"
                                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/40 focus:shadow-[0_0_20px_rgba(123,97,255,0.1)] transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Descrição Curta</label>
                                        <input
                                            type="text"
                                            value={agentDesc}
                                            onChange={(e) => setAgentDesc(e.target.value)}
                                            placeholder="Ex: Especialista em fechamento de vendas B2B"
                                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/40 focus:shadow-[0_0_20px_rgba(123,97,255,0.1)] transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Categoria</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-primary/40 focus:shadow-[0_0_20px_rgba(123,97,255,0.1)] transition-all duration-300 cursor-pointer"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat.value} value={cat.value} className="bg-background-dark text-white">{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── System Prompt ── */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:shadow-[0_0_20px_rgba(123,97,255,0.08)] transition-all duration-500">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-bold font-sora text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-xl">terminal</span>
                                    System Prompt
                                </h2>
                                <span className={`text-[11px] font-mono ${promptCharCount > 4000 ? 'text-rose-400' : 'text-slate-500'}`}>
                                    {promptCharCount.toLocaleString()} / 8.000
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-4">
                                Define a personalidade, tom de voz, limitações e regras comportamentais da IA. Quanto mais detalhado, melhor.
                            </p>
                            <textarea
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                maxLength={8000}
                                rows={10}
                                placeholder="Você é um assistente especializado em vendas B2B. Seu objetivo é ajudar o usuário a criar estratégias de prospecção, qualificação de leads e fechamento de vendas. 

Regras:
- Sempre seja profissional e objetivo
- Use dados e métricas para embasar argumentos
- Nunca invente informações..."
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 text-sm text-white font-mono leading-relaxed placeholder-slate-600 focus:outline-none focus:border-primary/40 focus:shadow-[0_0_20px_rgba(123,97,255,0.1)] transition-all duration-300 resize-y min-h-[200px]"
                            />
                        </div>

                        {/* ── Knowledge Base (RAG) ── */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:shadow-[0_0_20px_rgba(123,97,255,0.08)] transition-all duration-500">
                            <h2 className="text-lg font-bold font-sora text-white mb-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">folder_special</span>
                                Base de Conhecimento (RAG)
                            </h2>
                            <p className="text-xs text-slate-500 mb-5">
                                Envie documentos para que o agente use como referência ao responder. Suporta PDF, TXT e DOCX.
                            </p>

                            {/* Drop Zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleFileDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 ${isDragging
                                    ? 'border-primary/60 bg-primary/5 shadow-[0_0_30px_rgba(123,97,255,0.1)]'
                                    : 'border-white/15 hover:border-primary/40 hover:bg-white/[0.02]'
                                    }`}
                            >
                                <div className={`p-3 rounded-xl transition-all duration-300 ${isDragging ? 'bg-primary/20 scale-110' : 'bg-white/5'}`}>
                                    <span className={`material-symbols-outlined text-3xl ${isDragging ? 'text-primary' : 'text-slate-500'}`}>cloud_upload</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-slate-300">
                                        {isDragging ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-1">PDF, TXT ou DOCX — Máx. 10 MB por arquivo</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.txt,.docx"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                            </div>

                            {/* Uploaded Files List */}
                            {files.length > 0 && (
                                <div className="mt-5 space-y-2">
                                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                        {files.length} arquivo{files.length > 1 ? 's' : ''} na base
                                    </p>
                                    {files.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between bg-black/20 border border-white/5 rounded-xl px-4 py-3 group hover:border-white/10 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-lg ${file.type === 'pdf' ? 'bg-rose-500/15 text-rose-400' : file.type === 'docx' ? 'bg-blue-500/15 text-blue-400' : 'bg-slate-500/15 text-slate-400'}`}>
                                                    <span className="material-symbols-outlined text-lg">{fileIcons[file.type] || 'description'}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-200">{file.name}</p>
                                                    <p className="text-[11px] text-slate-500">{file.size}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="text-slate-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ════════ RIGHT COLUMN: CHAT PLAYGROUND (2/5 = 40%) ════════ */}
                    <div className="xl:col-span-2 xl:sticky xl:top-10">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)] hover:shadow-[0_0_20px_rgba(123,97,255,0.08)] transition-all duration-500">

                            {/* Chat Header */}
                            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-xl bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shadow-[0_0_12px_rgba(123,97,255,0.3)] border border-white/20">
                                        <span className="material-symbols-outlined text-white text-lg">smart_toy</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white font-sora">Preview do Agente</p>
                                        <p className="text-[10px] text-slate-500">
                                            {agentName ? agentName : 'Sem nome definido'}
                                            {isTyping && <span className="text-primary ml-1">• Digitando...</span>}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Live</span>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        {/* Avatar */}
                                        {msg.role !== 'user' ? (
                                            <div className="size-8 rounded-lg bg-gradient-to-tr from-primary/80 to-purple-500/80 flex items-center justify-center flex-shrink-0 border border-white/10">
                                                <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                                            </div>
                                        ) : (
                                            <div className="size-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 border border-white/10">
                                                <span className="material-symbols-outlined text-slate-300 text-sm">person</span>
                                            </div>
                                        )}

                                        {/* Bubble */}
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-primary/20 text-white border border-primary/20 rounded-br-md'
                                                : msg.role === 'system'
                                                    ? 'bg-amber-500/5 text-slate-300 border border-amber-500/10 rounded-bl-md'
                                                    : 'bg-white/5 text-slate-200 border border-white/5 rounded-bl-md'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                            <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-primary/50 text-right' : 'text-slate-600'}`}>{msg.time}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {isTyping && (
                                    <div className="flex gap-3">
                                        <div className="size-8 rounded-lg bg-gradient-to-tr from-primary/80 to-purple-500/80 flex items-center justify-center flex-shrink-0 border border-white/10">
                                            <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                                            <div className="size-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="size-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="size-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-white/10 bg-black/20">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                        placeholder="Teste o agente aqui..."
                                        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/30 transition-all duration-300"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!chatInput.trim()}
                                        className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0 ${chatInput.trim()
                                            ? 'bg-primary hover:bg-primary-dark text-white shadow-[0_0_15px_rgba(123,97,255,0.3)]'
                                            : 'bg-white/5 text-slate-600 cursor-not-allowed'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-xl">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
