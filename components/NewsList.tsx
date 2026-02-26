import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function NewsList() {
    const { data: actusData } = await supabase
        .from('actus')
        .select('*')
        .eq('status', 'Publié')
        .order('id', { ascending: false })
        .limit(3);

    const newsData = actusData || [];

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-oxy-blue dark:text-white">
                    Dernières Actus MMI
                </h2>
                <Link href="/actus" className="text-sm font-medium text-oxy-orange hover:text-oxy-orange/80 hover:underline">
                    Toutes les news
                </Link>
            </div>

            {newsData.length === 0 ? (
                <div className="text-center p-8 bg-neutral-900 rounded-3xl text-white/50 border border-white/10">
                    Aucune actualité récente.
                </div>
            ) : (
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 sm:grid sm:grid-cols-1 md:overflow-x-visible md:snap-none md:pb-0 scrollbar-hide">
                    {newsData.map((item) => (
                        <Link href={`/actus/${item.id}`} key={item.id} className="min-w-[85vw] sm:min-w-0 snap-center group">
                            <article
                                className="h-full flex flex-col md:flex-row md:items-center justify-between p-8 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer border border-neutral-100 dark:border-neutral-800 group-hover:-translate-y-1 group-hover:border-oxy-orange/30"
                            >
                                <div className="flex-1 mb-6 md:mb-0 md:mr-8">
                                    <div className="flex items-center gap-4 mb-3">
                                        <span className="text-xs font-bold text-oxy-orange bg-oxy-orange/10 px-3 py-1 rounded-full uppercase tracking-wider border border-oxy-orange/20">
                                            {item.category || 'Actualité'}
                                        </span>
                                        <span className="flex items-center text-xs text-secondary/60 dark:text-neutral-400 font-medium">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            {item.date || 'Récemment'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-secondary dark:text-white mb-3 group-hover:text-oxy-orange transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-secondary/70 dark:text-neutral-400 text-base leading-relaxed line-clamp-2">
                                        Pour en savoir plus, cliquez sur la flèche pour lire l'article complet.
                                    </p>
                                </div>

                                <div className="flex-shrink-0 self-end md:self-auto">
                                    <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-neutral-50 dark:bg-neutral-800 text-secondary/40 group-hover:text-white group-hover:bg-oxy-orange transition-all duration-300 transform group-hover:scale-110">
                                        <ArrowRight className="w-6 h-6" />
                                    </span>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
