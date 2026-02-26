import Link from "next/link";
import { Calendar, ArrowRight, TrendingUp, Clock, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

const MOST_VIEWED = [
    {
        id: 11,
        title: "Comment survivre aux SAE de fin d'année : Le guide ultime",
        date: "15 Nov 2025",
        views: "2.4k"
    },
    {
        id: 12,
        title: "Le matériel du studio de streaming entièrement mis à jour !",
        date: "10 Nov 2025",
        views: "1.8k"
    },
    {
        id: 13,
        title: "Interview exclusive avec le directeur du département",
        date: "05 Nov 2025",
        views: "1.2k"
    }
];

export default async function ActusPage() {
    // Fetch real data from supabase
    const { data: actusData } = await supabase
        .from('actus')
        .select('*')
        .eq('status', 'Publié')
        .order('id', { ascending: false });

    const actus = actusData || [];

    const getImage = (item: any, index: number) => {
        if (item?.image) return item.image;
        const placeholders = [
            "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        ];
        return placeholders[index % placeholders.length];
    };

    const featuredNews = actus.length > 0 ? actus[0] : null;
    const recentNews = actus.length > 1 ? actus.slice(1, 10) : []; // limit to 9 recent

    return (
        <main className="min-h-screen pt-24 pb-0 px-4 md:px-8 bg-neutral-950/90">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex items-center gap-2 text-white/60 mb-4 text-sm font-medium">
                    <Link href="/" className="hover:text-oxy-orange transition-colors">Accueil</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white">Actualités</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Toute l'actualité <span className="text-oxy-orange">MMI</span></h1>
                <p className="text-xl text-white/70 max-w-2xl">Découvrez les derniers événements, les projets étudiants et la vie du département directement depuis notre newsroom.</p>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

                {/* Left Column (Featured + Recent) */}
                <div className="w-full lg:w-8/12 flex flex-col gap-8 min-w-0">

                    {/* Featured Article */}
                    {featuredNews ? (
                        <Link href={`/actus/${featuredNews.id}`} className="relative group overflow-hidden rounded-3xl bg-neutral-900 border border-white/10 shadow-xl cursor-pointer block">
                            <article>
                                <div className="absolute inset-0 z-0">
                                    <img src={getImage(featuredNews, 0)} alt={featuredNews.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-50 group-hover:opacity-70" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                                </div>
                                <div className="relative z-10 p-8 pt-48 md:pt-64 flex flex-col justify-end min-h-[400px]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 bg-oxy-orange text-white text-xs font-bold rounded-full uppercase tracking-wider">{featuredNews.category || 'Actualité'}</span>
                                        <span className="flex items-center text-sm text-white/80 font-medium">
                                            <Clock className="w-4 h-4 mr-1.5" />
                                            {featuredNews.date || 'Récemment'}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight group-hover:text-oxy-orange transition-colors">{featuredNews.title}</h2>
                                    <p className="text-lg text-white/80 line-clamp-2 md:line-clamp-3 mb-6 max-w-3xl">La une du jour, cliquez pour lire la suite...</p>

                                    <div className="inline-flex items-center gap-2 text-white font-bold group-hover:text-oxy-orange transition-colors">
                                        Lire l'article <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ) : (
                        <div className="p-12 text-center bg-neutral-900 rounded-3xl border border-white/10 text-white/50">
                            Aucune actualité publiée pour le moment.
                        </div>
                    )}

                    {/* Recent News Grid */}
                    {recentNews.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-oxy-orange" /> Les plus récentes
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {recentNews.map((news: any, index: number) => (
                                    <Link key={news.id} href={`/actus/${news.id}`} className="group flex flex-col bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden hover:border-oxy-orange/50 transition-colors cursor-pointer">
                                        <article className="flex flex-col h-full">
                                            <div className="relative h-48 overflow-hidden shrink-0">
                                                <img src={getImage(news, index + 1)} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white/90 border border-white/20 text-xs font-bold rounded-full uppercase">{news.category || 'Actualité'}</span>
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-1">
                                                <span className="flex items-center text-xs text-oxy-orange font-medium mb-3">
                                                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                                    {news.date || 'Récemment'}
                                                </span>
                                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-oxy-orange transition-colors line-clamp-2">{news.title}</h3>
                                                <p className="text-white/60 text-sm line-clamp-3 mb-4 flex-1">Lisez notre actualité pour découvrir toutes les informations.</p>
                                                <div className="mt-auto inline-flex items-center text-sm font-bold text-white group-hover:text-oxy-orange">
                                                    Lire la suite <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Column (Sidebar) */}
                <div className="w-full lg:w-4/12 flex flex-col gap-8 flex-shrink-0 min-w-0">

                    {/* Most Viewed Widget */}
                    <div className="bg-oxy-blue/20 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-oxy-orange" /> Les plus consultées
                        </h2>
                        <div className="flex flex-col gap-6">
                            {MOST_VIEWED.map((item, index) => (
                                <Link href="#" key={item.id} className="group flex items-start gap-4">
                                    <span className="text-4xl font-black text-white/10 group-hover:text-oxy-orange/40 transition-colors">0{index + 1}</span>
                                    <div className="flex-1">
                                        <h3 className="text-white font-bold group-hover:text-oxy-orange transition-colors leading-snug mb-1">{item.title}</h3>
                                        <div className="flex items-center justify-between text-xs text-white/50">
                                            <span>{item.date}</span>
                                            <span className="font-medium bg-white/5 px-2 py-0.5 rounded text-white/70">{item.views} vues</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter / CTA Widget */}
                    <div className="bg-gradient-to-br from-oxy-orange to-red-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-oxy-orange/20">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <h3 className="text-2xl font-black mb-3 relative z-10">Ne ratez rien !</h3>
                        <p className="text-white/90 mb-6 text-sm relative z-10">Inscrivez-vous à notre newsletter mensuelle pour recevoir les meilleurs résumés directement dans votre boîte mail.</p>
                        <form className="relative z-10 flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Votre adresse e-mail"
                                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                            />
                            <button type="button" className="w-full px-4 py-3 bg-white text-oxy-orange rounded-xl font-bold hover:bg-neutral-100 transition-colors shadow-lg">
                                S'abonner
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </main>
    );
}
