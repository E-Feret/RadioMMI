"use client";

import Link from "next/link";

interface NavNewItemProps {
    href: string;
    label: string;
    isActive: boolean;
}

export default function NavNewItem({ href, label, isActive }: NavNewItemProps) {
    return (
        <Link
            href={href}
            className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-1 ${isActive
                ? "text-oxy-orange bg-white/10"
                : "text-white/90 hover:text-oxy-orange hover:bg-white/10"
                }`}
        >
            {label}
            {isActive && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-oxy-orange rounded-full animate-pulse" />
            )}
        </Link>
    );
}
