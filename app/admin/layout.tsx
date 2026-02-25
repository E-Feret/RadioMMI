"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    CalendarDays,
    Mic,
    Settings,
    Users,
    LogOut,
    Menu,
    X,
    Radio as LucideRadio
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ADMIN_LINKS = [
    { label: "Vue d'ensemble", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Actualités", href: "/admin/actus", icon: <FileText className="w-5 h-5" /> },
    { label: "Agenda (Timeline)", href: "/admin/agenda", icon: <CalendarDays className="w-5 h-5" /> },
    { label: "Programmes", href: "/admin/programmes", icon: <Mic className="w-5 h-5" /> },
    { label: "Équipe", href: "/admin/equipe", icon: <Users className="w-5 h-5" /> },
    { label: "Paramètres", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userContext, setUserContext] = useState<any>(null);

    useEffect(() => {
        if (pathname === '/admin/login') {
            setIsLoading(false);
            return;
        }

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin/login');
                return;
            }

            // Check if user is in 'equipe' and has isAdmin = true
            const { data: teamMember, error } = await supabase
                .from('equipe')
                .select('*')
                .eq('isAdmin', true)
                .limit(100); // Fetch list of admins to see if our user is among them

            const isAdminValid = teamMember?.some(member =>
                member.email === session.user.email ||
                // Fallback loosely just in case this is the generic first user and team database is empty
                (teamMember.length === 0 && session.user.email === "admin@mmi.fr")
            );

            if (error || (!isAdminValid && teamMember && teamMember.length > 0)) {
                alert("Accès refusé. Vous n'êtes pas administrateur ou ne faites pas partie de l'équipe.");
                await supabase.auth.signOut();
                router.push('/admin/login');
                return;
            }

            setUserContext({
                ...session.user,
                teamData: teamMember?.find(m => m.email === session.user.email) || null
            });
            setIsLoading(false);
        };

        checkSession();
    }, [pathname, router]);

    if (isLoading) {
        return <div className="h-screen w-full bg-neutral-950 flex items-center justify-center">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-oxy-orange border-t-transparent rounded-full" />
        </div>;
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    return (
        <div className="flex h-screen overflow-hidden bg-neutral-950 font-sans text-neutral-100 selection:bg-oxy-orange/30">
            {/* ... rest of sidebar ... */}
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-neutral-900 border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Area */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <div className="bg-oxy-orange/20 p-2 rounded-xl text-oxy-orange group-hover:bg-oxy-orange group-hover:text-white transition-all">
                            <LucideRadio className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="block font-black tracking-tight text-white uppercase leading-none">MMI Studio</span>
                            <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Backoffice</span>
                        </div>
                    </Link>
                    <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
                    <p className="px-3 text-xs font-bold uppercase tracking-wider text-white/30 mb-4 mt-2">Gestion du contenu</p>
                    {ADMIN_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                                    ? 'bg-oxy-orange/10 text-oxy-orange shadow-[inset_0_0_15px_rgba(255,102,0,0.1)]'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className={isActive ? 'text-oxy-orange' : 'text-white/40'}>{link.icon}</span>
                                {link.label}
                            </Link>
                        )
                    })}
                </div>

                {/* User Area Footer */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-oxy-orange to-red-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0">
                            {userContext?.teamData?.avatar ? (
                                <img src={userContext.teamData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                userContext?.teamData?.name?.[0]?.toUpperCase() || userContext?.email?.[0]?.toUpperCase() || 'A'
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{userContext?.teamData?.name || userContext?.email || 'Admin MMI'}</p>
                            <p className="text-xs text-white/40 truncate">Administrateur</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5 opacity-70" />
                        <span className="font-medium text-sm">Quitter l'Admin</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-neutral-950">
                {/* Topbar */}
                <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-white/5 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 -ml-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-white hidden sm:block">Tableau de bord</h2>
                            <p className="text-xs text-white/40 hidden sm:block">Gérez votre webradio en temps réel.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" target="_blank" className="text-sm font-medium text-white/50 hover:text-white px-4 py-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all hidden sm:block">
                            Voir le site en direct
                        </Link>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-oxy-orange/50 transition-colors cursor-pointer">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-oxy-orange opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-oxy-orange"></span>
                            </span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Pages Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative">
                    {/* Decorative glow effect */}
                    <div className="fixed top-0 left-72 w-[500px] h-[500px] bg-oxy-orange/5 rounded-full blur-[120px] pointer-events-none -z-10" />

                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 102, 0, 0.5);
                }
            `}} />
        </div>
    );
}
