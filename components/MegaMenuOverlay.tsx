"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin } from "lucide-react";

interface SubItem {
    label: string;
    href: string;
}

interface MegaMenuOverlayProps {
    isOpen: boolean;
    items: SubItem[];
    category: string;
}

export default function MegaMenuOverlay({ isOpen, items, category }: MegaMenuOverlayProps) {
    return (
        <div
            className={`absolute top-full left-0 w-full pt-4 transition-all duration-300 transform origin-top ${isOpen
                ? "opacity-100 visible translate-y-0"
                : "opacity-0 invisible -translate-y-4 pointer-events-none"
                }`}
        >
            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-white/20 overflow-hidden mx-4 md:mx-0 p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column: Navigation */}
                    <div className="md:col-span-1 border-r border-neutral-100 dark:border-neutral-800 pr-8">
                        <h3 className="text-sm font-bold text-oxy-orange uppercase tracking-wider mb-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {category}
                        </h3>
                        <ul className="space-y-2">
                            {items.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="group w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        <span className="font-bold text-oxy-blue dark:text-white group-hover:text-oxy-orange transition-colors">
                                            {item.label}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-oxy-orange transition-colors" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Column: Featured Content */}
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-bold text-oxy-blue dark:text-white uppercase tracking-wider mb-4">
                            À la une
                        </h3>
                        <div className="group relative aspect-[21/9] rounded-2xl overflow-hidden cursor-pointer">
                            <Image
                                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop"
                                alt="Featured News"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 p-6">
                                <span className="inline-block px-2 py-1 bg-oxy-orange text-white text-xs font-bold rounded-full mb-2">
                                    INFO EXCLUSIVE
                                </span>
                                <h4 className="text-2xl font-bold text-white mb-2 group-hover:underline decoration-oxy-orange decoration-2 underline-offset-4">
                                    Grande soirée électorale : Les résultats en direct
                                </h4>
                                <p className="text-white/80 line-clamp-1">
                                    Suivez notre édition spéciale avec tous nos envoyés spéciaux sur le terrain.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
