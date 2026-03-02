'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldAlert, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                window.location.href = '/admin';
            } else {
                const data = await res.json();
                setError(data.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
                setIsLoading(false);
            }
        } catch {
            setError('Falha de conexão com o servidor. Tente novamente.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark font-display flex items-center justify-center relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Animated Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="w-full max-w-md px-6 relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 glass-card rounded-2xl mb-4 border border-primary/30 shadow-[0_0_20px_rgba(123,97,255,0.2)]">
                        <Lock className="size-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold font-sora text-white">Acesso Restrito</h1>
                    <p className="text-slate-400 mt-2 text-sm">Insira suas credenciais de administrador.</p>
                </div>

                <div className="glass-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3">
                                <ShieldAlert className="size-5 text-rose-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-rose-300 font-medium leading-relaxed">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@admin.com.br"
                                    required
                                    className="w-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3.5 pl-12 pr-4 text-slate-200 text-sm outline-none transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Senha</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3.5 pl-12 pr-12 text-slate-200 text-sm outline-none transition-all placeholder:text-slate-600 font-mono tracking-widest"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors bg-transparent border-none p-1 flex items-center justify-center cursor-pointer opacity-70 hover:opacity-100"
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-bold font-sora flex items-center justify-center gap-2 transition-all duration-300 ${isLoading
                                ? 'bg-primary/50 text-white/50 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(123,97,255,0.4)] hover:shadow-[0_0_30px_rgba(123,97,255,0.6)] hover:-translate-y-1'
                                }`}
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Autenticando...</span>
                            ) : (
                                <>
                                    Acessar Painel
                                    <ArrowRight className="size-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-xs text-slate-500">
                    <p>Protected by Chave AI Security &bull; {new Date().getFullYear()}</p>
                </div>
            </div>
        </div>
    );
}
