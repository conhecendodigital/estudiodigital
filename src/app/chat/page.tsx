'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type Message = {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
};

// Internal Chat Component
function ChatContent() {
    const supabase = createClient();
    const { profile } = useAuth();
    const searchParams = useSearchParams();
    const urlAgentId = searchParams.get('agent');

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [currentAgent, setCurrentAgent] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (profile?.id) {
            initializeChatSession();
        }
    }, [profile?.id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const initializeChatSession = async () => {
        try {
            // First check if URL forces a specific agent
            let targetAgentId = urlAgentId;
            let activeSessionId = null;

            // If no specific agent in URL, try to find an existing active session
            if (!targetAgentId) {
                const { data: currentSessions } = await supabase
                    .from('chat_sessions')
                    .select('*')
                    .eq('user_id', profile!.id)
                    .order('updated_at', { ascending: false })
                    .limit(1);

                if (currentSessions && currentSessions.length > 0) {
                    activeSessionId = currentSessions[0].id;
                    targetAgentId = currentSessions[0].agent_id;
                    setSessionId(activeSessionId);
                }
            }

            // If we STILL don't have an agent, pick the first active one as fallback
            if (!targetAgentId) {
                const { data: agents } = await supabase
                    .from('agents')
                    .select('id')
                    .eq('status', 'ativo')
                    .limit(1);

                if (agents && agents.length > 0) {
                    targetAgentId = agents[0].id;
                } else {
                    console.error("No active agents found in the system.");
                    return;
                }
            }

            // Fetch the agent details
            const { data: agentData, error: agentErr } = await supabase
                .from('agents')
                .select('*')
                .eq('id', targetAgentId)
                .single();

            if (agentData) {
                setCurrentAgent(agentData);
            }

            // If we came from URL with an explicit agent, or created a fallback, create a new session
            if (!activeSessionId) {
                const { data: newSession, error: sessionErr } = await supabase
                    .from('chat_sessions')
                    .insert({
                        user_id: profile!.id,
                        agent_id: targetAgentId,
                        title: 'Nova Conversa com ' + (agentData?.name || 'Agente')
                    })
                    .select()
                    .single();

                if (newSession) {
                    activeSessionId = newSession.id;
                    setSessionId(activeSessionId);
                    addWelcomeMessage(agentData?.name || 'Assistente');
                }
            } else {
                // We loaded an existing session, fetch its messages
                const { data: msgs } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .eq('session_id', activeSessionId)
                    .order('created_at', { ascending: true });

                if (msgs && msgs.length > 0) {
                    setMessages(msgs.map((m: any) => ({
                        id: m.id,
                        role: m.role as 'user' | 'assistant',
                        content: m.content,
                        timestamp: new Date(m.created_at)
                    })));
                } else {
                    addWelcomeMessage(agentData?.name || 'Assistente');
                }
            }
        } catch (error) {
            console.error("Error initializing chat", error);
        }
    };

    const addWelcomeMessage = (agentName: string = 'Assistente') => {
        setMessages([{
            id: 'welcome_1',
            role: 'assistant',
            content: `Olá! Eu sou ${agentName}. Como posso ajudar com seu conteúdo ou estratégia hoje?`,
            timestamp: new Date()
        }]);
    };

    const handleSendMessage = async (text: string = inputValue) => {
        if (!text.trim() || !sessionId || !profile?.id || isLoading) return;

        const userMsgText = text.trim();
        setInputValue('');
        setIsLoading(true);

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userMsgText,
            timestamp: new Date()
        };

        // Add to UI immediately
        const newMessagesState = [...messages, newUserMsg];
        setMessages(newMessagesState);

        try {
            // Save user msg to DB
            await supabase.from('chat_messages').insert({
                session_id: sessionId,
                role: 'user',
                content: userMsgText
            });

            // Create Assistant Placeholder
            const assistantPlaceholderId = `assistant_${Date.now()}`;
            setMessages(prev => [...prev, {
                id: assistantPlaceholderId,
                role: 'assistant',
                content: '',
                timestamp: new Date()
            }]);

            // Dynamic prompt / model logic
            const systemPrompt = currentAgent?.system_prompt || 'Você é um assistente prestativo focado em criação de conteúdo digital e copywriting. Seja objetivo e profissional.';
            const aiModel = currentAgent?.ai_model || 'gemini-2.0-flash';
            const aiProvider = currentAgent?.ai_provider || 'google';

            // Call API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessagesState.map(m => ({ role: m.role, content: m.content })),
                    system_prompt: systemPrompt,
                    model: aiModel,
                    provider: aiProvider
                })
            });

            if (!response.ok) {
                if (response.status === 403) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Créditos insuficientes. Faça upgrade do seu plano.');
                }
                throw new Error('Falha na resposta da IA');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');
            let fullAssistantResponse = '';

            if (reader) {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    fullAssistantResponse += chunk;

                    setMessages(prev => prev.map(msg =>
                        msg.id === assistantPlaceholderId
                            ? { ...msg, content: fullAssistantResponse }
                            : msg
                    ));
                }

                // Stream finished => Save to DB
                if (fullAssistantResponse.trim()) {
                    await supabase.from('chat_messages').insert({
                        session_id: sessionId,
                        role: 'assistant',
                        content: fullAssistantResponse
                    });
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev.filter(m => !m.id.startsWith('assistant_')), {
                id: Date.now().toString(),
                role: 'assistant',
                content: 'Desculpe, ocorreu um erro ao gerar a resposta. Tente novamente mais tarde.',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen selection:bg-primary/30 flex overflow-hidden relative">

            {/* Noise Overlay */}
            <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-50 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]"></div>

            {/* Plasma Accents */}
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] z-0 pointer-events-none opacity-40 blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(123, 97, 255, 0.2) 0%, rgba(10, 10, 20, 0) 70%)' }}></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] z-0 pointer-events-none opacity-30 blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(123, 97, 255, 0.15) 0%, rgba(10, 10, 20, 0) 70%)' }}></div>

            {/* Global Sidebar */}
            <Sidebar />

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col md:ml-[280px] z-10 relative h-screen">

                {/* Chat Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(123,97,255,0.4)]">
                            <span className="material-symbols-outlined text-xl">auto_awesome</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                                {currentAgent ? currentAgent.name : 'Assistente VIP'}
                                <span className="bg-primary/20 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-primary/30">{currentAgent?.category || 'Geral'}</span>
                            </h2>
                            <p className="text-xs text-slate-400 capitalize">{currentAgent?.ai_provider || 'Google'} • {currentAgent?.ai_model || 'Premium'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-xl">ios_share</span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-xl">more_vert</span>
                        </button>
                    </div>
                </header>

                {/* Messages List Area */}
                <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar p-6 space-y-8 relative">

                    {/* Welcome / Empty State (Shown if only 1 intro message) */}
                    {messages.length <= 1 && (
                        <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center animate-fade-in">
                            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(123,97,255,0.2)]">
                                <span className="material-symbols-outlined text-4xl text-primary">forum</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2 font-sora">Como posso ajudar hoje?</h1>
                            <p className="text-slate-400 mb-10 max-w-md">Estou conectado ao seu ecossistema. Peça roteiros, análises ou novos conteúdos baseados nas suas diretrizes.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
                                <button onClick={() => handleSendMessage('Gere um carrossel de 5 slides sobre produtividade usando meu tom de voz.')} className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 p-4 rounded-xl transition-all group disabled:opacity-50" disabled={isLoading}>
                                    <span className="material-symbols-outlined text-primary mb-2 block group-hover:scale-110 transition-transform">view_carousel</span>
                                    <h3 className="text-sm font-bold text-white mb-1">Criar Carrossel</h3>
                                    <p className="text-xs text-slate-500">Gere um carrossel de 5 slides...</p>
                                </button>
                                <button onClick={() => handleSendMessage('Escreva um roteiro de Reels curto para o topo de funil.')} className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 p-4 rounded-xl transition-all group disabled:opacity-50" disabled={isLoading}>
                                    <span className="material-symbols-outlined text-primary mb-2 block group-hover:scale-110 transition-transform">movie</span>
                                    <h3 className="text-sm font-bold text-white mb-1">Roteiro de Reels</h3>
                                    <p className="text-xs text-slate-500">Escreva um roteiro curto para topo de funil...</p>
                                </button>
                                <button onClick={() => handleSendMessage('Faça um resumo dos meus principais diferenciais.')} className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 p-4 rounded-xl transition-all group disabled:opacity-50" disabled={isLoading}>
                                    <span className="material-symbols-outlined text-primary mb-2 block group-hover:scale-110 transition-transform">psychology</span>
                                    <h3 className="text-sm font-bold text-white mb-1">Análise de Perfil</h3>
                                    <p className="text-xs text-slate-500">Resumo dos diferenciais...</p>
                                </button>
                                <button onClick={() => handleSendMessage('Me dê ideias de email marketing para a próxima semana.')} className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 p-4 rounded-xl transition-all group disabled:opacity-50" disabled={isLoading}>
                                    <span className="material-symbols-outlined text-primary mb-2 block group-hover:scale-110 transition-transform">mail</span>
                                    <h3 className="text-sm font-bold text-white mb-1">Ideias de Email</h3>
                                    <p className="text-xs text-slate-500">Planejamento da próxima semana...</p>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="max-w-3xl mx-auto space-y-8 pb-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/30' : 'bg-slate-700 overflow-hidden'}`}>
                                    {msg.role === 'assistant' ? (
                                        <span className="material-symbols-outlined text-white text-sm">auto_awesome</span>
                                    ) : (
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBioSdxEPuhmwHbM34vFuRdo7NqQ7d4KcKdvx0YednNjiczkEgP5T4lKv_dYBouUhOQTdzdak1iNFXn17u-JJ-C89n2lDFXp7jwgUmZyTphgZhD9yVam9DV5ATMjcCm-cIFLd-6vjiDzop3EiYaQS0FIiLXLSQ8v2Yp3zY2gVdEQPBSCoLpJnlne3t-Xdi6bThfxswIWInCAe3Bl-g_SlvbwmBg-WjsPnP7Tb43W2qBGUPrN9FLkt0DqTh0sUMV3KS1BIqPHcargQ4" alt="User" className="w-full h-full object-cover" />
                                    )}
                                </div>

                                {/* Message Bubble */}
                                <div className={`max-w-[85%] rounded-2xl p-5 ${msg.role === 'user' ? 'bg-white/5 border border-white/10 text-slate-100 rounded-tr-none' : 'bg-transparent text-slate-200'}`}>
                                    {msg.role === 'assistant' && msg.id.startsWith('welcome_') && messages.length > 1 ? null : (
                                        <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
                                            {msg.content === '' && msg.role === 'assistant' ? (
                                                <div className="flex gap-1 items-center h-6">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                </div>
                                            ) : (
                                                msg.content
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-gradient-to-t from-background-dark via-background-dark/90 to-transparent shrink-0">
                    <div className="max-w-3xl mx-auto relative">
                        <div className="bg-sidebar-dark/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-end gap-2 shadow-2xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">

                            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors shrink-0 mb-1">
                                <span className="material-symbols-outlined text-xl">attach_file</span>
                            </button>

                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Envie uma mensagem para a chave.ai..."
                                className="w-full bg-transparent border-none focus:ring-0 text-slate-200 resize-none py-3 px-2 max-h-32 min-h-[44px] custom-scrollbar focus:outline-none"
                                rows={1}
                                style={{ height: 'auto' }}
                            />

                            <button
                                onClick={() => handleSendMessage(inputValue)}
                                disabled={!inputValue.trim() || isLoading}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 mb-1 transition-all ${inputValue.trim() && !isLoading ? 'bg-primary text-white hover:bg-primary/90 shadow-[0_0_15px_rgba(123,97,255,0.4)]' : 'bg-white/5 text-slate-500 cursor-not-allowed'}`}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <span className="material-symbols-outlined text-xl">send</span>
                                )}
                            </button>
                        </div>
                        <div className="text-center mt-3">
                            <span className="text-[10px] text-slate-500 font-medium">A IA pode cometer erros. Considere verificar as informações importantes.</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Styles specific to chat input auto-resize logic could go here, for now relying on basic textarea */}
        </div>
    );
}

// Export the page wrapped in Suspense for Next.js params hooks
export default function ChatPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-dark flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
            <ChatContent />
        </Suspense>
    );
}
