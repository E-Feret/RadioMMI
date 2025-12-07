"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Données du carrousel
const CAROUSEL_SLIDES = [
    { src: '/assets/carrousel/les-2-du-matin.webp', alt: 'Émission Les 2 du Matin' },
    { src: '/assets/carrousel/vrai-faux-de-nico.webp', alt: 'Le Vrai/Faux de Nico' },
    { src: '/assets/carrousel/la-cash-list.webp', alt: 'Jeu La Cash List', href: '/jeux/cash-list' },
    { src: '/assets/carrousel/enygme-oxygene.webp', alt: 'Jeu L\'Énigme Oxygène' },
    { src: '/assets/carrousel/florent-barsac.webp', alt: 'Émission Florent Barsac' },
    { src: '/assets/carrousel/gagnez-votre-enceinte-echo.webp', alt: 'Gagnez votre enceinte Echo' },
    { src: '/assets/carrousel/59k-auditeurs-tous-les-jours.webp', alt: 'Merci à nos 59k auditeurs' },
    { src: '/assets/carrousel/annoncez-votre-event.webp', alt: 'Annoncez votre événement antenne', href: '/contact' },
    { src: '/assets/carrousel/frequences.webp', alt: 'Nos fréquences FM en Seine-et-Marne' },
];

export default function HomeCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === CAROUSEL_SLIDES.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1));
    };

    return (
        // J'ai remplacé bg-slate-900 par bg-oxy-blue pour la cohérence charte
        <div className="relative w-full aspect-video overflow-hidden rounded-3xl bg-oxy-blue group shadow-lg" suppressHydrationWarning={true}>
            {CAROUSEL_SLIDES.map((slide, index) => {
                // Optimisation : On ne monte dans le DOM que le slide actif (et le précédent/suivant pour la transition si besoin, mais ici simple)
                if (index !== currentIndex) return null;

                return (
                    <div
                        key={index}
                        className="absolute inset-0 w-full h-full animate-fadeIn transition-opacity duration-700 ease-in-out"
                        suppressHydrationWarning={true}
                    >
                        {/* IMAGE PRINCIPALE (NETTE & ENTIÈRE) */}
                        {/* Affiche l'image en cover pour remplir le ratio 16/9 */}
                        <div className="relative z-10 w-full h-full" suppressHydrationWarning={true}>
                            {slide.href ? (
                                <Link
                                    href={slide.href}
                                    className="relative w-full h-full block cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                                >
                                    <Image
                                        src={slide.src}
                                        alt={slide.alt}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                    />
                                </Link>
                            ) : (
                                <Image
                                    src={slide.src}
                                    alt={slide.alt}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Navigation Buttons (Visibles au survol) */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-oxy-orange backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-oxy-orange backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10"
            >
                <ChevronRight size={24} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {CAROUSEL_SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                            ? "bg-oxy-orange w-8" // Active : Orange et long
                            : "bg-white/40 w-2 hover:bg-white/80" // Inactive : Blanc transparent
                            }`}
                        aria-label={`Aller à la diapositive ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}