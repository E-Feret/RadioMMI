"use client";

import Link from "next/link";
import { ChevronRight, Calendar, Clock, Radio, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Anton } from 'next/font/google';

const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap' });

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const SHORT_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const COLORS = [
    "bg-oxy-orange", "bg-purple-500", "bg-blue-500", "bg-pink-500", "bg-green-500", "bg-cyan-500"
];

const CONCEPTS = [
    {
        id: 'matinale',
        keywords: ['matinale', 'morning', 'reveil', 'réveil'],
        border: 'border-[#8e44ad]',
        hex: '#8e44ad',
        starColor: 'violet',
        label: 'La Matinale',
        desc: 'Elle représente "La Matinale", l\'émission phare pour se réveiller du bon pied avec toute l\'équipe, faire le plein de bonne humeur et de news !'
    },
    {
        id: 'podcast',
        keywords: ['podcast', 'talk', 'interview', 'debat', 'débat', 'chronique', 'libre antenne'],
        border: 'border-[#3498db]',
        hex: '#3498db',
        starColor: 'bleu',
        label: 'Podcasts & Talks',
        desc: 'Elle représente les "Podcasts & Talks", vos émissions de discussion, débats sans filtre, et chroniques culturelles.'
    },
    {
        id: 'night',
        keywords: ['night', 'club', 'mix', 'dj', 'soiree', 'soirée', 'electro'],
        border: 'border-[#e74c3c]',
        hex: '#e74c3c',
        starColor: 'rouge',
        label: 'La Night',
        desc: 'Elle représente "La Night", l\'esprit clubbing et mix DJ exclusif pour enflammer vos nuits étudiantes.'
    },
    {
        id: 'mag',
        keywords: ['mag', 'magazine', 'sport', 'tech', 'jeu', 'actu', 'top'],
        border: 'border-[#2ecc71]',
        hex: '#2ecc71',
        starColor: 'vert',
        label: 'Les Magazines',
        desc: 'Elle représente les "Magazines", des dossiers complets sur l\'actu, la pop culture et les passions MMI.'
    }
];

function getConcept(title: string, selectedType?: string) {
    if (selectedType) {
        const strictMatch = CONCEPTS.find(c => c.id === selectedType);
        if (strictMatch) return strictMatch;
    }

    const t = (title || "").toLowerCase();
    for (const c of CONCEPTS) {
        if (c.keywords.some(k => t.includes(k))) return c;
    }
    return {
        id: 'default',
        border: 'border-white/10',
        hex: '#ffffff',
        starColor: '',
        label: 'Émission Classique',
        desc: 'Le programme classique de Radio MMI.'
    };
}

function getWeekDates(offsetWeeks = 0) {
    const dates = [];
    const today = new Date();
    // Start of the week calculation (Monday)
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);

    // Add offset for next week (+7 days per offset)
    const monday = new Date(today.setDate(diff + (offsetWeeks * 7)));

    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        dates.push(d);
    }
    return dates;
}

