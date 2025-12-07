"use client";

import Image from "next/image";
import { Phone } from "lucide-react";
import { Anton } from 'next/font/google';

const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap' });

const TEAM = [
    {
        name: 'Aurélien',
        role: 'Animateur du matin',
        img: '/assets/equipe/aurélien.webp',
        stats: [
            { label: 'Passions', value: 'Les dauphins' },
            { label: 'Qualité', value: 'Comme un poney' },
            { label: 'Défaut', value: 'Aime porter des slips kangourou' },
            { label: 'Rêve', value: 'Savoir ce qui se passe dans ces camionnettes' },
            { label: 'Voudrait être', value: 'Michel Drucker' },
        ]
    },
    {
        name: 'Julie',
        role: 'Animatrice',
        img: '/assets/equipe/julie.webp',
        stats: [
            { label: 'Passions', value: 'Tartiner du brie' },
            { label: 'Qualité', value: 'La bonne humeur' },
            { label: 'Défaut', value: 'Je ne sais pas faire le café' },
            { label: 'Rêve', value: 'Bah c\'est écrit au-dessus ;)' },
            { label: 'Voudrait être', value: 'La première femme sur la Lune' },
        ]
    },
    {
        name: 'Valendrin',
        role: 'Torrefacteur (et animateur)',
        img: '/assets/equipe/valendrin.webp',
        stats: [
            { label: 'Passions', value: 'Le sport' },
            { label: 'Qualité', value: 'Mes cheveux !' },
            { label: 'Défaut', value: 'Casse les cafetières du boulot' },
            { label: 'Rêve', value: 'Trouver l’anneau' },
            { label: 'Voudrait être', value: 'Un hobbit' },
        ]
    },
    {
        name: 'Christophe',
        role: 'BOSS',
        img: '/assets/equipe/christophe.webp',
        stats: [
            { label: 'Passions', value: 'Les chiffres' },
            { label: 'Qualité', value: 'Je fais de très bonnes crêpes' },
            { label: 'Défaut', value: 'Ne bois pas que de l\'eau' },
            { label: 'Rêve', value: 'Nager avec des dauphins roses' },
            { label: 'Voudrait être', value: 'JM Morandini (pour les castings)' },
        ]
    },
    {
        name: 'Florent',
        role: 'Journaliste',
        img: '/assets/equipe/florent-barsac.webp',
        stats: [
            { label: 'Passions', value: 'Descendre le Loing en canoë' },
            { label: 'Qualité', value: 'La cuisine' },
            { label: 'Défaut', value: 'La vaisselle que je ne fais pas' },
            { label: 'Rêve', value: 'Un monde meilleur' },
            { label: 'Voudrait être', value: 'JJ Bourdin' },
        ]
    },
    {
        name: 'Charlène',
        role: 'Super-héroïne Com\' Nord 77',
        img: '/assets/equipe/charlene.webp',
        contact: '07 67 00 13 37',
        stats: [
            { label: 'Passions', value: 'Transformer le quotidien en aventure' },
            { label: 'Qualité', value: 'Répond en un éclair' },
            { label: 'Défaut', value: 'Émotionnelle quand je m’implique' },
            { label: 'Rêve', value: 'Road-trip en camping-car' },
        ]
    },
    {
        name: 'Alexandra',
        role: 'Cheffe des pubs (Sud 77)',
        img: '/assets/equipe/alexandra.webp',
        stats: [
            { label: 'Passions', value: 'La taxidermie et la sieste' },
            { label: 'Qualité', value: 'Dresseuse de serpents' },
            { label: 'Défaut', value: 'Je n\'ai que des qualités' },
            { label: 'Rêve', value: 'Chevaucher une licorne sur une plage' },
            { label: 'Voudrait être', value: 'Zora la Rousse' },
        ]
    },
    {
        name: 'Sébastien',
        role: 'Communiquant (Coulommiers)',
        img: '/assets/equipe/sebatien.webp',
        stats: [
            { label: 'Passions', value: 'Mes enfants, La Grande Boucle, Club Dorothée' },
            { label: 'Qualité', value: 'J\'essaie d\'être partout à la fois' },
            { label: 'Défaut', value: 'Tête trop proche de la lune' },
            { label: 'Rêve', value: 'Gravir le Rinjani' },
        ]
    },
    {
        name: 'Nico',
        role: 'Réparateur machine à café',
        img: '/assets/equipe/nico.webp',
        stats: [
            { label: 'Passions', value: 'Le café italien' },
            { label: 'Qualité', value: 'Vainqueur régulier de blind-test' },
            { label: 'Défaut', value: 'S\'éclipse des soirées sans rien dire' },
            { label: 'Rêve', value: 'Vivre sur une péniche sur le Loing' },
            { label: 'Voudrait être', value: 'Lève-tard' },
        ]
    },
    {
        name: 'Cécile Jacquot',
        role: 'Animatrice',
        img: '/assets/equipe/cecile.webp',
        stats: [
            { label: 'Mission', value: 'La voix d\'Oxygène' },
            { label: 'Signe', value: 'Mystérieuse' },
        ]
    },
];

