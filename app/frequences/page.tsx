"use client";

import { Anton } from 'next/font/google';
import { Radio } from "lucide-react";

const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap' });

const FLUX_STREAMS = [
    { city: "Le Direct", freq: "🎙️" },
    { city: "Flux Rock", freq: "🎸" },
    { city: "Flux Électro", freq: "⚡" },
    { city: "Flux Rap/R&B", freq: "🎤" },
    { city: "Flux Chill", freq: "☕" },
    { city: "Flux Classique", freq: "🎻" },
    { city: "Flux 80s", freq: "🪩" },
    { city: "Flux Nouveautés", freq: "🌟" },
];

export default function FrequenciesPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className={`${anton.className} text-5xl md:text-7xl text-white uppercase tracking-tight drop-shadow-lg`}>
                        NOS <span className="text-oxy-orange">FLUX</span>
                    </h1>
                    <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto">
                        Toute la musique, toutes les vibes
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FLUX_STREAMS.map((item) => (
                        <div
                            key={item.city}
                            className="group relative bg-oxy-blue/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-oxy-orange/20"
                        >
                            {/* Icon Decoration */}
                            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Radio className="w-8 h-8 text-white" />
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <h3 className="!text-white font-bold text-lg uppercase tracking-wide drop-shadow-md">
                                    {item.city}
                                </h3>
                                <div className={`${anton.className} text-5xl text-oxy-orange`}>
                                    {item.freq}
                                </div>
                                <p className="text-white/40 text-xs font-mono uppercase tracking-widest">
                                    STREAM
                                </p>
                            </div>

                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-oxy-orange/0 to-oxy-orange/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
