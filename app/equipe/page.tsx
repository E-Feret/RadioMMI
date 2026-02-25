import Image from "next/image";
import { Phone } from "lucide-react";
import { Anton } from 'next/font/google';
import { supabase } from "@/lib/supabase";

const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap' });

export default async function EquipePage() {
    const { data: equipeData } = await supabase.from('equipe').select('*').order('id', { ascending: true });
    const team = equipeData || [];

    const getAvatar = (avatar: string) => {
        if (!avatar || avatar.trim() === '') {
            return "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
        }
        return avatar;
    };

    return (
        <main className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-start overflow-hidden">

            {/* TITRE */}
            <div className="text-center z-10 mb-8 px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg uppercase tracking-tight">
                    LA FAMILLE <span className="text-oxy-orange">MMI</span>
                </h1>
                <p className="text-white/80 text-sm md:text-base font-medium">
                    Ceux qui font vibrer le département MMI
                </p>
            </div>

            {/* GRILLE RESPONSIVE */}
            <div className="w-full max-w-7xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {team.map((member: any) => (
                        <div
                            key={member.id}
                            className="group relative flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-oxy-orange/20"
                        >
                            {/* PHOTO */}
                            <div className="relative w-full h-80 overflow-hidden">
                                <Image
                                    src={getAvatar(member.avatar)}
                                    fill
                                    className="object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-110"
                                    alt={member.name}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {/* Gradient for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                                <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                                    <h3 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{member.name}</h3>
                                    <p className={`${anton.className} text-xl text-oxy-orange uppercase tracking-wider`}>
                                        {member.role || 'Membre'}
                                    </p>
                                </div>
                            </div>

                            {/* STATS */}
                            <div className="p-6 flex flex-col gap-4 bg-slate-950 flex-1">
                                {member.show && (
                                    <div className="text-sm">
                                        <div className="text-oxy-orange/90 font-bold uppercase text-xs mb-1 tracking-wider">Émission Principale</div>
                                        <div className="italic text-white/90">« {member.show} »</div>
                                    </div>
                                )}
                                {member.isAdmin && (
                                    <div className="text-sm">
                                        <div className="text-oxy-orange/90 font-bold uppercase text-xs mb-1 tracking-wider">Statut</div>
                                        <div className="italic text-white/90">« Administrateur MMI »</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {team.length === 0 && (
                        <div className="col-span-full text-center py-20 text-white/50">
                            Aucun membre de l'équipe n'a été ajouté pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
