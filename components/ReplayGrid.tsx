import Image from "next/image";
import { Clock, PlayCircle } from "lucide-react";

const REPLAYS = [
    {
        id: 1,
        title: "Interview exclusive : Le Maire s'exprime sur les travaux",
        duration: "12:30",
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
        category: "Politique",
    },
    {
        id: 2,
        title: "Les meilleurs spots de ski pour cet hiver",
        duration: "08:45",
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop",
        category: "Loisirs",
    },
    {
        id: 3,
        title: "Concert : Retour sur la soirée Jazz à la Montagne",
        duration: "45:00",
        image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800&auto=format&fit=crop",
        category: "Culture",
    },
];

export default function ReplayGrid() {
    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-oxy-blue dark:text-white">
                    Derniers Replays
                </h2>
                <a href="/podcasts" className="text-sm font-medium text-oxy-orange hover:text-oxy-orange/80 hover:underline">
                    Voir tout
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {REPLAYS.map((replay) => (
                    <article key={replay.id} className="group cursor-pointer bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-4 bg-neutral-100 dark:bg-neutral-800">
                            <Image
                                src={replay.image}
                                alt={replay.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <PlayCircle className="w-14 h-14 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100 drop-shadow-lg" />
                            </div>
                            <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs text-white font-bold flex items-center gap-1.5 border border-white/10">
                                <Clock className="w-3.5 h-3.5" />
                                {replay.duration}
                            </div>
                        </div>

                        <div className="space-y-3 px-2 pb-2">
                            <span className="inline-block px-3 py-1 text-xs font-bold text-primary bg-primary/10 rounded-full uppercase tracking-wider">
                                {replay.category}
                            </span>
                            <h3 className="text-lg font-bold text-secondary dark:text-white leading-tight group-hover:text-primary transition-colors">
                                {replay.title}
                            </h3>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
