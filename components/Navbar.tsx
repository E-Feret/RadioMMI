"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Play, ChevronDown } from "lucide-react";
import NavNewItem from "./NavNewItem";
import MegaMenuOverlay from "./MegaMenuOverlay";
import { useAudio } from "@/context/AudioContext";
import Image from "next/image";
import { Anton } from 'next/font/google';

const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap' });

const NAVI_LINKS = [
    {
        label: "Actualités",
        href: "/actus",
        submenu: [
            { label: "Vie du Campus", href: "/actus/campus" },
            { label: "Projets Tech", href: "/actus/tech" },
            { label: "Sorties Culturelles", href: "/actus/culture" },
        ]
    },
    {
        label: "Programmes",
        href: "/programmes",
        submenu: [
            { label: "Émissions", href: "/emissions" },
            { label: "Podcasts", href: "/podcasts" },
        ]
    },
    { label: "Équipe", href: "/equipe" },
    { label: "Agenda", href: "/agenda" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const { isPlaying, togglePlay } = useAudio();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const isActive = (href: string) => pathname === href;

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    if (pathname.startsWith("/admin")) return null;

    return (
        <nav
            className={`sticky top-0 z-[100] w-full transition-all duration-300 shadow-md bg-gradient-oxy-blue h-16`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Logo - Aligné à gauche avec le contenu principal */}
                    <div className="flex-shrink-0 flex items-center z-50">
                        <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="relative w-16 h-16 bg-transparent flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <Image
                                    src="/assets/logo/logo.svg"
                                    alt="Radio MMI Logo"
                                    width={56}
                                    height={56}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="text-xl font-black text-white tracking-tighter italic group-hover:text-oxy-orange transition-colors hidden sm:block">
                                RADIO MMI
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Right Group: Menu + CTA */}
                    <div className="hidden lg:flex items-center gap-2 xl:gap-4 ml-auto z-40">
                        {/* Nav Items */}
                        <div className="flex items-center gap-1">
                            {NAVI_LINKS.map((link) => (
                                <div key={link.label} className="relative group">
                                    <Link
                                        href={link.href}
                                        className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all flex items-center gap-1 ${isActive(link.href)
                                            ? "text-oxy-orange bg-white/10"
                                            : "text-white/90 hover:text-oxy-orange hover:bg-white/10"
                                            }`}
                                        onMouseEnter={() => setHoveredItem(link.label)}
                                    >
                                        {link.label}
                                        {link.submenu && (
                                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${hoveredItem === link.label ? "rotate-180" : ""}`} />
                                        )}
                                    </Link>

                                    {/* Mega Menu Overlay (Right aligned to prevent overflow) */}
                                    {link.submenu && hoveredItem === link.label && (
                                        <div
                                            className="absolute top-full right-0 w-[500px] pt-4"
                                            onMouseLeave={() => setHoveredItem(null)}
                                        >
                                            <MegaMenuOverlay
                                                isOpen={true}
                                                items={link.submenu}
                                                category={link.label}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="w-px h-6 bg-white/20 hidden xl:block"></div>

                        {/* CTA Button */}
                        <button
                            onClick={togglePlay}
                            className="flex items-center gap-2 px-5 py-2 bg-oxy-orange text-white rounded-full text-sm font-bold hover:bg-oxy-orange/90 transition-all transform hover:scale-105 shadow-lg shadow-oxy-orange/20 group"
                        >
                            {isPlaying ? (
                                <div className="w-3 h-3 flex items-center justify-center">
                                    <span className="block w-0.5 h-2 bg-white rounded-full animate-bounce mr-0.5" style={{ animationDelay: '0s' }}></span>
                                    <span className="block w-0.5 h-3 bg-white rounded-full animate-bounce mr-0.5" style={{ animationDelay: '0.1s' }}></span>
                                    <span className="block w-0.5 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                </div>
                            ) : (
                                <Play className="w-3 h-3 fill-current group-hover:text-white transition-colors" />
                            )}
                            {isPlaying ? "En direct" : "Écouter"}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden z-50">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-8 w-8 text-white" />
                            ) : (
                                <Menu className="h-8 w-8 text-white" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-oxy-blue/98 backdrop-blur-xl flex flex-col pt-24 pb-10 px-6 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                {/* Conteneur de liens avec Scroll si nécessaire */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-min overflow-y-auto">
                    <div className="flex flex-col items-center space-y-6">
                        {NAVI_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`${anton.className} text-3xl sm:text-4xl text-white hover:text-oxy-orange transition-colors tracking-wide py-2`}
                            >
                                {link.label.toUpperCase()}
                            </Link>
                        ))}

                        {/* Ajout du bouton d'action aussi dans le menu mobile */}
                        <div className="pt-8">
                            <Link
                                href="/contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="bg-oxy-orange text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-oxy-orange/20"
                            >
                                DÉDICACE
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
