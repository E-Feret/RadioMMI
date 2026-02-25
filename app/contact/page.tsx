"use client";

import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen pt-24 pb-0 px-4 md:px-8 bg-neutral-950/90">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-8 text-center uppercase tracking-tight">
                    Contactez <span className="text-oxy-orange">MMI</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Info & Map */}
                    <div className="space-y-8">
                        {/* Info Card */}
                        <div className="bg-oxy-blue/20 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-lg">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <MapPin className="text-oxy-orange" />
                                Nous trouver
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">Studio MMI</p>
                                        <p className="text-white/70">IUT de Troyes<br />Département MMI</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">Standard</p>
                                        <p className="text-white/70"> <a href="tel:0164373519" className="hover:underline" target="_blank" rel="noopener noreferrer">01 64 37 35 19</a></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">Email</p>
                                        <p className="text-white/70"> <a href="mailto:contact@radiommi.fr" className="hover:underline" target="_blank" rel="noopener noreferrer">contact@radiommi.fr</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="h-[300px] rounded-3xl overflow-hidden border border-white/10 shadow-lg relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3440.710708369959!2d4.076963576943753!3d48.26929034198163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47ee990d10f3e7cf%3A0xb266ba721a3e3dca!2sIUT%20Troyes!5e1!3m2!1sfr!2sfr!4v1771891794421!5m2!1sfr!2sfr"
                                className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-oxy-blue/20 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-lg h-full">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Send className="text-oxy-orange" />
                            Envoyez un message
                        </h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-white/80 text-sm font-bold ml-1">Nom</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-oxy-orange focus:ring-1 focus:ring-oxy-orange transition-all placeholder:text-white/30"
                                        placeholder="Votre nom"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-white/80 text-sm font-bold ml-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-oxy-orange focus:ring-1 focus:ring-oxy-orange transition-all placeholder:text-white/30"
                                        placeholder="votre@email.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-white/80 text-sm font-bold ml-1">Sujet</label>
                                <div className="relative">
                                    <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-oxy-orange focus:ring-1 focus:ring-oxy-orange transition-all appearance-none cursor-pointer">
                                        <option className="bg-slate-900">Dédicace</option>
                                        <option className="bg-slate-900">Info Route</option>
                                        <option className="bg-slate-900">Jeu</option>
                                        <option className="bg-slate-900">Publicité / Partenariat</option>
                                        <option className="bg-slate-900">Autre</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-white/80 text-sm font-bold ml-1">Message</label>
                                <textarea
                                    rows={6}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-oxy-orange focus:ring-1 focus:ring-oxy-orange transition-all placeholder:text-white/30 resize-none"
                                    placeholder="Votre message..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-oxy-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-oxy-orange/20 hover:shadow-oxy-orange/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                ENVOYER AU STUDIO
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </main>
    );
}
