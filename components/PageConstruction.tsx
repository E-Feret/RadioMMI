"use client";

import Link from "next/link";
import { Radio } from "lucide-react";

export default function PageConstruction() {
    return (
        <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "url('/assets/fond/fond.webp')" }}
            >
                <div className="absolute inset-0 bg-black/50" /> {/* Overlay for readability */}
            </div>

            {/* Glassmorphism Card */}
            <div className="relative z-10 max-w-lg w-full bg-oxy-blue/80 backdrop-blur-md p-10 rounded-3xl border border-white/10 text-center shadow-2xl animate-in fade-in zoom-in duration-500">

                {/* Animated Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-oxy-orange/20 rounded-full animate-ping" />
                        <div className="relative bg-white/10 p-4 rounded-full border border-white/20">
                            <Radio className="w-12 h-12 text-oxy-orange animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-tight">
                    Fréquence en cours de réglage...
                </h1>
                <p className="text-white/80 text-lg mb-8 leading-relaxed">
                    Cette section arrive très bientôt sur le nouveau site Radio MMI.
                </p>

                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-8 py-3 bg-oxy-orange text-white font-bold rounded-full hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-oxy-orange/20"
                >
                    Retour à l'accueil
                </Link>
            </div>
        </main>
    );
}
