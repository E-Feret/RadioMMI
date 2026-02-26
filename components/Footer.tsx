"use client";

import Link from "next/link";
import Image from "next/image";
import { Anton } from 'next/font/google';
import { usePathname } from "next/navigation";
import { useAdminData } from "@/hooks/useAdminData";
import NewsletterForm from "@/components/NewsletterForm";

const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap' });

export default function Footer() {
    const pathname = usePathname();
    const { data: settings } = useAdminData("settings");
    const adminSettings = settings as any;

    if (pathname.startsWith("/admin")) return null;

    return (
        // AJOUT DE 'pb-32' : On augmente le padding-bottom (pb-8 -> pb-32)
        // Cela crée un espace vide en bas du footer pour que le Player Audio (fixed) ne cache rien.
        <footer className="bg-oxy-blue border-t-4 border-oxy-orange pt-16 pb-32 text-white">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* COL 1: BRAND & STANDARD */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative w-32 h-12">
                            <Image src="/assets/logo/logo.svg" alt="Radio MMI" fill className="object-contain object-left" />
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">
                            {adminSettings?.description || "Contactez Radio MMI, la webradio du département MMI."}
                        </p>
                    </div>

                    <div className="space-y-2 text-sm text-white/80">
                        <p><span className="text-oxy-orange font-bold">Email :</span> <a href={`mailto:${adminSettings?.email || "contact@radiommi.fr"}`} className="hover:underline">{adminSettings?.email || "contact@radiommi.fr"}</a></p>
                        <p><span className="text-oxy-orange font-bold">WhatsApp :</span> <a href={`https://wa.me/${(adminSettings?.phone || "33632320156").replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{adminSettings?.phone || "+33 6 32 32 01 56"}</a></p>
                    </div>
                </div>

                {/* COL 2: AGENCES (ADRESSES) */}
                <div>
                    <h3 className={`${anton.className} text-xl !text-oxy-orange uppercase mb-4`}>Notre Studio</h3>
                    <div className="space-y-6 text-sm text-white/80 whitespace-pre-line">
                        <div>
                            {adminSettings?.address ? (
                                <p>{adminSettings.address}</p>
                            ) : (
                                <>
                                    <p className="font-bold text-white mb-1">Troyes Champagne Métropole</p>
                                    <p>IUT de Troyes - Département MMI</p>
                                    <p>9 Rue de Québec</p>
                                    <p>10000 TROYES</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* COL 3: CONTACTS MMI */}
                <div>
                    <h3 className={`${anton.className} text-xl !text-oxy-orange uppercase mb-4`}>Contacts MMI</h3>
                    <div className="space-y-4 text-sm text-white/80">
                        <div>
                            <p className="font-bold text-white text-xs uppercase mb-1">Direction du Département</p>
                            <p>Romain DELON</p>
                            <a href="mailto:romain.delon@univ-reims.fr" className="text-oxy-orange hover:underline block">romain.delon@univ-reims.fr</a>
                        </div>
                        <div>
                            <p className="font-bold text-white text-xs uppercase mb-1">Direction de l'IUT</p>
                            <p>Martial MARTIN</p>
                            <a href="mailto:martial.martin@univ-reims.fr" className="text-oxy-orange hover:underline block">martial.martin@univ-reims.fr</a>
                        </div>
                        <div>
                            <p className="font-bold text-white text-xs uppercase mb-1">Studio & Prêt Audiovisuel</p>
                            <p>Kyllian BRESSON</p>
                            <a href="mailto:kyllian.bresson@univ-reims.fr" className="text-oxy-orange hover:underline block">kyllian.bresson@univ-reims.fr</a>
                        </div>
                    </div>
                </div>

                {/* COL 4: NEWSLETTER & NAVIGATION */}
                <div>
                    <h3 className={`${anton.className} text-xl !text-oxy-orange uppercase mb-4`}>Newsletter</h3>
                    <p className="text-sm text-white/80 mb-4 whitespace-pre-line">
                        Ne manquez aucun projet étudiant ni émission spéciale !
                    </p>
                    <NewsletterForm />

                    <h3 className={`${anton.className} text-xl !text-oxy-orange uppercase mt-8 mb-4`}>Navigation</h3>
                    <ul className="grid grid-cols-2 gap-2 mb-6 text-sm">
                        <li><Link href="/" className="text-white/80 hover:text-oxy-orange transition-colors">Accueil</Link></li>
                        <li><Link href="/equipe" className="text-white/80 hover:text-oxy-orange transition-colors">Équipe</Link></li>
                        <li><Link href="/podcasts" className="text-white/80 hover:text-oxy-orange transition-colors">Podcasts</Link></li>
                        <li><Link href="/contact" className="text-white/80 hover:text-oxy-orange transition-colors">Contact</Link></li>
                    </ul>

                    <h3 className={`${anton.className} text-xl !text-oxy-orange uppercase mb-4`}>Infos</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/mentions-legales" className="text-white/80 hover:text-white transition-colors">Mentions Légales</Link></li>
                        <li><Link href="/confidentialite" className="text-white/80 hover:text-white transition-colors">Confidentialité</Link></li>
                        <li className="pt-2"><Link href="/admin/login" className="text-white/40 hover:text-oxy-orange transition-colors flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-oxy-orange"></span> Espace Admin</Link></li>
                    </ul>
                </div>
            </div>

            {/* COPYRIGHT */}
            <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center">
                <p className="text-white/60 text-sm">
                    &copy; {new Date().getFullYear()} {adminSettings?.name || "Radio MMI"}. Tous droits réservés.
                </p>
            </div>
        </footer>
    );
}