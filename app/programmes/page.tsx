import Link from "next/link";
import { Play, Mic, Headphones, ChevronRight, TrendingUp, Clock, Disc3 } from "lucide-react";

const LATEST_EMISSIONS = [
    {
        id: 1,
        title: "Le Réveil MMI - Spéciale Nuit des SAE",
        animateur: "Audric & Marius",
        date: "Ce matin",
        duration: "03:45:00",
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "TechTalk : Les nouveautés d'Apple",
        animateur: "Sarah & Léo",
        date: "Hier",
        duration: "01:20:00",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Campus Vibes - Émission de rentrée",
        animateur: "Équipe MMI",
        date: "Lundi dernier",
        duration: "02:00:00",
        image: "https://images.unsplash.com/photo-1516280440502-869260a9fcc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

const LATEST_PODCASTS = [
    {
        id: 101,
        title: "Créer son agence web à 20 ans",
        serie: "Entreprendre en MMI",
        date: "Hier",
        duration: "45 min",
        image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 102,
        title: "Le son au cinéma : Décryptage",
        serie: "Ciné & Co",
        date: "Il y a 3 jours",
        duration: "55 min",
        image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 103,
        title: "Portfolio : Les erreurs à ne pas faire",
        serie: "Tips & Tricks",
        date: "La semaine dernière",
        duration: "30 min",
        image: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
];

const TOP_LISTENED = [
    {
        id: 201,
        title: "Comment survivre au S3 ?",
        type: "Podcast",
        listens: "5.4k"
    },
    {
        id: 202,
        title: "Interview de l'équipe gagnante des MMI Awards",
        type: "Émission",
        listens: "4.1k"
    },
    {
        id: 203,
        title: "Le matériel vidéo : Que choisir en 2026 ?",
        type: "Podcast",
        listens: "3.8k"
    },
    {
        id: 204,
        title: "Soirée DJ Set en direct depuis le K",
        type: "Replay",
        listens: "3.2k"
    }
];

export default function ProgrammesPage() {
    return (
        <main className="min-h-screen pt-24 pb-0 px-4 md:px-8 bg-neutral-950/90">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex items-center gap-2 text-white/60 mb-4 text-sm font-medium">
                    <Link href="/" className="hover:text-oxy-orange transition-colors">Accueil</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white">Programmes</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                    Nos <span className="text-oxy-orange">Programmes</span>
                </h1>
                <p className="text-xl text-white/70 max-w-2xl">
                    Retrouvez tous les replays et podcasts de Radio MMI. Écoutez où vous voulez, quand vous voulez.
                </p>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-start">

                {/* Left Column (Main Content) */}
                <div className="w-full lg:w-8/12 flex flex-col gap-12 min-w-0">

                    {/* Dernières Émissions section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-oxy-orange/20 text-oxy-orange ring-1 ring-oxy-orange/30">
                                    <Disc3 className="w-5 h-5" />
                                </span>
                                Dernières émissions en replay
                            </h2>
                            <Link href="/emissions" className="text-sm font-bold text-white/50 hover:text-oxy-orange transition-colors">Voir tout</Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {LATEST_EMISSIONS.map((emission) => (
                                <article key={emission.id} className="group flex flex-col bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden hover:border-oxy-orange/50 transition-all hover:-translate-y-1 shadow-xl cursor-pointer">
                                    <div className="relative aspect-video overflow-hidden">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                        <img src={emission.image} alt={emission.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-16 h-16 rounded-full bg-oxy-orange text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,102,0,0.5)] transform scale-75 group-hover:scale-100 transition-all duration-300">
                                                <Play className="w-8 h-8 fill-current ml-1" />
                                            </div>
                                        </div>

                                        <div className="absolute bottom-3 right-3 z-30">
                                            <span className="px-2 py-1 bg-black/80 backdrop-blur-md text-white text-xs font-bold border border-white/20 rounded-md flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" /> {emission.duration}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-oxy-orange transition-colors line-clamp-2">{emission.title}</h3>
                                        <p className="text-white/60 text-sm mb-4">Animé par <span className="font-bold text-white/80">{emission.animateur}</span></p>
                                        <p className="text-xs text-oxy-orange font-bold uppercase tracking-wider">{emission.date}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Ligne Séparatrice */}
                    <div className="h-px w-full bg-white/10"></div>

                    {/* Derniers Podcasts section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/30">
                                    <Mic className="w-5 h-5" />
                                </span>
                                Nouveaux podcasts
                            </h2>
                            <Link href="/podcasts" className="text-sm font-bold text-white/50 hover:text-purple-400 transition-colors">Voir tout</Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            {LATEST_PODCASTS.map((podcast) => (
                                <article key={podcast.id} className="group flex items-center bg-neutral-900/50 hover:bg-neutral-900 border border-transparent hover:border-white/10 p-4 rounded-3xl transition-all cursor-pointer">
                                    <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg mr-6">
                                        <img src={podcast.image} alt={podcast.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-8 h-8 text-white fill-current" />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <span className="text-xs font-bold tracking-wider uppercase text-purple-400 mb-1 block">{podcast.serie}</span>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-oxy-orange transition-colors">{podcast.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-white/50">
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {podcast.date}</span>
                                            <span className="flex items-center gap-1.5"><Headphones className="w-3.5 h-3.5" /> {podcast.duration}</span>
                                        </div>
                                    </div>

                                    <button className="flex-shrink-0 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-oxy-orange group-hover:bg-oxy-orange/10 transition-colors hidden sm:flex">
                                        <Play className="w-5 h-5 ml-1" />
                                    </button>
                                </article>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Right Column (Sidebar) */}
                <div className="w-full lg:w-4/12 flex flex-col gap-8 flex-shrink-0 min-w-0">

                    {/* Player Direct Widget (Rappel) */}
                    <div className="bg-oxy-orange p-6 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-oxy-orange/20">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                        <h3 className="text-xl font-black mb-1 relative z-10 flex items-center gap-2">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            Direct Studio
                        </h3>
                        <p className="text-white/90 mb-6 text-sm relative z-10 font-bold">Le Réveil MMI (Audric & Marius)</p>

                        <button className="w-full py-3 bg-white text-oxy-orange rounded-xl font-black hover:bg-neutral-100 transition-colors shadow-lg flex items-center justify-center gap-2 relative z-10">
                            <Play className="w-5 h-5 fill-current" />
                            Écouter le direct
                        </button>
                    </div>

                    {/* Top Listened Widget */}
                    <div className="bg-oxy-blue/20 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-oxy-orange" /> Titres les plus écoutés
                        </h2>
                        <div className="flex flex-col gap-5">
                            {TOP_LISTENED.map((item, index) => (
                                <Link href="#" key={item.id} className="group flex items-start gap-4">
                                    <span className="text-2xl font-black text-white/20 group-hover:text-oxy-orange/60 transition-colors">#{index + 1}</span>
                                    <div className="flex-1 mt-1">
                                        <h3 className="text-white font-bold text-sm group-hover:text-oxy-orange transition-colors leading-snug mb-1">{item.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-white/50">
                                            <span className={`px-2 py-0.5 rounded text-white font-medium ${item.type === 'Podcast' ? 'bg-purple-500/80' : 'bg-blue-500/80'}`}>
                                                {item.type}
                                            </span>
                                            <span className="flex items-center gap-1 font-medium">
                                                <Headphones className="w-3 h-3" /> {item.listens}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
