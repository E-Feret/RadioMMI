import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, Calendar, Eye } from "lucide-react";
import { Anton } from 'next/font/google';

const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap' });

// Server component pour récupérer une actualité en fonction de l'URL ID
export default async function ActuDetailePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: actu, error } = await supabase
        .from('actus')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !actu) {
        notFound();
    }

    // Incrémenter les vues (côté serveur, de façon asynchrone pour ne pas bloquer le rendu)
    supabase.rpc('increment_actu_views', { row_id: id }).then();
    // Fallback pour update basique :
    await supabase.from('actus').update({ views: (actu.views || 0) + 1 }).eq('id', id);

    // Image
    const imageUrl = actu.image || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

    return (
        <main className="min-h-screen relative selection:bg-oxy-orange/30 bg-transparent">
            {/* 1. Background Image Floutée Fixe */}
            <div className="fixed inset-0 -z-10 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[30px] md:blur-[50px] scale-110 opacity-70"
                    style={{ backgroundImage: `url(${imageUrl})`, backgroundAttachment: 'fixed' }}
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* 2. Scrolling Content */}
            <div className="relative z-10 flex flex-col min-h-screen">

                {/* Hero Title Section */}
                <div className="h-[75vh] flex items-center justify-center px-4 w-full relative">
                    <h1
                        className={`${anton.className} text-6xl md:text-8xl lg:text-[10rem] text-white text-center uppercase tracking-wider leading-none drop-shadow-2xl`}
                        style={{ textShadow: "0px 10px 40px rgba(0,0,0,0.8)" }}
                    >
                        {actu.title}
                    </h1>
                </div>

                {/* Main Article Container avec dégradé vers le noir */}
                <article className="bg-[#0a0a0a] relative flex-1">
                    {/* Gradient de transition vers le contenu noir */}
                    <div className="absolute bottom-full left-0 w-full h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />

                    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16 min-h-screen">

                        <div className="flex flex-col gap-8 mb-16 relative z-20">
                            {/* Bouton retour */}
                            <Link href="/actus" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 border border-white/5 hover:bg-neutral-800 text-white/50 hover:text-white rounded-full text-sm font-bold transition-all w-fit group shadow-lg">
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour aux actus
                            </Link>

                            {/* Méta-données style widget */}
                            <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                <span className="px-4 py-1.5 bg-oxy-orange text-black text-sm font-black rounded-full uppercase tracking-widest shadow-lg shadow-oxy-orange/20">
                                    {actu.category || 'LA RADIO'}
                                </span>
                                <div className="flex items-center gap-6 text-sm font-medium text-white/50">
                                    <span className="flex items-center gap-2 hover:text-white transition-colors">
                                        <Calendar className="w-4 h-4" /> {actu.date}
                                    </span>
                                    <span className="flex items-center gap-2 hover:text-white transition-colors">
                                        <Clock className="w-4 h-4" /> temps de lecture: 3 min
                                    </span>
                                    <span className="flex items-center gap-2 hover:text-white transition-colors">
                                        <Eye className="w-4 h-4" /> {(actu.views || 0) + 1} vues
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contenu de l'article */}
                        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-white/70 prose-a:text-oxy-orange prose-a:no-underline hover:prose-a:text-oxy-orange/80 prose-img:rounded-3xl prose-img:shadow-2xl">
                            <div className="whitespace-pre-wrap leading-relaxed font-medium">
                                {actu.content || "Aucun contenu disponible pour cette actualité."}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
}
