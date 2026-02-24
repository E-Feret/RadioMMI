"use client";

import Image from "next/image";
import { Phone } from "lucide-react";
import { Anton } from 'next/font/google';

const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap' });

const TEAM = [
    {
        name: 'Romain Delon',
        role: 'Chef de département MMI',
        img: '/assets/equipe/RomainDelon.jpg',
        stats: [
            { label: 'Titre Officieux', value: 'Le GOAT de ces lieux 🐐' },
            { label: 'Mission', value: 'Gouverner le département d\'une main de maître' },
            { label: 'Super-pouvoir', value: 'Piloter la team MMI' },
        ]
    },
    {
        name: 'Martial Martin',
        role: 'Directeur de l\'IUT',
        img: '/assets/equipe/MartialMartin.jpg',
        stats: [
            { label: 'Statut', value: 'Le grand manitou' },
            { label: 'Objectif', value: 'Faire rayonner l\'IUT de Troyes' },
            { label: 'Vision', value: 'L\'excellence étudiante' },
        ]
    },
    {
        name: 'David Annebicque',
        role: 'Directeur adjoint de l\'IUT',
        img: '/assets/equipe/DavidAnnebicque.jpg',
        stats: [
            { label: 'Surnom', value: 'Le bras droit stratégique' },
            { label: 'Atout', value: 'Une organisation sans faille' },
            { label: 'Passion', value: 'Garder l\'IUT sur les bons rails' },
        ]
    },
    {
        name: 'Florent Libbrecht',
        role: 'Master of WebTV & DEV',
        img: '/assets/equipe/FlorentLibbrecht.jpg',
        stats: [
            { label: 'Atelier', value: 'Responsable de la WebTV 🎥' },
            { label: 'Parcours', value: 'Maître du DEV Alternance 💻' },
            { label: 'Lieu de spawn', value: 'Derrière un prompteur ou un IDE' },
        ]
    },
    {
        name: 'Kyllian Bresson',
        role: 'Gourou du Studio',
        img: '/assets/equipe/KyllianBresson.jpg',
        stats: [
            { label: 'Atelier', value: 'Responsable Club Photo 📸' },
            { label: 'Loot', value: 'Gardien du matériel studio MMI' },
            { label: 'Titre Officieux', value: 'L\'autre GOAT (co-titulaire) 🐐' },
        ]
    },
    {
        name: 'Jules Sabater',
        role: 'Tech & Matos',
        img: '/assets/equipe/JulesSabater.jpg',
        stats: [
            { label: 'Binôme', value: 'Partenaire de Kyllian' },
            { label: 'Mission', value: 'Gérer les emprunts du studio' },
            { label: 'Avertissement', value: '"Rendez le matos à l\'heure svp"' },
        ]
    }
];

export default function EquipePage() {
    return (
        <main className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-start overflow-hidden">

            {/* TITRE */}
            <div className="text-center z-10 mb-8 px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg uppercase tracking-tight">
                    LA FAMILLE <span className="text-oxy-orange">MMI</span>
                </h1>
                <p className="text-white/80 text-sm md:text-base font-medium">
                    Ceux qui font vibrer le département MMI
                </p>
            </div>

            {/* GRILLE RESPONSIVE */}
            <div className="w-full max-w-7xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {TEAM.map((member, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-oxy-orange/20"
                        >
                            {/* PHOTO */}
                            <div className="relative w-full h-80 overflow-hidden">
                                <Image
                                    src={member.img}
                                    fill
                                    className="object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-110"
                                    alt={member.name}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {/* Gradient for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                                <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                                    <h3 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{member.name}</h3>
                                    <p className={`${anton.className} text-xl text-oxy-orange uppercase tracking-wider`}>
                                        {member.role}
                                    </p>
                                </div>
                            </div>

                            {/* STATS */}
                            <div className="p-6 flex flex-col gap-4 bg-slate-950 flex-1">
                                {member.stats.map((stat, i) => (
                                    <div key={i} className="text-sm">
                                        <div className="text-oxy-orange/90 font-bold uppercase text-xs mb-1 tracking-wider">{stat.label}</div>
                                        <div className="italic text-white/90">« {stat.value} »</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
