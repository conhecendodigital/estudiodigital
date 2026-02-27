'use client';

import React, { useState, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import { Camera, Save, User, UserCircle, Briefcase, Share2, MessageSquare, Diamond } from 'lucide-react';

export default function PerfilPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImage, setProfileImage] = useState("url('https://lh3.googleusercontent.com/aida-public/AB6AXuDh6bHL3BwS1lm1TBMgged5oOIBj6DUMQNn6P7yfQZMxDg6zoiHfRD2hBwZ4ZbDV-H5JzfHCN_88ONPW0zczvb3TpDr-NTPnf2WZelACDlbStc1lrOe2UX59nAPk0ryt6rMicNkB49_RT1dpqakVDH_ND9CwCQG1xh_w7aGVmGaePcpIQGqPBvHNYZwyOb4abmuYXr1OA4s1q_XltQuxYcQoO-a5jkPvq2HlR8wCps_oaaFynNRbZ9TYtizP_uVJIlYtdHu_H1n8GU')");

    // Mock data for the 13 onboarding questions
    const [onboardingData, setOnboardingData] = useState<Record<string, string>>({
        nicho: 'Marketing Digital',
        domina: 'Instagram para negócios locais',
        experiencias: 'Graduação em Marketing, experiência de 5 anos em agências',
        resultados: 'Mais de 10.000 alunos formados',
        diferencial: 'Na minha área de marketing digital, eu sempre foco em entregar conteúdo prático e autêntico.',
        publico: 'Empreendedores digitais entre 25-40 anos',
        dor: 'Falta de tempo para criar conteúdo consistente.',
        tentativas: 'Comprar cursos de marketing vagos ou delegar para agências',
        concorrentes: '1. Agência X\n2. Mentor Y',
        proposito: 'Quero escalar minhas vendas de forma orgânica.',
        tempo: '1_hora',
        receio: 'Tenho um pouco de dificuldade com a câmera no início.',
        restricoes: 'Política partidária, fofocas, termos técnicos excessivos'
    });

    const updateOnboarding = (key: string, value: string) => {
        setOnboardingData(prev => ({ ...prev, [key]: value }));
    };

    const ONBOARDING_FIELDS = [
        { id: 'nicho', label: 'Qual é o seu nicho ou área de atuação?', type: 'text' },
        { id: 'domina', label: 'Qual assunto específico você domina?', type: 'text' },
        { id: 'experiencias', label: 'Quais são suas formações e experiências?', type: 'textarea' },
        { id: 'resultados', label: 'Qual resultado você já conquistou?', type: 'textarea' },
        { id: 'diferencial', label: 'O que te diferencia dos outros?', type: 'textarea' },
        { id: 'publico', label: 'Para quem você quer falar?', type: 'textarea' },
        { id: 'dor', label: 'Qual a maior dor ou problema dessa pessoa?', type: 'textarea' },
        { id: 'tentativas', label: 'O que essa pessoa já tentou e não funcionou?', type: 'textarea' },
        { id: 'concorrentes', label: 'Liste 5 concorrentes ou referências do seu nicho', type: 'textarea' },
        { id: 'proposito', label: 'Qual seu propósito em crescer nas redes?', type: 'textarea' },
        {
            id: 'tempo', label: 'Quanto tempo por dia pode dedicar?', type: 'select',
            options: [
                { label: '30 minutos', value: '30_min' },
                { label: '1 hora', value: '1_hora' },
                { label: '2 horas', value: '2_horas' },
                { label: 'Mais de 2 horas', value: '2_horas_plus' }
            ]
        },
        { id: 'receio', label: 'Tem algum receio em gravar ou aparecer?', type: 'textarea' },
        { id: 'restricoes', label: 'O que você NÃO quer falar?', type: 'textarea' }
    ];

    // Load from localStorage on mount
    React.useEffect(() => {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            setProfileImage(`url('${savedImage}')`);
        }
    }, []);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfileImage(`url('${base64String}')`);
                localStorage.setItem('profileImage', base64String);

                // Dispatch a custom event to notify other components (like Sidebar)
                window.dispatchEvent(new Event('profileImageUpdated'));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen overflow-hidden flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col md:ml-[280px] h-screen relative w-full overflow-hidden">
                {/* Background effect */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at top right, rgba(123, 97, 255, 0.15) 0%, transparent 60%)" }}></div>

                {/* Header Section */}
                <header className="px-8 py-8 flex items-end justify-between shrink-0 border-b border-white/5 bg-background-dark/50 backdrop-blur-sm z-10 w-full">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-4xl font-bold font-sora tracking-tight text-slate-100 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-4xl">account_circle</span>
                            Meu Perfil
                        </h2>
                        <p className="text-lg font-serif italic text-slate-400 opacity-80 mt-1">Gerencie sua identidade digital e preferências da IA.</p>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 w-full">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24">

                        {/* Left Column: Avatar & Summary */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Avatar Card */}
                            <div className="glass-card rounded-2xl p-8 flex flex-col items-center text-center border border-white/10 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="relative mb-6">
                                    <div className="w-32 h-32 rounded-full border-4 border-primary/20 p-1 relative">
                                        <div
                                            className="w-full h-full rounded-full bg-cover bg-center overflow-hidden relative group"
                                            style={{ backgroundImage: profileImage }}
                                            onClick={handleImageClick}
                                        >
                                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                                                <Camera className="text-white size-8 mb-1" />
                                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Alterar</span>
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-background-dark rounded-full"></div>
                                </div>
                                <h3 className="text-xl font-bold font-sora text-white mb-2">Mariana Silva</h3>
                                <p className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider font-bold mb-4">Admin Master</p>
                                <p className="text-sm text-slate-400 italic">"Transformando conteúdo em conexões reais."</p>
                            </div>

                            {/* Plan Card */}
                            <div className="bg-gradient-to-br from-primary/20 to-accent-neon/20 rounded-2xl p-6 border border-primary/30 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-50">
                                    <Diamond className="size-10 text-primary" />
                                </div>
                                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Seu Plano Atual</h4>
                                <div className="flex items-end gap-2 mb-4">
                                    <span className="text-3xl font-black font-sora text-white">PRO</span>
                                    <span className="text-slate-400 text-sm mb-1">/ mensal</span>
                                </div>
                                <button className="w-full bg-white text-background-dark font-bold text-sm py-3 rounded-lg hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                    Fazer Upgrade
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Profile Forms */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Section 1: Personal Info */}
                            <div className="glass-card rounded-2xl p-8 border border-white/10">
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                                    <div className="bg-primary/20 p-2 text-primary rounded-lg flex items-center justify-center">
                                        <User className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold font-sora text-slate-100">Informações Pessoais</h3>
                                        <p className="text-xs text-slate-400 mt-1">Como você e seus Agentes IA irão se referir a você.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome Completo</label>
                                        <input type="text" defaultValue="Mariana Silva" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gênero</label>
                                        <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none">
                                            <option>Feminino</option>
                                            <option>Masculino</option>
                                            <option>Não-binário</option>
                                            <option>Prefiro não informar</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                                        Bio (Apresentação Profissional)
                                        <span className="text-slate-500 font-normal">Máx 150 caracteres</span>
                                    </label>
                                    <textarea rows={4} defaultValue="Especialista em Estratégias Digitais ajudando marcas a encontrar a sua voz única na era da Inteligência Artificial. Criadora do Método Chave." className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all custom-scrollbar resize-none" />
                                </div>
                            </div>

                            {/* Section 2: Social Media */}
                            <div className="glass-card rounded-2xl p-8 border border-white/10">
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                                    <div className="bg-fuchsia-500/20 p-2 text-fuchsia-400 rounded-lg flex items-center justify-center">
                                        <Share2 className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold font-sora text-slate-100">Presença Digital</h3>
                                        <p className="text-xs text-slate-400 mt-1">Conecte suas redes para os Agentes IA analisarem seu conteúdo.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><span className="text-pink-500 font-black">@</span> Instagram</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-slate-500 font-bold">@</span>
                                            <input type="text" defaultValue="mari.digital" className="w-full bg-black/20 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><span className="text-cyan-400 font-black">@</span> TikTok</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-slate-500 font-bold">@</span>
                                            <input type="text" defaultValue="maridivulga" className="w-full bg-black/20 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><span className="text-red-500 font-black">▶</span> YouTube</label>
                                        <input type="text" defaultValue="youtube.com/maridigal" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><span className="text-blue-400 font-black">in</span> LinkedIn</label>
                                        <input type="text" placeholder="URL do Perfil" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Onboarding Answers (Brand Identity) */}
                            <div className="glass-card rounded-2xl p-8 border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent-neon opacity-70"></div>

                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5 pl-2">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-lime-500/20 p-2 text-lime-400 rounded-lg flex items-center justify-center">
                                            <Briefcase className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold font-sora text-slate-100">Identidade da Marca (Onboarding)</h3>
                                            <p className="text-xs text-slate-400 mt-1">Todas as suas respostas da configuração inicial. <span className="text-primary font-bold">Ajuste conforme sua marca evolui.</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pl-2">
                                    {ONBOARDING_FIELDS.map((field, index) => (
                                        <div key={field.id} className="space-y-2 bg-black/20 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                            <label className="text-sm font-bold text-slate-300 flex flex-col gap-1 leading-relaxed">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="bg-primary/20 text-primary w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black shrink-0">{index + 1}</span>
                                                    <span>{field.label}</span>
                                                </div>
                                            </label>

                                            {field.type === 'text' && (
                                                <input
                                                    type="text"
                                                    value={onboardingData[field.id]}
                                                    onChange={(e) => updateOnboarding(field.id, e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                />
                                            )}

                                            {field.type === 'textarea' && (
                                                <textarea
                                                    rows={field.id === 'concorrentes' ? 6 : 3}
                                                    value={onboardingData[field.id]}
                                                    onChange={(e) => updateOnboarding(field.id, e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all custom-scrollbar resize-y"
                                                />
                                            )}

                                            {field.type === 'select' && field.options && (
                                                <select
                                                    value={onboardingData[field.id]}
                                                    onChange={(e) => updateOnboarding(field.id, e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                                >
                                                    {field.options.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sticky Save Action */}
                            <div className="sticky bottom-0 pt-4 pb-8 flex justify-end">
                                <button className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(123,97,255,0.4)] px-8 py-4 rounded-xl font-bold transition-all text-sm flex items-center gap-3 group">
                                    <Save className="size-5 group-hover:scale-110 transition-transform" />
                                    <span>Salvar Alterações</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