export default function EquipePage() {
    return (
        <main className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-start overflow-hidden">

            {/* TITRE */}
            <div className="text-center z-10 mb-8 px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg uppercase tracking-tight">
                    LA FAMILLE <span className="text-oxy-orange">OXYGÈNE</span>
                </h1>
                <p className="text-white/80 text-sm md:text-base font-medium">
                    Ceux qui font vibrer la Seine-et-Marne
                </p>
            </div>

            {/* GALERIE SCROLLABLE */}
            <div className="w-full overflow-x-auto pb-8 px-4 scrollbar-hide snap-x snap-mandatory touch-pan-x">
                {/* Le 'w-max mx-auto' centre l'équipe si l'écran est large */}
                <div className="flex gap-4 w-max mx-auto">
                    {TEAM.map((member, index) => (
                        <div
                            key={index}
                            className="group relative flex h-[220px] w-[130px] hover:w-[460px] flex-shrink-0 cursor-pointer flex-row overflow-hidden rounded-lg bg-slate-900 shadow-xl transition-[width] duration-500 ease-out snap-center border border-white/10"
                        >
                            {/* PHOTO FIXE (Plus étroite) */}
                            <div className="relative h-full w-[130px] min-w-[130px]">
                                <Image
                                    src={member.img}
                                    fill
                                    className="object-cover"
                                    alt={member.name}
                                    sizes="130px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                                {/* Nom permanent */}
                                <div className="absolute bottom-2 w-full px-1 z-10">
                                    <p className="!text-white font-bold text-center text-sm truncate drop-shadow-md">{member.name}</p>
                                </div>
                            </div>

                            {/* INFOS (Révélé au hover) */}
                            <div className="h-full min-w-[320px] w-[320px] p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 bg-slate-900 border-l border-white/10">

                                {/* NOM (Correction: Blanc + Gros + Force) */}
                                <h3 className="text-3xl font-bold !text-white mb-1 drop-shadow-md">{member.name}</h3>

                                {/* ROLE (Style Anton) */}
                                <p className={`${anton.className} text-2xl text-oxy-orange uppercase tracking-wide mb-4 border-b border-white/20 pb-2 inline-block`}>
                                    {member.role}
                                </p>

                                {/* STATS */}
                                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                                    {member.stats.map((stat, i) => (
                                        <div key={i} className="text-sm text-slate-200 leading-tight">
                                            <span className="text-oxy-orange font-bold uppercase text-xs">{stat.label} : </span>
                                            <span className="italic">« {stat.value} »</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Padding fantôme à droite pour ne pas coller Cécile au bord */}
                    <div className="w-4 shrink-0" />
                </div>
            </div>
        </main>
    );
}
