"use client";

import { Activity, Radio, Users, Eye, TrendingUp, PlayCircle } from "lucide-react";

const STATS = [
    { label: "Auditeurs Live", value: "0", icon: <Radio />, trend: "-", color: "text-oxy-orange", bg: "bg-oxy-orange/10" },
    { label: "Vues Actus (30j)", value: "0", icon: <Eye />, trend: "-", color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Écoutes Replays", value: "0", icon: <PlayCircle />, trend: "-", color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Abonnés Newsletter", value: "0", icon: <Users />, trend: "-", color: "text-green-400", bg: "bg-green-400/10" },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">Bienvenue sur votre <span className="text-oxy-orange">Studio MMI</span></h1>
                <p className="text-white/50">Voici un résumé de l'activité de votre radio aujourd'hui.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                    <div key={i} className="bg-neutral-900 border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                                <TrendingUp className="w-3 h-3" /> {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                        <p className="text-sm font-medium text-white/40">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* On Air Widget */}
                <div className="lg:col-span-2 bg-neutral-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-oxy-orange/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-oxy-orange opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-oxy-orange"></span>
                            </span>
                            Actuellement en Direct
                        </h2>
                        <span className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/50 text-xs font-black tracking-widest uppercase rounded">On Air</span>
                    </div>

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-32 h-32 rounded-2xl bg-neutral-800 border border-white/10 shadow-lg overflow-hidden flex-shrink-0">
                            <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Live cover" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-oxy-orange uppercase tracking-wider mb-1">06:00 - 10:00 (Le Matin)</p>
                            <h3 className="text-3xl font-black text-white mb-2">Le Réveil MMI</h3>
                            <p className="text-white/60 mb-4">Animé par Audric & Marius</p>

                            <div className="flex items-center gap-4">
                                <button className="px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors shadow-lg text-sm flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> Modifier le direct
                                </button>
                                <button className="px-5 py-2.5 bg-neutral-800 text-white font-bold rounded-xl hover:bg-neutral-700 transition-colors shadow-lg text-sm border border-white/10">
                                    Voir la grille
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Status */}
                <div className="bg-neutral-900 border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6">Santé du Serveur</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-white/60">Flux Creacast</span>
                                <span className="text-sm font-bold text-green-400 flex items-center gap-2">Connecté <div className="w-2 h-2 rounded-full bg-green-400" /></span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-white/60">Base de données</span>
                                <span className="text-sm font-bold text-green-400 flex items-center gap-2">Connectée <div className="w-2 h-2 rounded-full bg-green-400" /></span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-white/60">Espace disque</span>
                                <span className="text-sm font-bold text-white">42% (20GB/50GB)</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <button className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white font-bold rounded-xl transition-colors">
                            Vider le cache site
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
