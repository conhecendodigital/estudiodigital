'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ConfiguracoesPage() {
    const { profile, user, signOut } = useAuth();
    const supabase = createClient();
    const router = useRouter();

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Notification toggles
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(false);

    // Delete account state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
    const [deleting, setDeleting] = useState(false);

    // Credits
    const creditsAvailable = profile?.credits_available || 0;
    const creditsTotal = profile?.credits_total || 2000;
    const creditsPercent = Math.min(100, (creditsAvailable / creditsTotal) * 100);

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            setPasswordMsg({ type: 'error', text: 'Preencha todos os campos.' });
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMsg({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMsg({ type: 'error', text: 'As senhas não coincidem.' });
            return;
        }

        setPasswordSaving(true);
        setPasswordMsg(null);

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            setPasswordMsg({ type: 'error', text: error.message });
        } else {
            setPasswordMsg({ type: 'success', text: 'Senha alterada com sucesso!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
        setPasswordSaving(false);
        setTimeout(() => setPasswordMsg(null), 5000);
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmEmail !== user?.email) return;

        setDeleting(true);
        try {
            // Delete profile data first
            if (user?.id) {
                await supabase.from('chat_messages').delete().eq('session_id',
                    supabase.from('chat_sessions').select('id').eq('user_id', user.id)
                );
                await supabase.from('chat_sessions').delete().eq('user_id', user.id);
                await supabase.from('vault_references').delete().eq('user_id', user.id);
                await supabase.from('profiles').delete().eq('id', user.id);
            }

            // Sign out (actual auth deletion requires admin API or edge function)
            await signOut();
            router.push('/login');
        } catch (err) {
            console.error('Error deleting account:', err);
            alert('Erro ao excluir conta. Tente novamente.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-row bg-background-dark font-display text-slate-100">
            <Sidebar />

            <main className="flex-1 md:ml-[280px] h-screen overflow-y-auto">
                {/* Header */}
                <header className="sticky top-0 z-40 flex items-center justify-between border-b border-primary/10 bg-background-dark/80 backdrop-blur-md px-6 md:px-10 py-4">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary text-2xl">settings</span>
                        <h2 className="text-slate-100 text-xl font-sora font-extrabold leading-tight tracking-tight">Configurações</h2>
                    </div>
                </header>

                <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8 pb-24">

                    {/* ───── 1. PLANO & CRÉDITOS ───── */}
                    <section className="rounded-2xl border border-white/10 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/20 to-accent-neon/10 p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">diamond</span>
                                <h3 className="text-lg font-sora font-bold text-white">Plano & Créditos</h3>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md p-6 space-y-6">
                            {/* Plan info */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Plano Atual</p>
                                    <p className="text-2xl font-sora font-black text-white">
                                        {profile?.role === 'premium' ? 'PRO' : 'Gratuito'}
                                    </p>
                                </div>
                                <Link href="/planos" className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(123,97,255,0.3)] transition-all">
                                    Fazer Upgrade
                                </Link>
                            </div>

                            {/* Credits bar */}
                            <div className="bg-black/20 rounded-xl p-5 border border-white/5">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm text-slate-300 font-medium">Créditos disponíveis</span>
                                    <span className="text-sm font-mono text-primary font-bold">
                                        {creditsAvailable.toLocaleString('pt-BR')} / {creditsTotal.toLocaleString('pt-BR')}
                                    </span>
                                </div>
                                <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-primary to-[#9d50bb] transition-all duration-500"
                                        style={{ width: `${creditsPercent}%` }}
                                    />
                                </div>
                                {profile?.credits_renewal_date && (
                                    <p className="text-xs text-slate-500 mt-2">
                                        Renova em {new Date(profile.credits_renewal_date).toLocaleDateString('pt-BR')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ───── 2. SEGURANÇA ───── */}
                    <section className="rounded-2xl border border-white/10 overflow-hidden">
                        <div className="bg-white/5 p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-emerald-400">shield</span>
                                <h3 className="text-lg font-sora font-bold text-white">Segurança</h3>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] p-6 space-y-6">
                            {/* Email display */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">E-mail da conta</label>
                                <div className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-xl px-4 py-3">
                                    <span className="material-symbols-outlined text-slate-500 text-lg">mail</span>
                                    <span className="text-sm text-slate-300">{user?.email || '—'}</span>
                                    <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase">Verificado</span>
                                </div>
                            </div>

                            {/* Password change */}
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alterar Senha</label>

                                <input
                                    type="password"
                                    placeholder="Nova senha"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirmar nova senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                />

                                {passwordMsg && (
                                    <div className={`text-sm px-4 py-2 rounded-lg ${passwordMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {passwordMsg.text}
                                    </div>
                                )}

                                <button
                                    onClick={handleChangePassword}
                                    disabled={passwordSaving || !newPassword || !confirmPassword}
                                    className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {passwordSaving ? 'Alterando...' : 'Alterar Senha'}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* ───── 3. NOTIFICAÇÕES ───── */}
                    <section className="rounded-2xl border border-white/10 overflow-hidden">
                        <div className="bg-white/5 p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-amber-400">notifications</span>
                                <h3 className="text-lg font-sora font-bold text-white">Notificações</h3>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] p-6 space-y-5">
                            <div className="flex items-center justify-between gap-4 py-2">
                                <div>
                                    <p className="font-medium text-slate-200">Notificações por E-mail</p>
                                    <p className="text-sm text-slate-500 mt-0.5">Resumos semanais e novos recursos.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input type="checkbox" className="sr-only peer" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
                                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:shadow-[0_0_10px_rgba(123,97,255,0.6)]"></div>
                                </label>
                            </div>

                            <div className="border-t border-white/5" />

                            <div className="flex items-center justify-between gap-4 py-2">
                                <div>
                                    <p className="font-medium text-slate-200">Push Mobile</p>
                                    <p className="text-sm text-slate-500 mt-0.5">Alertas quando a IA completar tarefas.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input type="checkbox" className="sr-only peer" checked={pushNotif} onChange={() => setPushNotif(!pushNotif)} />
                                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:shadow-[0_0_10px_rgba(123,97,255,0.6)]"></div>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* ───── 4. ZONA DE PERIGO ───── */}
                    <section className="rounded-2xl border border-red-500/20 overflow-hidden">
                        <div className="bg-red-500/5 p-6 border-b border-red-500/10">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-400">warning</span>
                                <h3 className="text-lg font-sora font-bold text-red-400">Zona de Perigo</h3>
                            </div>
                        </div>

                        <div className="bg-red-500/[0.02] p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-medium text-slate-200">Excluir minha conta</p>
                                    <p className="text-sm text-slate-500 mt-0.5">Todos os dados, conversas e referências serão removidos permanentemente.</p>
                                </div>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="px-5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all shrink-0"
                                >
                                    Excluir Conta
                                </button>
                            </div>
                        </div>
                    </section>

                </div>

                {/* ───── MODAL DE EXCLUSÃO ───── */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div className="bg-surface-dark border border-red-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <span className="material-symbols-outlined text-red-400 text-2xl">delete_forever</span>
                                </div>
                                <h3 className="text-xl font-sora font-bold text-white">Excluir Conta</h3>
                            </div>

                            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 mb-6">
                                <p className="text-sm text-red-300 leading-relaxed">
                                    <strong>Atenção:</strong> Esta ação é irreversível. Todos os seus dados serão excluídos permanentemente, incluindo:
                                </p>
                                <ul className="text-sm text-red-300/80 mt-2 space-y-1 ml-4">
                                    <li>• Conversas com agentes</li>
                                    <li>• Referências do Cofre</li>
                                    <li>• Dados do perfil e onboarding</li>
                                    <li>• Posts do calendário</li>
                                </ul>
                            </div>

                            <div className="space-y-2 mb-6">
                                <label className="text-sm text-slate-400">
                                    Digite <span className="font-mono text-red-400 font-bold">{user?.email}</span> para confirmar:
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmEmail}
                                    onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="w-full bg-black/30 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowDeleteModal(false); setDeleteConfirmEmail(''); }}
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold text-sm hover:bg-white/10 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmEmail !== user?.email || deleting}
                                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    {deleting ? 'Excluindo...' : 'Excluir Permanentemente'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