// Convert native JS Date object to exact "YYYY-MM-DD" matching format
function formatDateToString(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function AgendaPage() {
    const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const [selectedDay, setSelectedDay] = useState(todayIndex);
    const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, 1 = next week
    const [weekDates, setWeekDates] = useState<Date[]>([]);

    const [allEvents, setAllEvents] = useState<any[]>([]);
    const [agendaData, setAgendaData] = useState<Record<string, any[]>>({});
    const [isLoading, setIsLoading] = useState(true);

    // Initial Fetch
    useEffect(() => {
        const fetchAgenda = async () => {
            const { data } = await supabase.from('agenda').select('*').order('id', { ascending: true });
            if (data) setAllEvents(data);
            setIsLoading(false);
        };
        fetchAgenda();
    }, []);

    // Update displayed dates & data when offset changes
    useEffect(() => {
        const newWeekDates = getWeekDates(weekOffset);
        setWeekDates(newWeekDates);

        // Return to first valid day (Monday) if shifting weeks, or today if current week
        if (weekOffset === 0) {
            setSelectedDay(todayIndex);
        } else {
            setSelectedDay(0);
        }
    }, [weekOffset]);

    // Format `agendaData` matching the newly calculated `weekDates`
    useEffect(() => {
        if (!allEvents.length || !weekDates.length) return;

        const grouped: Record<string, any[]> = {};
        DAYS.forEach(d => grouped[d] = []);

        allEvents.forEach((item) => {
            const dateStr = item.day ? item.day.trim() : '';

            // Check if it's a specific "YYYY-MM-DD" date match
            const validDateIndex = weekDates.findIndex(d => formatDateToString(d) === dateStr);

            if (validDateIndex !== -1) {
                grouped[DAYS[validDateIndex]].push(item);
            }
            else if (!dateStr.includes("-") && weekOffset === 0) {
                // FALLBACK for legacy data like "Lundi", "Mardi" 
                // Only show legacy string-based scheduled days on the CURRENT week (offset 0)
                const matchedDay = DAYS.find(d => d.toLowerCase() === dateStr.toLowerCase());
                if (matchedDay) {
                    grouped[matchedDay].push(item);
                }
            }
        });

        setAgendaData(grouped);
    }, [allEvents, weekDates, weekOffset]);

    const currentMonthLabel = weekDates.length > 0
        ? weekDates[0].toLocaleString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase()
        : '';

    return (
        <main className="min-h-screen pt-24 pb-20 bg-[#141414] flex flex-col relative selection:bg-oxy-orange/30">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-oxy-orange/10 blur-[120px] pointer-events-none" />

            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 w-full z-10 mb-8 mt-4">
                <div className="flex items-center gap-2 text-white/50 mb-6 text-sm font-bold uppercase tracking-wider">
                    <Link href="/" className="hover:text-oxy-orange transition-colors">Accueil</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white">Planning</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className={`${anton.className} text-5xl md:text-7xl text-white tracking-widest mb-2 drop-shadow-lg flex items-center gap-4`}>
                            AGENDA
                            {weekOffset === 1 && <span className="text-xl md:text-2xl text-oxy-orange font-sans font-black bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">PROCHAINE SEMAINE</span>}
                        </h1>
                        <h2 className="text-2xl font-black text-white/40 uppercase tracking-widest">
                            {currentMonthLabel}
                        </h2>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 self-start md:self-end">
                        <button
                            onClick={() => setWeekOffset(0)}
                            className={`px-6 py-2.5 font-black uppercase tracking-widest rounded-full transition-all text-sm
                            ${weekOffset === 0 ? 'bg-oxy-orange text-black shadow-lg shadow-oxy-orange/20' : 'bg-[#1c1c1c] text-white/50 hover:text-white hover:bg-[#252525]'}`}
                        >
                            En cours
                        </button>
                        <button
                            onClick={() => setWeekOffset(1)}
                            className={`px-6 py-2.5 font-black uppercase tracking-widest rounded-full transition-all text-sm
                            ${weekOffset === 1 ? 'bg-oxy-orange text-black shadow-lg shadow-oxy-orange/20' : 'bg-[#1c1c1c] text-white/50 hover:text-white hover:bg-[#252525]'}`}
                        >
                            Semaine pro
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Interactive Section */}
            <div className="max-w-7xl mx-auto w-full px-4 md:px-8 z-10 flex-1 flex flex-col">

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center min-h-[500px]">
                        <span className="animate-spin inline-block w-10 h-10 border-4 border-oxy-orange border-t-transparent rounded-full drop-shadow-lg" />
                    </div>
                ) : (
                    <div className="w-full flex gap-2 md:gap-4 h-[65vh] min-h-[500px] max-h-[800px]">
                        {DAYS.map((day, index) => {
                            const isSelected = selectedDay === index;

                            // Logique de blocage Jours Fermés : 
                            // - Dimanche toujour fermé.
                            // - Samedi fermé SI AUCUN événement planifié dessus
                            const isSunday = index === 6;
                            const isSaturday = index === 5;
                            const dayEvents = agendaData[day] || [];
                            const isClosedDay = isSunday || (isSaturday && dayEvents.length === 0);

                            const isToday = todayIndex === index && weekOffset === 0;
                            const dateObj = weekDates[index];
                            const dateNum = dateObj?.getDate() || '';

                            // Gestion du click
                            const handleColClick = () => {
                                // On peut quand même cliquer pour voir le message "Fermé"
                                setSelectedDay(index);
                            };

                            return (
                                <div
                                    key={day}
                                    onClick={handleColClick}
                                    className={`relative h-full transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer flex flex-col border border-white/5
                                    ${isSelected ? 'flex-[4] sm:flex-[3] md:flex-[2.5] bg-[#F7F7F7] shadow-xl' : 'flex-1 bg-[#1c1c1c] hover:bg-[#252525]'}`}
                                    style={{
                                        backgroundImage: (!isSelected && !isClosedDay) ? 'repeating-linear-gradient(-45deg, transparent, transparent 15px, rgba(255,255,255,0.02) 15px, rgba(255,255,255,0.02) 30px)' : 'none'
                                    }}
                                >
                                    {/* 1. COLLAPSED VIEW (when not selected) */}
                                    <div className={`absolute inset-0 flex flex-col p-2 md:p-4 transition-opacity duration-300 ${isSelected ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

                                        {isClosedDay ? (
                                            /* Affichage Grisé pour les jours Fermés (Samedi Vide / Dimanche) */
                                            <div className="flex-1 flex flex-col items-center pt-2 opacity-30">
                                                <span className="text-xs md:text-sm font-black mb-1 text-white/40">{SHORT_DAYS[index]}</span>
                                                <span className="text-xl md:text-2xl font-black text-white/40 mb-6">{dateNum}</span>
                                                <Lock className="w-4 h-4 text-white/40 mb-2" />
                                            </div>
                                        ) : (
                                            /* Affichage Normal */
                                            <>
                                                <div className="flex flex-col items-center mb-6 pt-2">
                                                    <span className={`text-xs md:text-sm font-black mb-1 ${isToday ? 'text-oxy-orange' : 'text-white/40'}`}>
                                                        {SHORT_DAYS[index]}
                                                    </span>
                                                    <span className={`text-xl md:text-2xl font-black ${isToday ? 'text-oxy-orange' : 'text-white/70'}`}>
                                                        {dateNum}
                                                    </span>
                                                </div>

                                                {/* Event Blocks */}
                                                <div className="flex-1 flex flex-col gap-2 overflow-hidden items-center">
                                                    {dayEvents.map((ev, evIdx) => (
                                                        <div
                                                            key={ev.id}
                                                            className={`w-full aspect-square md:aspect-auto md:h-16 rounded-xl ${COLORS[evIdx % COLORS.length]} shadow-inner opacity-90`}
                                                            title={ev.title}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* 2. EXPANDED VIEW (when selected) */}
                                    <div className={`absolute inset-0 flex flex-col bg-[#f0f0f0] transition-opacity duration-500 delay-100 ${isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

                                        {/* Header */}
                                        <div className="p-6 md:p-8 shrink-0 flex items-end justify-between border-b border-black/5 bg-white shadow-sm">
                                            <div>
                                                <div className={`text-sm md:text-md font-black uppercase tracking-widest mb-1 flex items-center gap-2 ${isClosedDay ? '!text-neutral-500' : '!text-oxy-orange'}`}>
                                                    {isToday && <span className="bg-oxy-orange !text-white px-2 py-0.5 rounded text-[10px]">AUJOURD'HUI</span>}
                                                    {day}
                                                </div>
                                                <div className={`${anton.className} text-5xl md:text-7xl ${isClosedDay ? '!text-neutral-400' : '!text-black'} leading-none`}>
                                                    {dateNum}
                                                </div>
                                            </div>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${isClosedDay ? 'bg-neutral-200' : 'bg-neutral-100'}`}>
                                                {isClosedDay ? <Lock className="w-5 h-5 !text-neutral-500" /> : <Calendar className="w-5 h-5 !text-black/40" />}
                                            </div>
                                        </div>

                                        {/* Scrollable Events List ou Fermé */}
                                        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 custom-scrollbar-dark relative">

                                            {isClosedDay ? (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center !text-neutral-600 m-4 rounded-3xl border border-neutral-300 border-dashed bg-neutral-100/50">
                                                    <Lock className="w-12 h-12 mb-4 opacity-50" />
                                                    <p className="font-bold uppercase tracking-widest text-sm !text-neutral-600">Établissement Fermé</p>
                                                    <p className="font-medium text-xs opacity-80 !text-neutral-500">Radio MMI passe en offline</p>
                                                </div>
                                            ) : dayEvents.length === 0 ? (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center !text-black/50 bg-white/50 backdrop-blur-sm m-4 rounded-3xl border border-black/5 border-dashed">
                                                    <Radio className="w-12 h-12 mb-4 opacity-30" />
                                                    <p className="font-bold uppercase tracking-widest text-sm !text-black/50">Fin des émissions</p>
                                                    <p className="font-medium text-xs opacity-80 !text-black/40">Reprise musicale automatique</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {dayEvents.map((ev, evIdx) => {
                                                        const concept = getConcept(ev.title, ev.type);
                                                        const isSpecial = concept.id !== 'default';

                                                        return (
                                                            <div
                                                                key={ev.id}
                                                                className={`rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.1)] border-[4px] relative overflow-visible group ${concept.border}`}
                                                                style={isSpecial ? { backgroundImage: "url('/assets/programme/fond_carte.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#F2CA45' } : { backgroundColor: 'white' }}
                                                            >
                                                                <div className="flex flex-col relative z-10 h-full">

                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <span className="px-3 md:px-4 py-1.5 bg-white !text-black rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-black/5">
                                                                            <Clock className="w-3.5 h-3.5 opacity-60" /> {ev.time || '18:00 - 20:00'}
                                                                        </span>
                                                                    </div>

                                                                    <h3 className={`text-2xl md:text-3xl font-black ${isSpecial ? '!text-white drop-shadow-md' : '!text-black'} leading-tight mb-4`}>{ev.title}</h3>

                                                                    {ev.show && ev.show.trim() !== '' && (
                                                                        <div className="flex flex-col items-start gap-2 mt-auto">
                                                                            {ev.show.split(',').map((tag: string, tIdx: number) => (
                                                                                <span key={tIdx} className={`px-3 py-1.5 ${isSpecial ? 'bg-white !text-black' : 'bg-black/5 !text-black/60'} rounded-lg text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border border-black/5 ${isSpecial ? '' : 'hover:bg-black/10'} transition-colors`}>
                                                                                    <span className="w-2 h-2 rounded-full bg-oxy-orange block"></span>
                                                                                    {tag.trim()}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Étoile de Concept */}
                                                                {concept.starColor && (
                                                                    <img
                                                                        src={`/assets/programme/petit/${concept.starColor}.svg`}
                                                                        alt={concept.label}
                                                                        title={concept.label}
                                                                        className="absolute -bottom-5 -right-5 w-16 h-16 md:w-20 md:h-20 drop-shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 z-20"
                                                                    />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Légende des Concepts */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 w-full mt-24 mb-12 z-10">
                <div className="bg-[#1c1c1c] rounded-[2.5rem] p-8 md:p-14 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-oxy-orange/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <h2 className={`${anton.className} text-3xl md:text-5xl text-white mb-12 text-center uppercase tracking-widest relative z-10`}>
                        DÉCOUVREZ NOS <span className="text-oxy-orange">CONCEPTS</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">
                        {CONCEPTS.filter(c => c.id !== 'default').map(concept => (
                            <div key={concept.id} className="flex flex-col items-center text-center group cursor-default">
                                <div className="relative mb-6">
                                    <div
                                        className="absolute inset-0 rounded-full blur-[40px] opacity-20 transition-opacity duration-500 group-hover:opacity-40"
                                        style={{ backgroundColor: concept.hex }}
                                    ></div>
                                    <img
                                        src={`/assets/programme/grand/${concept.starColor}.png`}
                                        alt={concept.label}
                                        className="w-28 h-28 relative z-10 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 drop-shadow-2xl"
                                    />
                                </div>
                                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-wider">{concept.label}</h3>
                                <p className="text-white/50 text-sm leading-relaxed font-medium">{concept.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar-dark::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar-dark::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar-dark::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.2);
                }
            `}} />
        </main>
    );
}
