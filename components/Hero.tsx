import Image from "next/image";
import { Play } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative h-[600px] w-full overflow-hidden rounded-[2.5rem] mb-20 shadow-2xl shadow-primary/20 group">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop"
                    alt="Studio Radio MMI"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-10 md:p-16">
                <div className="max-w-4xl">
                    <span className="inline-flex items-center px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-white uppercase bg-primary/90 backdrop-blur-sm rounded-full shadow-lg shadow-primary/20 border border-white/10">
                        <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                        En Direct
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                        Le Réveil MMI
                    </h1>
                    <p className="text-2xl text-neutral-200 mb-10 font-medium max-w-2xl leading-relaxed">
                        Avec Thomas et Sarah • 6h - 10h
                    </p>

                    <button className="group flex items-center gap-4 px-8 py-4 bg-white text-secondary rounded-full font-bold text-lg hover:bg-neutral-100 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full text-white group-hover:bg-primary/90 transition-colors shadow-lg">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                        Écouter le direct
                    </button>
                </div>
            </div>
        </section>
    );
}
