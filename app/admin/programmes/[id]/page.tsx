"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Search, Edit2, Trash2, Calendar, Headphones, PlayCircle, X, Loader2 } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminEpisodesPage() {
    const params = useParams();
    const programmeId = params.id as string;

    const { data: programmes } = useAdminData("programmes");
    const { data: allEpisodes, addItem, updateItem, deleteItem } = useAdminData("episodes");

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Filter episodes by programme
    const episodes = allEpisodes.filter((e: any) => e.programme_id === parseInt(programmeId, 10));
    const programme = programmes.find((p: any) => p.id === parseInt(programmeId, 10));

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isUploadingAudio, setIsUploadingAudio] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        duration: "45:00",
        audio_url: ""
    });

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            title: "",
            description: "",
            date: new Date().toISOString().split('T')[0],
            duration: "45:00",
            audio_url: ""
        });
        setAudioFile(null);
        setIsModalOpen(true);
    };

    const openEditModal = (ep: any) => {
        setIsEditing(true);
        setCurrentId(ep.id);
        setFormData({
            title: ep.title,
            description: ep.description || "",
            date: ep.date || new Date().toISOString().split('T')[0],
            duration: ep.duration || "45:00",
            audio_url: ep.audio_url || ""
        });
        setAudioFile(null);
        setIsModalOpen(true);
    };

    const handleUploadAudio = async (fileToUpload: File) => {
        try {
            setIsUploadingAudio(true);
            const fileExt = fileToUpload.name.split('.').pop();
            const fileName = `podcasts/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('podcasts') // Assume 'podcasts' is the bucket name
                .upload(filePath, fileToUpload);

            if (uploadError) {
                console.error("Erreur d'upload audio:", uploadError);
                alert("Erreur lors du transfert de l'audio. Avez-vous créé le bucket 'podcasts' sur Supabase et configuré ses politiques de sécurité ?");
                setIsUploadingAudio(false);
                return null;
            }

            const { data } = supabase.storage.from('podcasts').getPublicUrl(filePath);
            setIsUploadingAudio(false);
            return data.publicUrl;
        } catch (error) {
            console.error("Erreur d'upload inattendue:", error);
            setIsUploadingAudio(false);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        let finalAudioUrl = formData.audio_url;

        if (audioFile) {
            const uploadedUrl = await handleUploadAudio(audioFile);
            if (uploadedUrl) {
                finalAudioUrl = uploadedUrl;
            }
        }

        const epData = {
            ...formData,
            audio_url: finalAudioUrl,
            programme_id: parseInt(programmeId, 10)
        };

        if (isEditing && currentId) {
            await updateItem(currentId, epData);
        } else {
            await addItem(epData);
        }

        setIsSaving(false);
        setIsModalOpen(false);
    };

    const filteredEpisodes = episodes.filter((p: any) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEpisodes.length / itemsPerPage);
    const paginatedEpisodes = filteredEpisodes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <Link href="/admin/programmes" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors w-fit font-bold">
                    <ArrowLeft className="w-5 h-5" /> Retour aux programmes
                </Link>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                            <Headphones className="w-8 h-8 text-purple-400" />
                            Épisodes : {programme?.title || "Chargement..."}
                        </h1>
                        <p className="text-white/50">Gérez les épisodes et replays de ce programme.</p>
                    </div>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:bg-purple-700 transition-all transform hover:-translate-y-0.5">
                        <Plus className="w-5 h-5" /> Ajouter un Épisode
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
                            placeholder="Rechercher un épisode..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-black/20 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                </div>

                {filteredEpisodes.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-white/10 mb-4" />
                        <h3 className="text-xl font-bold text-white/50 mb-2">Aucun épisode</h3>
                        <p className="text-white/30 text-sm">Ajoutez votre premier épisode pour ce programme.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-white/40 font-bold">
                                        <th className="p-4 pl-6">Titre de l'Épisode</th>
                                        <th className="p-4">Date de Sortie</th>
                                        <th className="p-4">Durée</th>
                                        <th className="p-4 pr-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {paginatedEpisodes.map((ep: any) => (
                                        <tr key={ep.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-4 pl-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white text-base group-hover:text-purple-400 transition-colors cursor-pointer">{ep.title}</span>
                                                    <span className="text-xs font-semibold text-white/40 tracking-wider truncate max-w-sm">{ep.description || "Aucune description"}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-white/70">
                                                <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-white/40" /> {ep.date}</div>
                                            </td>
                                            <td className="p-4 text-sm font-bold text-white/50">
                                                {ep.duration}
                                            </td>
                                            <td className="p-4 pr-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openEditModal(ep)} className="p-2 text-white/40 hover:text-blue-400 bg-white/5 hover:bg-blue-400/10 rounded-lg transition-colors" title="Éditer">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => { if (confirm("Supprimer cet épisode ?")) deleteItem(ep.id); }} className="p-2 text-white/40 hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors" title="Supprimer">
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
                                    Affichage {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredEpisodes.length)} sur {filteredEpisodes.length}
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
                    </>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-purple-400" />
                                {isEditing ? `Modifier : ${formData.title}` : `Nvel Épisode`}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="ep-form" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Titre de l'épisode</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                        placeholder="Titre..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Date (Format Text/Date)</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="Ex: 24 Fév 2026"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Durée (HH:MM:SS)</label>
                                        <input
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="Ex: 45:00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Courte Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none h-24"
                                        placeholder="Dans cet épisode..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Fichier Audio (Prioritaire si sélectionné)</label>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 hover:border-purple-500 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <PlayCircle className="w-5 h-5 text-white/40 group-hover:text-purple-500" />
                                                <span className="text-sm font-bold text-white/60 group-hover:text-purple-500">
                                                    {audioFile ? audioFile.name : "Cliquez pour uploader un fichier audio (.mp3, .wav)"}
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        setAudioFile(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>

                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="h-[1px] bg-white/10 flex-1"></div>
                                            <span className="text-xs text-white/30 font-bold uppercase">OU URL EXTERNE</span>
                                            <div className="h-[1px] bg-white/10 flex-1"></div>
                                        </div>

                                        <input
                                            type="url"
                                            value={formData.audio_url}
                                            onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="https://..."
                                            disabled={audioFile !== null}
                                        />
                                        <p className="text-xs text-white/40 mt-1">Lien direct vers le fichier MP3 si vous ne l'uploadez pas ici.</p>
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
                                form="ep-form"
                                disabled={isSaving}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all disabled:opacity-50 bg-purple-600 hover:bg-purple-700 shadow-purple-500/20`}
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
