"use client";

import { Play, Radio } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import Image from "next/image";

export default function LiveCTA() {
    const { isPlaying, togglePlay } = useAudio();
    const { track } = useNowPlaying();

    return (
        <div
            onClick={togglePlay}
            className="group relative h-full min-h-[300px] bg-gradient-to-br from-oxy-blue to-purple-900 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center p-6"
        >
            {/* Dynamic Blurred Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={track.cover}
                    alt="Background"
                    fill
                    className="object-cover blur-md opacity-50 scale-110 transition-transform duration-700 group-hover:scale-125"
                />
                <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay for readability */}
            </div>

            {/* Animated Background Overlay */}
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-10 mix-blend-overlay z-0" />

            {/* Huge Sound Wave Animation (Background) */}
            {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none z-0">
                    <div className="w-[200%] h-[200%] bg-white/10 rounded-[40%] animate-[spin_10s_linear_infinite]" />
                    <div className="absolute w-[180%] h-[180%] bg-white/10 rounded-[45%] animate-[spin_15s_linear_infinite_reverse]" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Icon */}
                <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        {isPlaying ? (
                            <div className="flex gap-1.5 items-end h-10">
                                <span className="w-2 bg-oxy-orange rounded-full animate-[bounce_1s_infinite] h-6" />
                                <span className="w-2 bg-oxy-orange rounded-full animate-[bounce_1s_infinite_0.1s] h-10" />
                                <span className="w-2 bg-oxy-orange rounded-full animate-[bounce_1s_infinite_0.2s] h-8" />
                                <span className="w-2 bg-oxy-orange rounded-full animate-[bounce_1s_infinite_0.15s] h-5" />
                            </div>
                        ) : (
                            <Play className="w-10 h-10 text-oxy-orange fill-current ml-1" />
                        )}
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-3 mb-8 md:mb-0">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-none drop-shadow-lg">
                        {isPlaying ? "En Direct" : "Écouter"}
                    </h3>
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                        <p className="text-white font-bold text-sm max-w-[200px] line-clamp-2">
                            {track.title}
                        </p>
                        <p className="text-white/80 text-xs mt-0.5">{track.artist}</p>
                    </div>
                </div>
            </div>

            {/* Bottom Badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10">
                    <Radio className="w-3 h-3" />
                    98.5 FM
                </span>
            </div>
        </div>
    );
}
