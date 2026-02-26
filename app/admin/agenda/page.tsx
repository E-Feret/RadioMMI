"use client";

import { useState } from "react";
import { Plus, Search, CalendarDays, Edit2, Trash2, Clock, CheckCircle2, Circle, X, Loader2 } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

export default function AdminAgendaPage() {
    const { data: agenda, addItem, updateItem, deleteItem } = useAdminData("agenda");
    const { data: equipeData } = useAdminData("equipe");
    const equipeMembers = equipeData || [];

    // Intervenant States
    const [intervenantType, setIntervenantType] = useState<"equipe" | "guest">("equipe");
    const [intervenantEquipeId, setIntervenantEquipeId] = useState("");
    const [intervenantGuestText, setIntervenantGuestText] = useState("");

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        time: "12:00 - 14:00",
        day: "Aujourd'hui",
        status: "Planifié",
        type: "Direct",
        show: ""
    });

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            title: "",
            time: "12:00 - 14:00",
            day: new Date().toISOString().split('T')[0],
            status: "Planifié",
            type: "Direct",
            show: ""
        });
        setIsModalOpen(true);
    };

    const openEditModal = (event: any) => {
        setIsEditing(true);
        setCurrentId(event.id);

        let validDate = event.day;
        // Fallback pour les anciennes données format "Lundi" etc.
        if (!validDate || !validDate.includes("-")) {
            validDate = new Date().toISOString().split('T')[0];
        }

        setFormData({
            title: event.title,
            time: event.time || "12:00 - 14:00",
            day: validDate,
            status: event.status || "Planifié",
            type: event.type || "Direct",
            show: event.show || ""
        });
        setIsModalOpen(true);
    };

    const handleAddIntervenant = () => {
        let newTag = "";
        if (intervenantType === "equipe") {
            const member = equipeMembers.find((m: any) => m.name === intervenantEquipeId || m.id.toString() === intervenantEquipeId);
            if (member) newTag = member.name;
            else if (intervenantEquipeId) newTag = intervenantEquipeId;
        } else {
            newTag = intervenantGuestText.trim();
        }

        if (!newTag) return;

        const currentTags = formData.show ? formData.show.split(',').map(s => s.trim()).filter(Boolean) : [];
        if (!currentTags.includes(newTag)) {
            setFormData({ ...formData, show: [...currentTags, newTag].join(', ') });
        }
        setIntervenantGuestText("");
        setIntervenantEquipeId(""); // reset
    };

    const handleRemoveIntervenant = (tagToRemove: string) => {
        const currentTags = formData.show ? formData.show.split(',').map(s => s.trim()).filter(Boolean) : [];
        setFormData({ ...formData, show: currentTags.filter(t => t !== tagToRemove).join(', ') });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        if (isEditing && currentId) {
            await updateItem(currentId, formData);
        } else {
            await addItem(formData);
        }

        setIsSaving(false);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                        <CalendarDays className="w-8 h-8 text-blue-500" />
                        Gestion de l'Agenda
                    </h1>
                    <p className="text-white/50">Planifiez la timeline de diffusion et gérez les créneaux horaires.</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:bg-blue-500 transition-all transform hover:-translate-y-0.5">
                    <Plus className="w-5 h-5" /> Insérer un Créneau
                </button>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Visual Timeline Outline */}
                <div className="lg:col-span-1 border-r border-white/5 pr-8 hidden lg:block border-dashed">
                    <h2 className="text-xl font-bold text-white mb-6">Aperçu du Jour</h2>
                    <div className="relative border-l-2 border-white/10 ml-4 pb-4 space-y-8">
                        {agenda.filter((e: any) => e.day === "Aujourd'hui").map((ev: any, i: number) => (
                            <div key={i} className="relative flex items-center -ml-[9px] group cursor-pointer hover:translate-x-1 transition-transform">
                                <div className={`h-4 w-4 rounded-full border-4 border-neutral-950 ${ev.status === 'Terminé' ? 'bg-white/20' : 'bg-blue-500'}`}></div>
                                <div className="ml-4 bg-neutral-900 border border-white/5 p-3 rounded-xl w-full group-hover:border-white/20 transition-colors">
                                    <p className="text-xs font-black text-blue-400 mb-1">{ev.time}</p>
                                    <p className="text-sm font-bold text-white leading-tight">{ev.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Table Data */}
                <div className="lg:col-span-2 bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl h-fit">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <h2 className="text-lg font-bold text-white">Créneaux en cours</h2>
                        <select className="bg-black/20 border border-white/10 text-white text-sm rounded-xl px-4 py-2 outline-none">
                            <option value="today">Aujourd'hui</option>
                            <option value="tomorrow">Demain</option>
                            <option value="week">Cette semaine</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <tbody className="divide-y divide-white/5">
                                {agenda.map((event: any) => (
                                    <tr key={event.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-4 pl-6 w-16 text-center">
                                            {event.status === 'Terminé' ? (
                                                <CheckCircle2 className="w-5 h-5 text-white/20 mx-auto" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-blue-500/50 mx-auto" />
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className={`font-bold text-base transition-colors ${event.status === 'Terminé' ? 'text-white/40' : 'text-white group-hover:text-blue-400'}`}>{event.title}</span>
                                                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest mt-0.5">{event.type}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-white/70">
                                            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-white/40" /> {event.time}</div>
                                            <div className="text-xs text-white/40 mt-1 ml-5">{event.day}</div>
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(event)} className="p-2 text-white/40 hover:text-blue-400 bg-white/5 hover:bg-blue-400/10 rounded-lg transition-colors" title="Éditer">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => { if (confirm("Supprimer ce créneau ?")) deleteItem(event.id); }} className="p-2 text-white/40 hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors" title="Désactiver">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <CalendarDays className="w-5 h-5 text-blue-500" />
                                {isEditing ? `Modifier : ${formData.title}` : `Nouveau créneau agenda`}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="agenda-form" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Titre du programme / événement</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        placeholder="Ex: Le Morning..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Intervenants dans l'émission</label>

                                    {/* Liste des tags actuels */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {(formData.show ? formData.show.split(',').map(s => s.trim()).filter(Boolean) : []).map((tag, idx) => (
                                            <span key={idx} className="bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                                                {tag}
                                                <button type="button" onClick={() => handleRemoveIntervenant(tag)} className="hover:text-white transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                        {(!formData.show || formData.show.trim() === '') && (
                                            <span className="text-white/30 text-sm italic">Aucun intervenant ajouté</span>
                                        )}
                                    </div>

                                    {/* Ajouter un tag */}
                                    <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                                        <div className="flex gap-4 mb-4">
                                            <label className="flex items-center gap-2 text-sm font-bold text-white/70 cursor-pointer">
                                                <input type="radio" name="interType" checked={intervenantType === 'equipe'} onChange={() => setIntervenantType('equipe')} className="accent-blue-500" />
                                                Membre de l'Équipe
                                            </label>
                                            <label className="flex items-center gap-2 text-sm font-bold text-white/70 cursor-pointer">
                                                <input type="radio" name="interType" checked={intervenantType === 'guest'} onChange={() => setIntervenantType('guest')} className="accent-blue-500" />
                                                Guest (Texte)
                                            </label>
                                        </div>

                                        <div className="flex gap-2">
                                            {intervenantType === 'equipe' ? (
                                                <select
                                                    value={intervenantEquipeId}
                                                    onChange={(e) => setIntervenantEquipeId(e.target.value)}
                                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50"
                                                >
                                                    <option value="">Sélectionner un membre...</option>
                                                    {equipeMembers.map((m: any) => (
                                                        <option key={m.id} value={m.name}>{m.name} {m.role ? `- ${m.role}` : ''}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={intervenantGuestText}
                                                    onChange={(e) => setIntervenantGuestText(e.target.value)}
                                                    placeholder="Nom du Guest..."
                                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50"
                                                />
                                            )}

                                            <button
                                                type="button"
                                                onClick={handleAddIntervenant}
                                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" /> Ajouter
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Horaire complet</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            placeholder="Ex: 12:00 - 14:00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Date du créneau</label>
                                        <input
                                            type="date"
                                            value={formData.day}
                                            onChange={(e) => {
                                                const d = new Date(e.target.value);
                                                if (d.getDay() === 0) {
                                                    alert("L'IUT est fermé le dimanche. Vous ne pouvez pas planifier d'émission ce jour-là.");
                                                    return;
                                                }
                                                setFormData({ ...formData, day: e.target.value });
                                            }}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Concept de l'émission</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        >
                                            <option value="default">Émission Classique (Défaut)</option>
                                            <option value="matinale">La Matinale</option>
                                            <option value="podcast">Podcasts & Talks</option>
                                            <option value="night">La Night</option>
                                            <option value="mag">Les Magazines</option>
                                            <option value="Direct">Direct (Générique)</option>
                                            <option value="Replay">Replay</option>
                                            <option value="Playlist">Playlist</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Statut</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        >
                                            <option value="Planifié">Planifié</option>
                                            <option value="En cours">En cours</option>
                                            <option value="Terminé">Terminé</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3 mt-auto">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isSaving}
                                className="px-5 py-2.5 rounded-xl font-bold text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                form="agenda-form"
                                disabled={isSaving}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all disabled:opacity-50 bg-blue-600 hover:bg-blue-700 shadow-blue-500/20`}
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : isEditing ? 'Enregistrer' : 'Planifier'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
