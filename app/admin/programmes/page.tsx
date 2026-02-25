"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Calendar, Mic, Headphones, X, UploadCloud, Loader2 } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminProgrammesPage() {
    const { data: programmes, addItem, updateItem, deleteItem } = useAdminData("programmes");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        hosts: "",
        type: "Émission",
        nextDate: "Aujourd'hui",
        duration: "01:00",
        image: ""
    });

    const [file, setFile] = useState<File | null>(null);

    const openAddModal = (type: string) => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            title: "",
            hosts: "",
            type: type,
            nextDate: "Aujourd'hui",
            duration: "01:00",
            image: ""
        });
        setFile(null);
        setIsModalOpen(true);
    };

    const openEditModal = (prog: any) => {
        setIsEditing(true);
        setCurrentId(prog.id);
        setFormData({
            title: prog.title,
            hosts: prog.hosts || "",
            type: prog.type || "Émission",
            nextDate: prog.nextDate || "Aujourd'hui",
            duration: prog.duration || "01:00",
            image: prog.image || ""
        });
        setFile(null);
        setIsModalOpen(true);
    };

    const handleUploadImage = async (fileToUpload: File) => {
        try {
            const fileExt = fileToUpload.name.split('.').pop();
            const fileName = `programmes/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images') // Assume 'images' is the bucket name
                .upload(filePath, fileToUpload);

            if (uploadError) {
                console.error("Erreur d'upload:", uploadError);
                alert("Erreur lors du transfert de l'image. Avez-vous créé le bucket 'images' sur Supabase et configuré ses politiques de sécurité ?");
                return null;
            }

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error("Erreur d'upload inattendue:", error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        let finalImageUrl = formData.image;

        if (file) {
            const uploadedUrl = await handleUploadImage(file);
            if (uploadedUrl) {
                finalImageUrl = uploadedUrl;
            }
        }

        const progData = {
            ...formData,
            image: finalImageUrl
        };

        if (isEditing && currentId) {
            await updateItem(currentId, progData);
        } else {
            await addItem(progData);
        }

        setIsSaving(false);
        setIsModalOpen(false);
    };

    const filteredProgrammes = programmes.filter((p: any) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.hosts?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProgrammes.length / itemsPerPage);
    const paginatedProgrammes = filteredProgrammes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                        <Mic className="w-8 h-8 text-purple-500" />
                        Gestion des Programmes
                    </h1>
                    <p className="text-white/50">Gérez vos podcasts et les informations des émissions récurrentes.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => openAddModal("Podcast")} className="flex items-center gap-2 px-5 py-3 bg-purple-600/20 text-purple-400 border border-purple-500/50 font-bold rounded-xl hover:bg-purple-600/30 transition-all">
                        <Headphones className="w-5 h-5" /> Ajouter Podcast
                    </button>
                    <button onClick={() => openAddModal("Émission")} className="flex items-center gap-2 px-5 py-3 bg-oxy-orange text-white font-bold rounded-xl shadow-[0_0_20px_rgba(255,102,0,0.3)] hover:bg-orange-600 transition-all transform hover:-translate-y-0.5">
                        <Plus className="w-5 h-5" /> Créer Émission
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/[0.02]">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-white/30" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher un programme..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-black/20 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-white/40 font-bold">
                                <th className="p-4 pl-6">Programme</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Planification / Dispo</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {paginatedProgrammes.map((prog: any) => (
                                <tr key={prog.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            {prog.image && (
                                                <img src={prog.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white text-base group-hover:text-purple-400 transition-colors cursor-pointer">{prog.title}</span>
                                                <span className="text-xs font-semibold text-white/40 tracking-wider">Animé par {prog.hosts}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider
                                            ${prog.type?.includes('Podcast') ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}
                                        `}>
                                            {prog.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-white/70">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md text-xs font-bold"><Calendar className="w-3 h-3" /> {prog.nextDate}</span>
                                            <span className="text-xs text-white/50">{prog.duration}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/programmes/${prog.id}`} className="px-4 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                                                Gérer Épisodes
                                            </Link>
                                            <button onClick={() => openEditModal(prog)} className="p-2 text-white/40 hover:text-blue-400 bg-white/5 hover:bg-blue-400/10 rounded-lg transition-colors" title="Éditer">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => { if (confirm("Supprimer ce programme ?")) deleteItem(prog.id); }} className="p-2 text-white/40 hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors" title="Désactiver">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <span className="text-sm text-white/50">
                            Affichage {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredProgrammes.length)} sur {filteredProgrammes.length}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg disabled:opacity-50 transition-colors"
                            >
                                Précédent
                            </button>
                            <div className="flex items-center gap-1 hidden sm:flex">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-purple-500 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <span className="text-sm font-bold text-white/70 mx-2 sm:hidden">{currentPage} / {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg disabled:opacity-50 transition-colors"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                {formData.type === "Podcast" ? <Headphones className="w-5 h-5 text-purple-400" /> : <Mic className="w-5 h-5 text-oxy-orange" />}
                                {isEditing ? `Modifier : ${formData.title}` : `Nouveau ${formData.type}`}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="prog-form" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Titre du programme</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                        placeholder="Ex: Le Morning..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Animateurs (Texte)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.hosts}
                                        onChange={(e) => setFormData({ ...formData, hosts: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                        placeholder="Ex: Audric et Marius"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Date / Info (Texte)</label>
                                        <input
                                            type="text"
                                            value={formData.nextDate}
                                            onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="Ex: Mercredi à 12h"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Durée formatée</label>
                                        <input
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="Ex: 01:30"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Vignette (Optionnel)</label>
                                    <div className="flex items-center gap-4">
                                        {(file || formData.image) && (
                                            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-purple-500 shrink-0">
                                                <img
                                                    src={file ? URL.createObjectURL(file) : formData.image}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <label className="flex-1 flex flex-col items-center justify-center h-full min-h-[5rem] px-4 py-2 border-2 text-white border-white/20 border-dashed rounded-xl cursor-pointer hover:bg-white/5 hover:border-purple-500 transition-colors group">
                                            <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                                <UploadCloud className="w-6 h-6 mb-2 text-white/40 group-hover:text-purple-500" />
                                                <p className="text-xs text-white/60 text-center"><span className="font-bold group-hover:text-purple-500">Importer</span> une image de couverture</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        setFile(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>
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
                                form="prog-form"
                                disabled={isSaving}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all disabled:opacity-50 ${formData.type === 'Podcast' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20' : 'bg-oxy-orange hover:bg-orange-600 shadow-oxy-orange/20'}`}
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : isEditing ? 'Enregistrer' : 'Créer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
