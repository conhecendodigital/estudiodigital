'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, MoreVertical, PlusCircle, LayoutGrid, LayoutList } from 'lucide-react';

export type PostFormat = 'Reels' | 'Carrossel' | 'Story' | 'TikTok' | 'YouTube';
export type PostStatus = 'Planejado' | 'Produção' | 'Publicado';

export interface Post {
    id: string;
    date: Date;
    title: string;
    script: string;
    platform: string;
    format: PostFormat;
    status: PostStatus;
    metrics?: {
        views?: number;
        likes?: number;
        comments?: number;
        shares?: number;
    };
    time?: string;
}

export default function CalendarioClient() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState<Post[]>([
        // Mock data
        {
            id: '1',
            date: new Date(),
            title: 'Estratégia de IA para 2024',
            script: 'Falar sobre como as IAs vão mudar o jogo este ano...',
            platform: 'Instagram',
            format: 'Reels',
            status: 'Planejado',
            time: '10:00',
        }
    ]);

    // Editing State
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    // Form State
    const [formTitle, setFormTitle] = useState('');
    const [formScript, setFormScript] = useState('');
    const [formPlatform, setFormPlatform] = useState('Instagram');
    const [formFormat, setFormFormat] = useState<PostFormat>('Reels');
    const [formStatus, setFormStatus] = useState<PostStatus>('Planejado');
    const [formTime, setFormTime] = useState('12:00');
    // Metrics
    const [formViews, setFormViews] = useState('');
    const [formLikes, setFormLikes] = useState('');
    const [formComments, setFormComments] = useState('');

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const openModal = (date: Date, post?: Post) => {
        setSelectedDate(date);
        if (post) {
            setEditingPost(post);
            setFormTitle(post.title);
            setFormScript(post.script);
            setFormPlatform(post.platform);
            setFormFormat(post.format);
            setFormStatus(post.status);
            setFormTime(post.time || '12:00');
            setFormViews(post.metrics?.views?.toString() || '');
            setFormLikes(post.metrics?.likes?.toString() || '');
            setFormComments(post.metrics?.comments?.toString() || '');
        } else {
            setEditingPost(null);
            setFormTitle('');
            setFormScript('');
            setFormPlatform('Instagram');
            setFormFormat('Reels');
            setFormStatus('Planejado');
            setFormTime('12:00');
            setFormViews('');
            setFormLikes('');
            setFormComments('');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
    };

    const handleSavePost = () => {
        if (!formTitle.trim()) return;

        const dateToSave = selectedDate || new Date();

        const postData: Post = {
            id: editingPost ? editingPost.id : Math.random().toString(36).substr(2, 9),
            date: dateToSave,
            title: formTitle,
            script: formScript,
            platform: formPlatform,
            format: formFormat,
            status: formStatus,
            time: formTime,
            metrics: {
                views: formViews ? parseInt(formViews) : undefined,
                likes: formLikes ? parseInt(formLikes) : undefined,
                comments: formComments ? parseInt(formComments) : undefined,
            }
        };

        if (editingPost) {
            setPosts(posts.map(p => p.id === postData.id ? postData : p));
        } else {
            setPosts([...posts, postData]);
        }

        closeModal();
    };


    const handleDeletePost = (id: string) => {
        setPosts(posts.filter(p => p.id !== id));
        closeModal();
    };

    const renderHeader = () => {
        return (
            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/10 backdrop-blur-md">
                <button onClick={prevMonth} className="size-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-all">
                    <ChevronLeft className="size-5" />
                </button>
                <span className="font-mono text-sm px-4 text-slate-200 capitalize w-48 text-center">
                    {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </span>
                <button onClick={nextMonth} className="size-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-all">
                    <ChevronRight className="size-5" />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Começa na segunda
        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 py-2">
                    {format(addDays(startDate, i), 'EEEE', { locale: ptBR }).split('-')[0]}
                </div>
            );
        }
        return <div className="grid grid-cols-7 gap-4 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                const dayPosts = posts.filter(p => isSameDay(p.date, cloneDay));

                days.push(
                    <div
                        key={day.toString()}
                        className={`min-h-[120px] rounded-xl border p-2 flex flex-col gap-1 transition-all ${isCurrentMonth ? 'bg-white/5 border-white/10 hover:border-primary/50' : 'bg-transparent border-transparent opacity-30'} ${isToday ? 'border-primary/50 bg-primary/5' : ''}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-bold ${isCurrentMonth ? 'text-slate-300' : 'text-slate-600'} ${isToday ? 'text-primary' : ''}`}>
                                {formattedDate}
                                {isToday && <span className="ml-2 text-[8px] bg-primary text-white px-1.5 py-0.5 rounded-full">HOJE</span>}
                            </span>
                            {isCurrentMonth && (
                                <button
                                    onClick={() => openModal(cloneDay)}
                                    className="opacity-0 group-hover:opacity-100 hover:text-primary transition-opacity text-slate-500"
                                >
                                    <PlusCircle className="size-4" />
                                </button>
                            )}
                        </div>

                        {/* List Posts for this day */}
                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[80px] custom-scrollbar pr-1">
                            {dayPosts.map(post => {
                                let formatColor = 'bg-slate-500/20 text-slate-400';
                                let formatBorder = 'border-slate-500/30';

                                switch (post.format) {
                                    case 'Reels': formatColor = 'bg-fuchsia-500/20 text-fuchsia-400'; formatBorder = 'border-fuchsia-500'; break;
                                    case 'Carrossel': formatColor = 'bg-cyan-500/20 text-cyan-400'; formatBorder = 'border-cyan-400'; break;
                                    case 'Story': formatColor = 'bg-pink-500/20 text-pink-400'; formatBorder = 'border-pink-500'; break;
                                    case 'TikTok': formatColor = 'bg-lime-500/20 text-lime-400'; formatBorder = 'border-lime-400'; break;
                                }

                                return (
                                    <div
                                        key={post.id}
                                        onClick={() => openModal(cloneDay, post)}
                                        className={`text-[10px] p-1.5 rounded-md cursor-pointer border-l-2 hover:bg-white/10 transition-colors ${formatBorder} bg-black/20`}
                                    >
                                        <div className="flex justify-between items-start mb-0.5">
                                            <span className={`px-1.5 py-[1px] rounded-[4px] font-bold ${formatColor} truncate max-w-[60px]`}>{post.format}</span>
                                            {post.time && <span className="text-slate-500 font-mono text-[9px]">{post.time}</span>}
                                        </div>
                                        <div className="font-semibold text-slate-200 line-clamp-1">{post.title}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-4 mb-4" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="flex-1">{rows}</div>;
    };

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen overflow-hidden flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col md:ml-[280px] h-screen relative w-full overflow-hidden">
                {/* Background effect */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at top center, rgba(123, 97, 255, 0.1) 0%, transparent 50%)" }}></div>

                {/* Header */}
                <header className="px-8 py-6 flex justify-between items-center shrink-0 border-b border-white/5 bg-background-dark/50 backdrop-blur-sm z-10 w-full">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-bold font-sora tracking-tight text-slate-100 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-3xl">calendar_month</span>
                            Gênesis
                        </h2>
                        <p className="text-sm text-slate-400">Orquestre sua presença digital com precisão cirúrgica.</p>
                    </div>

                    {renderHeader()}
                </header>

                {/* Calendar Board Area */}
                <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar relative z-10 w-full min-w-0">
                    <div className="min-w-[800px] w-full">
                        {renderDays()}
                        {renderCells()}
                    </div>
                </div>

                {/* Side Panel for Event Creation/Editing */}
                {isModalOpen && (
                    <div className="absolute top-0 right-0 bottom-0 w-[400px] bg-sidebar-dark border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                            <div>
                                <h3 className="text-lg font-bold font-sora text-slate-100">{editingPost ? 'Editar Post' : 'Novo Post'}</h3>
                                <p className="text-xs text-primary font-mono">{selectedDate ? format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR }) : ''}</p>
                            </div>
                            <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors size-8 flex items-center justify-center rounded-full hover:bg-white/10">
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Título *</label>
                                <input
                                    type="text"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    placeholder="Ex: Como viralizar no TikTok"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                                />
                            </div>

                            {/* Format & Platform Group */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Formato</label>
                                    <select
                                        value={formFormat}
                                        onChange={(e) => setFormFormat(e.target.value as PostFormat)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                    >
                                        <option value="Reels">Reels</option>
                                        <option value="Carrossel">Carrossel</option>
                                        <option value="Story">Story</option>
                                        <option value="TikTok">TikTok</option>
                                        <option value="YouTube">YouTube</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plataforma</label>
                                    <select
                                        value={formPlatform}
                                        onChange={(e) => setFormPlatform(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                    >
                                        <option value="Instagram">Instagram</option>
                                        <option value="TikTok">TikTok</option>
                                        <option value="YouTube">YouTube</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                    </select>
                                </div>
                            </div>

                            {/* Status & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                                    <select
                                        value={formStatus}
                                        onChange={(e) => setFormStatus(e.target.value as PostStatus)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                    >
                                        <option value="Planejado">Planejado</option>
                                        <option value="Produção">Em Produção</option>
                                        <option value="Publicado">Publicado</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Horário</label>
                                    <input
                                        type="time"
                                        value={formTime}
                                        onChange={(e) => setFormTime(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Script/Content */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                                    Conteúdo / Roteiro
                                    <button className="text-primary hover:text-white flex items-center gap-1 text-[10px] bg-primary/10 px-2 py-0.5 rounded-full transition-colors">
                                        <span className="material-symbols-outlined text-[12px]">auto_awesome</span> Gerar com IA
                                    </button>
                                </label>
                                <textarea
                                    value={formScript}
                                    onChange={(e) => setFormScript(e.target.value)}
                                    placeholder="Escreva a legenda, roteiro do vídeo ou tópicos do carrossel..."
                                    rows={5}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all custom-scrollbar placeholder:text-slate-600 resize-none"
                                />
                            </div>

                            {/* Metrics Section (Only show if status is published or editing existing) */}
                            {formStatus === 'Publicado' && (
                                <div className="pt-4 border-t border-white/5 space-y-4">
                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[14px] text-green-400">monitoring</span>
                                        Métricas de Performance
                                    </h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-slate-500 uppercase">Visualizações</label>
                                            <input type="number" value={formViews} onChange={(e) => setFormViews(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200" placeholder="0" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-slate-500 uppercase">Curtidas</label>
                                            <input type="number" value={formLikes} onChange={(e) => setFormLikes(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200" placeholder="0" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-slate-500 uppercase">Comentários</label>
                                            <input type="number" value={formComments} onChange={(e) => setFormComments(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200" placeholder="0" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-white/5 bg-black/20 flex gap-3">
                            {editingPost && (
                                <button
                                    onClick={() => handleDeletePost(editingPost.id)}
                                    className="px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold transition-all text-sm flex items-center justify-center shrink-0"
                                    title="Excluir"
                                >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            )}
                            <button
                                onClick={closeModal}
                                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-bold transition-all text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSavePost}
                                disabled={!formTitle.trim()}
                                className="flex-1 py-3 rounded-xl bg-primary text-white font-bold transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                Salvar
                            </button>
                        </div>
                    </div>
                )}

                {/* Overlay when modal is open on small screens */}
                {isModalOpen && (
                    <div className="absolute inset-0 bg-black/50 z-40 backdrop-blur-sm md:hidden" onClick={closeModal}></div>
                )}

            </main>
        </div>
    );
}
