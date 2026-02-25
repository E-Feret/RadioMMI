"use client";

import { useState } from "react";
import { Plus, Settings2, Save, Users, MapPin, Mail, Phone, Link as LinkIcon, AlertTriangle, Radio, Mic } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

export default function AdminSettingsPage() {
    const { data: settings, saveData } = useAdminData("settings");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulated network delay for better UX
        setTimeout(async () => {
            await saveData(settings);
            setIsSaving(false);
            alert("Les paramètres ont été enregistrés avec succès.");
        }, 800);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                        <Settings2 className="w-8 h-8 text-neutral-400" />
                        Paramètres du Site
                    </h1>
                    <p className="text-white/50">Configurez les constantes vitales de votre station de radio.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors shadow-lg disabled:opacity-50"
                >
                    {isSaving ? <span className="animate-spin inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full" /> : <Save className="w-5 h-5" />}
                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">

                {/* Direct Studio Widget (Hero & Sidebar) */}
                <section className="bg-neutral-900 border border-oxy-orange/30 rounded-3xl p-8 shadow-xl shadow-oxy-orange/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-oxy-orange/5 rounded-bl-[100px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Mic className="w-5 h-5 text-oxy-orange animate-pulse" /> Direct Studio (Widget)
                        </h2>
                    </div>
                    <p className="text-white/50 text-sm mb-6">Ces informations s'affichent automatiquement en haut du site et dans le widget "Actuellement en direct".</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-oxy-orange text-sm font-bold ml-1">Émission en cours</label>
                            <input
                                type="text"
                                value={(settings as any).currentShow || ''}
                                onChange={(e) => saveData({ ...settings, currentShow: e.target.value } as any)}
                                className="w-full bg-black/40 border border-oxy-orange/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-oxy-orange/50 transition-all font-bold placeholder-white/20"
                                placeholder="Ex: Le Morning..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-oxy-orange text-sm font-bold ml-1">Animé par</label>
                            <input
                                type="text"
                                value={(settings as any).currentHosts || ''}
                                onChange={(e) => saveData({ ...settings, currentHosts: e.target.value } as any)}
                                className="w-full bg-black/40 border border-oxy-orange/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-oxy-orange/50 transition-all placeholder-white/20"
                                placeholder="Ex: Audric et Marius"
                            />
                        </div>
                    </div>
                </section>

                {/* Global Info */}
                <section className="bg-neutral-900 border border-white/5 rounded-3xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Informations Générales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-white/70 text-sm font-bold ml-1">Nom de la Radio</label>
                            <input type="text" value={(settings as any).name || ''} onChange={(e) => saveData({ ...settings, name: e.target.value } as any)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-white/70 text-sm font-bold ml-1">Slogan</label>
                            <input type="text" value={(settings as any).slogan || ''} onChange={(e) => saveData({ ...settings, slogan: e.target.value } as any)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-all" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-white/70 text-sm font-bold ml-1">Description courte (SEO / Footer)</label>
                            <textarea rows={2} value={(settings as any).description || ''} onChange={(e) => saveData({ ...settings, description: e.target.value } as any)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-all resize-none" />
                        </div>
                    </div>
                </section>

                {/* Stream Server */}
                <section className="bg-neutral-900 border border-white/5 rounded-3xl p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Radio className="w-5 h-5 text-neutral-400" /> Serveur de Streaming
                        </h2>
                        <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-red-500/20 text-red-500 rounded border border-red-500/50">
                            <AlertTriangle className="w-3 h-3" /> Paramètre Critique
                        </span>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-white/70 text-sm font-bold ml-1 tracking-wider uppercase text-xs">URL Principale du flux (Creacast / Icecast)</label>
                            <input type="url" value={(settings as any).streamUrl || ''} onChange={(e) => saveData({ ...settings, streamUrl: e.target.value } as any)} className="w-full bg-black/20 border-2 border-red-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-all font-mono text-sm" />
                            <p className="text-white/40 text-xs ml-1 mt-1">Le format HTTPS est requis pour la lecture sur les navigateurs modernes.</p>
                        </div>
                    </div>
                </section>

                {/* Contact & Social */}
                <section className="bg-neutral-900 border border-white/5 rounded-3xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Coordonnées (Contact & Footer)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-white/70 text-sm font-bold ml-1 flex items-center gap-2"><Mail className="w-4 h-4" /> Adresse E-mail Publique</label>
                            <input type="email" value={(settings as any).email || ''} onChange={(e) => saveData({ ...settings, email: e.target.value } as any)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-white/70 text-sm font-bold ml-1 flex items-center gap-2"><Phone className="w-4 h-4" /> Numéro de Téléphone / WhatsApp</label>
                            <input type="text" value={(settings as any).phone || ''} onChange={(e) => saveData({ ...settings, phone: e.target.value } as any)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-all" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-white/70 text-sm font-bold ml-1 flex items-center gap-2"><MapPin className="w-4 h-4" /> Adresse Physique du Studio</label>
                            <textarea rows={3} value={(settings as any).address || ''} onChange={(e) => saveData({ ...settings, address: e.target.value } as any)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-all font-mono text-sm resize-none" />
                        </div>
                    </div>
                </section>

            </form>
        </div>
    );
}
