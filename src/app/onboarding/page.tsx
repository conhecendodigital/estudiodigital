'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

type OnboardingStep = {
    id: number;
    icon: string | React.ReactNode;
    title: React.ReactNode;
    subtitle?: string | React.ReactNode;
    type: 'text' | 'textarea' | 'options';
    stateKey: string;
    placeholder?: string;
    options?: { label: string; description: string; value: string }[];
};

const STEPS: OnboardingStep[] = [
    {
        id: 1,
        icon: <div className="size-20 md:size-24 bg-[#1e1b2e] rounded-full flex items-center justify-center border border-white/5 glowing-icon shadow-[0_0_40px_rgba(123,97,255,0.2)]">🎯</div>,
        title: <>Qual é o seu <span className="text-primary">nicho</span> ou área de atuação?</>,
        subtitle: 'Ex: Marketing Digital, Finanças, Saúde, Beleza...',
        type: 'text',
        stateKey: 'nicho',
        placeholder: 'Digite sua especialidade...'
    },
    {
        id: 2,
        icon: <div className="size-20 md:size-24 bg-[#1e1b2e] rounded-full flex items-center justify-center border border-white/5 glowing-icon shadow-[0_0_40px_rgba(123,97,255,0.2)]">💡</div>,
        title: <>Qual assunto específico você <span className="italic font-serif text-primary">domina</span>?</>,
        subtitle: 'Ex: Instagram para negócios locais, emagrecimento pós-parto, finanças para freelancers...',
        type: 'text',
        stateKey: 'domina',
        placeholder: 'Digite o seu nicho ou especialidade...'
    },
    {
        id: 3,
        icon: <div className="size-20 md:size-24 bg-[#1e1b2e] rounded-full flex items-center justify-center border border-white/5 glowing-icon shadow-[0_0_40px_rgba(123,97,255,0.2)]">🎓</div>,
        title: <>Quais são suas formações <br className="hidden md:block" /> e experiências?</>,
        type: 'textarea',
        stateKey: 'experiencias',
        placeholder: 'Ex: Graduação em Marketing, experiência de 5 anos em agências...'
    },
    {
        id: 4,
        icon: <div className="size-20 md:size-24 bg-[#1e1b2e] rounded-full flex items-center justify-center border border-white/5 glowing-icon shadow-[0_0_40px_rgba(123,97,255,0.2)]">🏆</div>,
        title: 'Qual resultado você já conquistou?',
        type: 'textarea',
        stateKey: 'resultados',
        placeholder: 'Ex: Mais de 10.000 alunos formados, 1 milhão em faturamento...'
    },
    {
        id: 5,
        icon: <div className="size-20 md:size-24 bg-[#1e1b2e] rounded-full flex items-center justify-center border border-white/5 shadow-[0_0_40px_rgba(123,97,255,0.2)]"><span className="material-symbols-outlined text-4xl md:text-5xl text-yellow-500">bolt</span></div>,
        title: <>O que te diferencia <span className="text-primary">dos outros?</span></>,
        subtitle: 'Sua autenticidade é o que conecta. Qual a sua marca registrada?',
        type: 'textarea',
        stateKey: 'diferencial',
        placeholder: 'Minha história e método único de ensino.'
    },
    {
        id: 6,
        icon: <div className="size-20 md:size-24 bg-[#1e1b2e] rounded-full flex items-center justify-center border border-white/5 glowing-icon shadow-[0_0_40px_rgba(123,97,255,0.2)]">🗣️</div>,
        title: 'Para quem você quer falar?',
        type: 'textarea',
        stateKey: 'publico',
        placeholder: 'Ex: Empreendedores digitais entre 25-40 anos que buscam automatizar processos...'
    },
    {
        id: 7,
        icon: <div className="size-20 md:size-24 bg-[#1e1b2e] rounded-full flex items-center justify-center border border-white/5 glowing-icon shadow-[0_0_40px_rgba(123,97,255,0.2)]">💔</div>,
        title: <>Qual a maior dor ou <span className="text-primary italic font-serif lowercase text-5xl md:text-6xl">problema</span> dessa pessoa?</>,
        type: 'textarea',
        stateKey: 'dor',
        placeholder: 'Ex: Falta de tempo para criar conteúdo consistente.'
    },
    {
        id: 8,
        icon: <div className="size-20 md:size-24 bg-[#1e1b2e] rounded-full flex items-center justify-center border border-white/5 glowing-icon shadow-[0_0_40px_rgba(123,97,255,0.2)]">🧱</div>,
        title: <>O que essa pessoa já tentou <br className="hidden md:block" /> e <span className="text-primary italic font-serif">não funcionou?</span></>,
        type: 'textarea',
        stateKey: 'tentativas',
        placeholder: 'Ex: Comprar cursos de marketing vagos ou delegar para agências...'
    },
    {
        id: 9,
        icon: <div className="size-20 md:size-24 bg-[#1e1b2e] rounded-full flex items-center justify-center border border-white/5 glowing-icon shadow-[0_0_40px_rgba(123,97,255,0.2)]">🔍</div>,
        title: <>Liste <span className="text-primary">5 concorrentes</span> ou referências do seu nicho</>,
        type: 'textarea',
        stateKey: 'concorrentes',
        placeholder: '1. \n2. \n3. \n4. \n5.'
    },
    {
        id: 10,
        icon: <div className="size-20 md:size-24 bg-[#1e1b2e] rounded-full flex items-center justify-center border border-white/5 glowing-icon shadow-[0_0_40px_rgba(123,97,255,0.2)]">🚀</div>,
        title: <>Qual seu propósito em <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 italic font-serif">crescer nas redes?</span></>,
        type: 'textarea',
        stateKey: 'proposito',
        placeholder: 'Ex: Quero escalar minhas vendas de forma orgânica.'
    },
    {
        id: 11,
        icon: <div className="size-20 md:size-24 bg-[#1e1b2e] rounded-full flex items-center justify-center border border-white/5 shadow-[0_0_40px_rgba(123,97,255,0.2)]"><span className="material-symbols-outlined text-4xl md:text-5xl text-primary">schedule</span></div>,
        title: 'Quanto tempo por dia pode dedicar?',
        subtitle: 'Seja honesta — isso vai definir seu ritmo de publicação dentro do ecossistema.',
        type: 'options',
        stateKey: 'tempo',
        options: [
            { label: '30 minutos', description: 'Foco em agilidade e essencial.', value: '30_min' },
            { label: '1 hora', description: 'Equilíbrio ideal para crescimento.', value: '1_hora' },
            { label: '2 horas', description: 'Aceleração máxima de resultados.', value: '2_horas' },
            { label: 'Mais de 2 horas', description: 'Dominação total do mercado.', value: '2_horas_plus' }
        ]
    },
    {
        id: 12,
        icon: <div className="size-20 md:size-24 bg-[#1e1b2e] rounded-full flex items-center justify-center border border-white/5 glowing-icon shadow-[0_0_40px_rgba(123,97,255,0.2)]">😰</div>,
        title: <>Tem algum receio em <span className="text-primary italic font-serif">gravar</span> ou aparecer?</>,
        subtitle: 'Vergonha, medo de julgamento, não saber o que falar... Nos conte o que trava você para podermos ajudar.',
        type: 'textarea',
        stateKey: 'receio',
        placeholder: 'Escreva livremente aqui sobre seus obstáculos...'
    },
    {
        id: 13,
        icon: <div className="size-20 md:size-24 bg-[#1e1b2e] rounded-full flex items-center justify-center border border-white/5 glowing-icon shadow-[0_0_40px_rgba(239,68,68,0.2)]">🚫</div>,
        title: <>O que você <span className="text-primary">NÃO</span> quer falar?</>,
        subtitle: 'Temas que você não quer abordar por princípio ou preferência. Suas restrições moldam a personalidade da sua chave.',
        type: 'textarea',
        stateKey: 'restricoes',
        placeholder: 'Ex: Política partidária, fofocas, termos técnicos excessivos...'
    }
];

