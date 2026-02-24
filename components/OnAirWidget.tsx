"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";

// Mock Data
const PROGRAMS = [
    {
        id: "night_early",
        title: "La Nuit MMI",
        start: 0,
        end: 6,
        host: "Non-stop Music",
        image: "/assets/direct/le_direct.png",
    },
    {
        id: "reveil",
        title: "Le Réveil MMI",
        start: 6,
        end: 10,
        host: "Thomas & Sarah",
        image: "/assets/direct/le_direct.png",
    },
    {
        id: "matinee",
        title: "La Matinée",
        start: 10,
        end: 13,
        host: "Équipe MMI",
        image: "/assets/direct/le_direct.png",
    },
    {
        id: "hits",
        title: "Les Hits MMI",
        start: 13,
        end: 16,
        host: "Programme Musical",
        image: "/assets/direct/le_direct.png",
    },
    {
        id: "afterwork",
        title: "L'Afterwork",
        start: 16,
        end: 20,
        host: "Julien",
        image: "/assets/direct/le_direct.png",
    },
    {
        id: "night",
        title: "La Night",
        start: 20,
        end: 24,
        host: "Mix MMI",
        image: "/assets/direct/le_direct.png",
    },
];

export default function OnAirWidget({ compact = false }: { compact?: boolean }) {
    const [currentProgram, setCurrentProgram] = useState<typeof PROGRAMS[0] | null>(null);
    const [nextProgram, setNextProgram] = useState<typeof PROGRAMS[0] | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateStatus = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            // Find current program
            const current = PROGRAMS.find(p => currentHour >= p.start && currentHour < p.end);

            if (current) {
                setCurrentProgram(current);

                // Find next program
                const currentIndex = PROGRAMS.findIndex(p => p.id === current.id);
                const next = PROGRAMS[(currentIndex + 1) % PROGRAMS.length];
                setNextProgram(next);

                // Calculate progress
                const totalMinutes = (current.end - current.start) * 60;
                const elapsedMinutes = (currentHour - current.start) * 60 + currentMinute;
                const prog = Math.min(100, Math.max(0, (elapsedMinutes / totalMinutes) * 100));
                setProgress(prog);
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    if (!currentProgram) return null;

    return (
        <div className="bg-oxy-blue/20 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] text-white h-full flex flex-col justify-center">
            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Host Image */}
                <div className="relative w-24 h-24 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full border-2 border-oxy-orange p-1">
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                                src={currentProgram.image}
                                alt={currentProgram.host}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-oxy-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg animate-pulse whitespace-nowrap">
                        En Direct
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left w-full">
                    <h3 className="text-2xl font-bold mb-1">{currentProgram.title}</h3>
                    <p className="text-white/80 text-sm mb-4 flex items-center justify-center md:justify-start gap-2">
                        <Clock className="w-4 h-4" />
                        {currentProgram.start}h - {currentProgram.end}h • Avec {currentProgram.host}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-oxy-orange rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Next Up */}
                    {nextProgram && (
                        <p className="text-xs text-white/60 font-medium">
                            À suivre à {nextProgram.start}h : <span className="text-white">{nextProgram.title}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
