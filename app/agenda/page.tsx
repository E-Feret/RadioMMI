"use client";

import Link from "next/link";
import { ChevronRight, Radio, PlayCircle, Users, Clock, CalendarHeart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// On définit une échelle : 1 heure = 200 pixels
const HOUR_WIDTH = 250;
const START_HOUR = 6; // La grille commence à 06h00

// Données fictives ajustées pour le layout horizontal
const AGENDA_DATA = [
    {
        dayLabel: "Aujourd'hui",
        date: "Mercredi 25 Fevrier",
        events: [
            {
                id: 1,
                startHour: 6, // 06:00
                durationHours: 4,
                title: "Le Réveil MMI",
                hosts: "Audric & Marius",
                type: "En Direct",
                icon: <Radio className="w-4 h-4" />,
                isLive: true,
                colorClass: "bg-oxy-orange text-white shadow-oxy-orange/40",
            },
            {
                id: 2,
                startHour: 10, // 10:00
                durationHours: 2,
                title: "Flash Info",
                hosts: "Rédaction",
                type: "Info",
                icon: <Clock className="w-4 h-4" />,
                isLive: false,
                colorClass: "bg-neutral-800 text-white shadow-black/20",
            },
            {
                id: 3,
                startHour: 12, // 12:00
                durationHours: 2,
                title: "Pause Musicale",
                hosts: "Automate",
                type: "Musique",
                icon: <PlayCircle className="w-4 h-4" />,
                isLive: false,
                colorClass: "bg-blue-600/80 text-white shadow-blue-500/20",
            },
            {
                id: 4,
                startHour: 16, // 16:00
                durationHours: 2,
                title: "TechTalk: L'IA",
                hosts: "Sarah & Léo",
                type: "Émission",
                icon: <Users className="w-4 h-4" />,
                isLive: false,
                colorClass: "bg-purple-600/80 text-white shadow-purple-500/20",
            },
            {
                id: 5,
                startHour: 20, // 20:00
                durationHours: 4,
                title: "DJ Set - La Nocturne",
                hosts: "DJ Mixou",
                type: "Mix Audio",
                icon: <Radio className="w-4 h-4" />,
                isLive: false,
                colorClass: "bg-gradient-to-r from-red-600 to-oxy-orange text-white",
            }
        ]
    },
    {
        dayLabel: "Demain",
        date: "Jeudi 26 Fevrier",
        events: [
            {
                id: 6,
                startHour: 6,
                durationHours: 4,
                title: "Le Réveil MMI",
                hosts: "Audric & Marius",
                type: "En Direct",
                icon: <Radio className="w-4 h-4" />,
                isLive: false,
                colorClass: "bg-oxy-orange text-white shadow-oxy-orange/40",
            },
            {
                id: 7,
                startHour: 14,
                durationHours: 3,
                title: "Campus Vibes",
                hosts: "Équipe du BDE",
                type: "Show",
                icon: <Users className="w-4 h-4" />,
                isLive: false,
                colorClass: "bg-green-600/80 text-white shadow-green-500/20",
            }
        ]
    }
];

export default function AgendaPage() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [currentTimeOffset, setCurrentTimeOffset] = useState(0);

    // Simuler un "Current Time" Marker (ligne verticale actuelle)
    useEffect(() => {
        // En vrai on ferait : const currentHour = new Date().getHours() + (new Date().getMinutes() / 60);
        // Pour la demo web visuelle, on force une heure actuelle à "08h30" (soit 2.5 heures apres START_HOUR)
        const demoCurrentHour = 8.5;
        const offset = (demoCurrentHour - START_HOUR) * HOUR_WIDTH;
        setCurrentTimeOffset(offset);

        // Auto-scroll vers le bloc actuel lors du chargement de la page
        if (scrollContainerRef.current) {
            // Centre le pointeur actuel dans la fenêtre
            scrollContainerRef.current.scrollLeft = offset - (window.innerWidth / 3);
        }
    }, []);

    // Génération des marqueurs d'heures (06:00 à 24:00)
    const hoursMarkers = Array.from({ length: 19 }, (_, i) => START_HOUR + i);

    return (
        <main className="min-h-screen pt-24 pb-0 bg-neutral-950/90 flex flex-col">

            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 w-full shrink-0 mb-12">
                <div className="flex items-center gap-2 text-white/60 mb-4 text-sm font-medium">
                    <Link href="/" className="hover:text-oxy-orange transition-colors">Accueil</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white">Planning</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                    La Grille des <span className="text-oxy-orange">Programmes</span>
                </h1>
                <p className="text-xl text-white/70 max-w-2xl">
                    Le grand format horizontal interactif pour explorer tous les programmes à venir.
                </p>
            </div>

            {/* Timeline Horizontal Container */}
            <div className="relative flex-1 w-full bg-neutral-900 border-y border-white/10 overflow-hidden flex flex-col">

                <div
                    ref={scrollContainerRef}
                    className="flex-1 w-full overflow-x-auto pb-8 pt-4 custom-scrollbar scroll-smooth"
                >
                    <div
                        className="relative h-full min-h-[500px]"
                        style={{ width: `${hoursMarkers.length * HOUR_WIDTH}px`, minWidth: '100%' }}
                    >

                        {/* 1. Grille d'Arrière-plan (Lignes & Heures) */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            {hoursMarkers.map((val, idx) => (
                                <div
                                    key={val}
                                    className="absolute top-0 bottom-0 border-l border-white/5"
                                    style={{ left: `${idx * HOUR_WIDTH}px` }}
                                >
                                    <span className="absolute -top-1 left-3 text-sm font-black text-white/20 select-none">
                                        {val.toString().padStart(2, '0')}:00
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* 2. Ligne de l'Heure Actuelle (Current Time Indicator) */}
                        <div
                            className="absolute top-0 bottom-0 z-30 pointer-events-none transition-all duration-1000 ease-in-out"
                            style={{ left: `${currentTimeOffset}px` }}
                        >
                            <div className="absolute -top-3 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] whitespace-nowrap">
                                EN CE MOMENT
                            </div>
                            <div className="w-[2px] h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
                        </div>

                        {/* 3. Lignes de Jours (Lanes par jour) */}
                        <div className="relative pt-16 flex flex-col gap-10">
                            {AGENDA_DATA.map((dayLine, i) => (
                                <div key={i} className="relative flex items-center h-48 border-b border-white/5 pb-12">

                                    {/* Étiquette collée à gauche du container scrollable (Sticky Label) */}
                                    <div className="sticky left-0 z-40 bg-neutral-900/90 backdrop-blur-md py-6 px-4 md:px-8 border-r border-white/10 rounded-r-3xl w-48 shrink-0 h-full flex flex-col justify-center items-start shadow-xl">
                                        <h2 className="text-xl font-black text-white">{dayLine.dayLabel}</h2>
                                        <p className="text-white/40 text-xs font-bold uppercase tracking-wider">{dayLine.date}</p>
                                    </div>

                                    {/* Conteneur des blocs horaires pour ce jour */}
                                    <div className="absolute inset-0 pt-6 pointer-events-none">
                                        {dayLine.events.map((ev) => {
                                            const leftOffset = (ev.startHour - START_HOUR) * HOUR_WIDTH;
                                            const width = ev.durationHours * HOUR_WIDTH;

                                            return (
                                                <div
                                                    key={ev.id}
                                                    className="absolute top-8 h-28 group transition-transform hover:scale-[1.02] hover:z-50 cursor-pointer pointer-events-auto"
                                                    style={{ left: `${leftOffset}px`, width: `${width - 15}px` }}
                                                >
                                                    <div className={`w-full h-full rounded-2xl p-4 flex flex-col shadow-lg border border-white/10 backdrop-blur-md transition-all duration-300 ${ev.colorClass} ${ev.isLive ? 'ring-2 ring-white/50 animate-pulse' : 'opacity-90 hover:opacity-100'}`}>
                                                        {/* Header de la carte */}
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                                                                    {ev.icon}
                                                                </span>
                                                                <span className="text-xs font-bold uppercase tracking-wide opacity-90">
                                                                    {ev.type}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs font-black opacity-80 backdrop-blur-md bg-black/20 px-2 py-0.5 rounded-md">
                                                                {ev.startHour.toString().padStart(2, '0')}h - {(ev.startHour + ev.durationHours).toString().padStart(2, '0')}h
                                                            </span>
                                                        </div>
                                                        {/* Contenu */}
                                                        <div>
                                                            <h3 className="text-xl font-bold leading-tight line-clamp-1 mb-1 shadow-sm">{ev.title}</h3>
                                                            <p className="text-sm font-medium opacity-80 line-clamp-1">Par {ev.hosts}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                /* Cacher la barre de scroll disgracieuse mais garder le comportement horizontal */
                .custom-scrollbar::-webkit-scrollbar {
                    height: 12px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 102, 0, 0.5); /* Oxy Orange hover */
                }
            `}} />

        </main>
    );
}