export default function OnboardingPage() {
    // 1 to 13 are the steps. 14 is the Success screen.
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Record<string, string>>({});

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const updateForm = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const currentStepConfig = STEPS.find(s => s.id === step);

    return (
        <div className="bg-background-dark font-display text-slate-100 antialiased overflow-x-hidden min-h-screen relative z-0">
            {/* Background Effects */}
            <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-50 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]"></div>

            <div className="flex h-screen w-full flex-col md:flex-row">
                {/* Sidebar (Only show on Config Steps, hide on mobile) */}
                {step <= 13 && (
                    <aside className="hidden md:flex w-80 bg-sidebar-dark border-r border-white/5 flex-col p-8 z-10 relative shrink-0">
                        <div className="flex flex-col gap-10">
                            <div className="flex items-center gap-3">
                                <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-[0_0_20px_2px_rgba(123,97,255,0.4)]">
                                    <span className="material-symbols-outlined text-xl">key</span>
                                </div>
                                <h2 className="text-xl font-bold tracking-tight font-sora text-white">chave.ai</h2>
                            </div>

                            <div className="space-y-6 flex-1">
                                <h3 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Configuração</h3>
                                <nav className="space-y-2">
                                    <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl text-primary">
                                        <div className="size-6 rounded-md bg-primary/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm">person</span>
                                        </div>
                                        <span className="text-sm font-semibold">Perfil & Nicho</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-3 text-slate-500 opacity-50">
                                        <div className="size-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm">verified</span>
                                        </div>
                                        <span className="text-sm font-medium">Diferenciais</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-3 text-slate-500 opacity-50">
                                        <div className="size-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm">brush</span>
                                        </div>
                                        <span className="text-sm font-medium">Identidade</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-3 text-slate-500 opacity-50">
                                        <div className="size-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm">hub</span>
                                        </div>
                                        <span className="text-sm font-medium">Integrações</span>
                                    </div>
                                </nav>
                            </div>

                            {/* Progress Footer */}
                            <div className="mt-auto p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progresso Geral</span>
                                    <span className="text-xs font-bold text-primary">{Math.round((step / 13) * 100)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-primary rounded-full shadow-[0_0_10px_#7b61ff] transition-all duration-500" style={{ width: `${(step / 13) * 100}%` }}></div>
                                </div>
                                <p className="text-[10px] text-primary/60 font-medium uppercase">ETAPA {step} DE 13</p>
                            </div>
                        </div>
                    </aside>
                )}

                <main className={`flex-1 flex flex-col relative overflow-y-auto custom-scrollbar ${step > 13 ? 'bg-background-dark' : ''}`}>

                    {/* Topbar for Steps 1-13 */}
                    {step <= 13 && (
                        <header className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/5 z-20 bg-background-dark/80 backdrop-blur-md sticky top-0 shrink-0">
                            <button
                                onClick={step > 1 ? handlePrev : undefined}
                                className={`flex items-center gap-2 text-slate-400 hover:text-white transition-colors group ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                                <span className="font-medium text-sm hidden sm:inline">Voltar</span>
                            </button>
                            <div className="flex items-center gap-4 md:gap-6 flex-1 max-w-md mx-4 md:mx-12">
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest hidden md:inline">Etapa {(step).toString().padStart(2, '0')}</span>
                                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_10px_#7b61ff]" style={{ width: `${(step / 13) * 100}%` }}></div>
                                </div>
                                <span className="text-primary text-[10px] font-bold tracking-widest">{(step).toString().padStart(2, '0')} / 13</span>
                            </div>
                            <div className="size-10 flex items-center justify-center rounded-full border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">help</span>
                            </div>
                        </header>
                    )}

                    {/* Dynamic Steps 1-13 */}
                    {step <= 13 && currentStepConfig && (
                        <section className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-12 md:pb-24 max-w-4xl mx-auto w-full relative z-10 transition-all duration-500 min-h-[60vh] md:min-h-[80vh]">
                            {/* Decorative Blur Backgrounds */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/10 blur-[100px] md:blur-[120px] rounded-full -z-10 pointer-events-none"></div>

                            {/* Icon */}
                            <div className="mb-8 md:mb-12 relative text-4xl sm:text-5xl md:text-6xl text-center">
                                {currentStepConfig.icon}
                            </div>

                            {/* Headings */}
                            <div className="text-center space-y-3 mb-8 md:mb-12 w-full px-2">
                                <h1 className="font-sora text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                                    {currentStepConfig.title}
                                </h1>
                                {currentStepConfig.subtitle && (
                                    <p className="text-sm md:text-lg text-slate-400 font-display mt-4">
                                        {currentStepConfig.subtitle}
                                    </p>
                                )}
                            </div>

                            {/* Input Render Logic based on config type */}
                            <div className="w-full max-w-2xl px-2 relative group mb-8">
                                {currentStepConfig.type === 'text' && (
                                    <input
                                        type="text"
                                        className="w-full h-16 md:h-20 bg-black/40 backdrop-blur-xl border border-white/10 focus:border-primary px-6 md:px-8 text-lg md:text-xl text-white rounded-2xl md:rounded-[2rem] shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-display"
                                        placeholder={currentStepConfig.placeholder}
                                        value={formData[currentStepConfig.stateKey] || ''}
                                        onChange={(e) => updateForm(currentStepConfig.stateKey, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleNext();
                                        }}
                                        autoFocus
                                    />
                                )}

                                {currentStepConfig.type === 'textarea' && (
                                    <div className="relative">
                                        <textarea
                                            className="w-full bg-[#0a0a14]/60 backdrop-blur-xl border border-white/10 focus:border-primary text-lg md:text-xl text-slate-200 rounded-2xl md:rounded-[2rem] p-6 md:p-8 min-h-[140px] md:min-h-[160px] shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all resize-none font-display placeholder:text-slate-600"
                                            placeholder={currentStepConfig.placeholder}
                                            value={formData[currentStepConfig.stateKey] || ''}
                                            onChange={(e) => updateForm(currentStepConfig.stateKey, e.target.value)}
                                            autoFocus
                                        ></textarea>
                                        <div className="absolute bottom-4 right-6 text-xs text-slate-500 font-medium bg-black/50 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
                                            Mínimo 20 caracteres
                                        </div>
                                    </div>
                                )}

                                {currentStepConfig.type === 'options' && currentStepConfig.options && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentStepConfig.options.map((opt, idx) => {
                                            const isSelected = formData[currentStepConfig.stateKey] === opt.value;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => updateForm(currentStepConfig.stateKey, opt.value)}
                                                    className={`group relative flex items-center p-6 bg-sidebar-dark rounded-xl border ${isSelected ? 'border-primary shadow-[0_0_20px_rgba(123,97,255,0.3)]' : 'border-white/5 hover:border-primary/50'} transition-all text-left w-full`}
                                                >
                                                    <div className="flex-1">
                                                        <h3 className="text-white text-lg font-sora font-semibold">{opt.label}</h3>
                                                        <p className="text-slate-500 text-xs mt-1">{opt.description}</p>
                                                    </div>
                                                    <div className={`size-6 rounded-full border-2 ${isSelected ? 'border-primary' : 'border-white/10 group-hover:border-primary'} transition-colors flex items-center justify-center shrink-0 ml-4`}>
                                                        <div className={`size-3 rounded-full bg-primary transition-transform ${isSelected ? 'scale-100' : 'scale-0 group-hover:scale-100'}`}></div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleNext}
                                className="bg-primary hover:bg-primary/90 text-white font-sora font-semibold md:font-bold px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl flex items-center gap-3 text-base md:text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_10px_40px_-5px_rgba(123,97,255,0.5)] group min-w-[200px] justify-center"
                            >
                                Continuar
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </section>
                    )}

                    {/* Step 14: Success Mode (After all questions) */}
                    {step === 14 && (
                        <div className="w-full min-h-screen relative flex items-center justify-center p-4 md:p-8 bg-background-dark z-0 overflow-hidden">
                            {/* Decorative bg elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
                            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10"></div>

                            <div className="max-w-4xl w-full text-center relative z-10 px-4 md:px-0">
                                {/* Success Icon Animation */}
                                <div className="size-20 md:size-28 lg:size-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-12 shadow-[0_0_100px_rgba(123,97,255,0.4)] border border-primary/30 relative">
                                    <div className="absolute inset-0 border-2 border-primary border-t-transparent border-r-transparent rounded-full animate-[spin_3s_linear_infinite] opacity-50"></div>
                                    <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-primary rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(123,97,255,0.8)]">
                                        <Check className="text-white w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 animate-bounce" />
                                    </div>
                                </div>

                                <h1 className="font-sora text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-[1.1]">
                                    Tudo pronto, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 italic">Mariana!</span>
                                </h1>
                                <p className="text-lg md:text-xl lg:text-2xl text-slate-300 font-display mb-10 max-w-2xl mx-auto px-2">
                                    Suas preferências foram sincronizadas com a IA. Seu ecossistema personalizado já está sendo gerado.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
                                    {[
                                        { title: 'Nicho Definido', val: formData.nicho || 'Definido', icon: '🎯' },
                                        { title: 'Tom de Voz', val: 'Identificado', icon: '🗣️' },
                                        { title: 'Diferencial', val: 'Extraído', icon: '⚡' }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm text-left hover:bg-white/10 transition-colors">
                                            <div className="text-xl md:text-2xl mb-2">{item.icon}</div>
                                            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{item.title}</p>
                                            <p className="text-sm md:text-base text-white font-medium truncate">{item.val}</p>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/" className="inline-flex items-center justify-center gap-3 bg-white text-background-dark font-sora font-bold text-base md:text-lg px-8 md:px-12 py-4 md:py-6 rounded-full hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)] min-w-[240px] sm:min-w-[280px]">
                                    Acessar meu Dashboard
                                    <span className="material-symbols-outlined font-light transition-transform group-hover:translate-x-1">arrow_forward</span>
                                </Link>

                                <div className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay opacity-30 select-none">
                                    {/* Grain pseudo-background via root CSS if preferred, or custom svg noise */}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
