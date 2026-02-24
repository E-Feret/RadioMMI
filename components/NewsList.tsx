import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

const NEWS = [
    {
        id: 1,
        title: "Soutenance de Projet Tuteuré : Les 2e années présentent !",
        excerpt: "Venez découvrir les projets de fin de semestre des étudiants en BUT MMI 2. Des innovations incroyables au programme.",
        date: "4 Déc 2025",
        category: "Projets Tech",
    },
    {
        id: 2,
        title: "Festival du Court-Métrage Étudiant : Soirée de clôture",
        excerpt: "L'association audiovisuelle vous invite à la projection des meilleurs films réalisés cette année. Entrée libre.",
        date: "3 Déc 2025",
        category: "Sorties culturelles",
    },
    {
        id: 3,
        title: "Tournoi e-sport inter-promos : Inscriptions ouvertes",
        excerpt: "Préparez vos manettes, le tournoi annuel Super Smash Bros Ultimate aura lieu jeudi prochain dans le hall.",
        date: "2 Déc 2025",
        category: "Vie du Campus",
    },
];

export default function NewsList() {
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

            <div className="grid grid-cols-1 gap-6">
                {NEWS.map((item) => (
                    <article
                        key={item.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group cursor-pointer border border-neutral-100 dark:border-neutral-800 hover:-translate-y-1"
                    >
                        <div className="flex-1 mb-6 md:mb-0 md:mr-8">
                            <div className="flex items-center gap-4 mb-3">
                                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                    {item.category}
                                </span>
                                <span className="flex items-center text-xs text-secondary/60 dark:text-neutral-400 font-medium">
                                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                    {item.date}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-secondary dark:text-white mb-3 group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-secondary/70 dark:text-neutral-400 text-base leading-relaxed line-clamp-2">
                                {item.excerpt}
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-neutral-50 dark:bg-neutral-800 text-secondary/40 group-hover:text-white group-hover:bg-primary transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-[-45deg]">
                                <ArrowRight className="w-6 h-6" />
                            </span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
