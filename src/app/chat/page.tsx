'use client';

import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Olá! Eu sou sua chave inteligente. Como posso ajudar com seu conteúdo ou estratégia hoje?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');

        // Mock assistant response
        setTimeout(() => {
            const newAssistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Entendi. Vou analisar essa solicitação e preparar as melhores opções baseadas no seu ecossistema. Só um instante...',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, newAssistantMsg]);
        }, 1000);
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
                                Assistente Geral
                                <span className="bg-primary/20 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-primary/30">Beta</span>
                            </h2>
                            <p className="text-xs text-slate-400">Pronto para acelerar suas ideias.</p>
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
                    {messages.length === 1 && (
                        <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center animate-fade-in">
                            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(123,97,255,0.2)]">
                                <span className="material-symbols-outlined text-4xl text-primary">forum</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2 font-sora">Como posso ajudar hoje?</h1>
                            <p className="text-slate-400 mb-10 max-w-md">Estou conectado ao seu ecossistema. Peça roteiros, análises ou novos conteúdos baseados nas suas diretrizes.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
                                <button onClick={() => setInputValue('Gere um carrossel de 5 slides sobre produtividade usando meu tom de voz.')} className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 p-4 rounded-xl transition-all group">
                                    <span className="material-symbols-outlined text-primary mb-2 block group-hover:scale-110 transition-transform">view_carousel</span>
                                    <h3 className="text-sm font-bold text-white mb-1">Criar Carrossel</h3>
                                    <p className="text-xs text-slate-500">Gere um carrossel de 5 slides...</p>
                                </button>
                                <button onClick={() => setInputValue('Escreva um roteiro de Reels curto para o topo de funil.')} className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 p-4 rounded-xl transition-all group">
                                    <span className="material-symbols-outlined text-primary mb-2 block group-hover:scale-110 transition-transform">movie</span>
                                    <h3 className="text-sm font-bold text-white mb-1">Roteiro de Reels</h3>
                                    <p className="text-xs text-slate-500">Escreva um roteiro curto para topo de funil...</p>
                                </button>
                                <button onClick={() => setInputValue('Faça um resumo dos meus principais diferenciais.')} className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 p-4 rounded-xl transition-all group">
                                    <span className="material-symbols-outlined text-primary mb-2 block group-hover:scale-110 transition-transform">psychology</span>
                                    <h3 className="text-sm font-bold text-white mb-1">Análise de Perfil</h3>
                                    <p className="text-xs text-slate-500">Resumo dos diferenciais...</p>
                                </button>
                                <button onClick={() => setInputValue('Me dê ideias de email marketing para a próxima semana.')} className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 p-4 rounded-xl transition-all group">
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
                                    {msg.role === 'assistant' && msg.id === '1' && messages.length > 1 ? null : (
                                        <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</p>
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
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 mb-1 transition-all ${inputValue.trim() ? 'bg-primary text-white hover:bg-primary/90 shadow-[0_0_15px_rgba(123,97,255,0.4)]' : 'bg-white/5 text-slate-500 cursor-not-allowed'}`}
                            >
                                <span className="material-symbols-outlined text-xl">send</span>
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
