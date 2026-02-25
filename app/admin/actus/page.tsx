"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Calendar, FileText, X, UploadCloud, Loader2 } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { supabase } from "@/lib/supabase";

export default function AdminActusPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const { data: articles, addItem, updateItem, deleteItem } = useAdminData("actus");

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        category: "Campus",
        status: "Brouillon",
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
        views: 0,
        image: ""
    });

    const [file, setFile] = useState<File | null>(null);

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            title: "",
            category: "Campus",
            status: "Brouillon",
            date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
            views: 0,
            image: ""
        });
        setFile(null);
        setIsModalOpen(true);
    };

    const openEditModal = (article: any) => {
        setIsEditing(true);
        setCurrentId(article.id);
        setFormData({
            title: article.title,
            category: article.category || "Campus",
            status: article.status || "Brouillon",
            date: article.date || new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
            views: article.views || 0,
            image: article.image || ""
        });
        setFile(null);
        setIsModalOpen(true);
    };

    const handleUploadImage = async (fileToUpload: File) => {
        try {
            const fileExt = fileToUpload.name.split('.').pop();
            const fileName = `actus/${Math.random()}.${fileExt}`;
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

        const articleData = {
            ...formData,
            image: finalImageUrl
        };

        if (isEditing && currentId) {
            await updateItem(currentId, articleData);
        } else {
            await addItem(articleData);
        }

        setIsSaving(false);
        setIsModalOpen(false);
    };

    const filteredArticles = articles.filter((a: any) =>
        a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const paginatedArticles = filteredArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                        <FileText className="w-8 h-8 text-oxy-orange" />
                        Gestion des Actualités
                    </h1>
                    <p className="text-white/50">Créez, modifiez ou supprimez les articles de la newsroom.</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-3 bg-oxy-orange text-white font-bold rounded-xl shadow-lg hover:shadow-oxy-orange/30 hover:bg-orange-600 transition-all font-sans transform hover:-translate-y-0.5">
                    <Plus className="w-5 h-5" /> Nouvel Article
                </button>
            </div>

            {/* Content Table / Filters */}
            <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                {/* Toolbar */}
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/[0.02]">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-white/30" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher un article..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-black/20 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-oxy-orange focus:border-oxy-orange transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select className="bg-black/20 border border-white/10 text-white text-sm rounded-xl px-4 py-2 focus:ring-1 focus:ring-oxy-orange outline-none">
                            <option value="all">Toutes les catégories</option>
                            <option value="campus">Campus</option>
                            <option value="tech">Projets Tech</option>
                            <option value="culture">Culture</option>
                        </select>
                        <select className="bg-black/20 border border-white/10 text-white text-sm rounded-xl px-4 py-2 focus:ring-1 focus:ring-oxy-orange outline-none">
                            <option value="all">Tous les statuts</option>
                            <option value="published">Publiés</option>
                            <option value="draft">Brouillons</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-white/40 font-bold">
                                <th className="p-4 pl-6">Article</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-center">Vues</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {paginatedArticles.map((article: any) => (
                                <tr key={article.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            {article.image && (
                                                <img src={article.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" />
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white text-base group-hover:text-oxy-orange transition-colors cursor-pointer line-clamp-1">{article.title}</span>
                                                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">{article.category}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider
                                            ${article.status === 'Publié' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : ''}
                                            ${article.status === 'Brouillon' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : ''}
                                            ${article.status === 'Archivé' ? 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20' : ''}
                                        `}>
                                            {article.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-white/50 flex items-center gap-2 mt-2">
                                        <Calendar className="w-4 h-4" /> {article.date}
                                    </td>
                                    <td className="p-4 text-sm font-bold text-white/70 text-center">
                                        {article.views?.toLocaleString('fr-FR') || 0}
                                    </td>
                                    <td className="p-4 pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(article)}
                                                className="p-2 text-white/40 hover:text-blue-400 bg-white/5 hover:bg-blue-400/10 rounded-lg transition-colors" title="Éditer">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => { if (confirm("Supprimer cet article ?")) deleteItem(article.id); }} className="p-2 text-white/40 hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors" title="Supprimer">
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
                            Affichage {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredArticles.length)} sur {filteredArticles.length}
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
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-oxy-orange text-white' : 'text-white/50 hover:bg-white/10 hover:text-white'
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
                            <h3 className="text-xl font-bold text-white">
                                {isEditing ? "Modifier l'article" : "Créer un article"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="actus-form" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Titre de l'article</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-oxy-orange/50"
                                        placeholder="Titre accrocheur..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Catégorie</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-oxy-orange/50"
                                        >
                                            <option value="Campus">Campus</option>
                                            <option value="Projets Tech">Projets Tech</option>
                                            <option value="Culture">Culture</option>
                                            <option value="La Radio">La Radio</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Statut</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-oxy-orange/50"
                                        >
                                            <option value="Brouillon">Brouillon</option>
                                            <option value="Publié">Publié</option>
                                            <option value="Archivé">Archivé</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Date (Texte)</label>
                                        <input
                                            type="text"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-oxy-orange/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Vues (Fictif)</label>
                                        <input
                                            type="number"
                                            value={formData.views}
                                            onChange={(e) => setFormData({ ...formData, views: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-oxy-orange/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Image d'illustration (Optionnel)</label>
                                    <div className="flex items-center gap-4">
                                        {(file || formData.image) && (
                                            <div className="w-24 h-16 rounded-lg overflow-hidden border-2 border-oxy-orange shrink-0">
                                                <img
                                                    src={file ? URL.createObjectURL(file) : formData.image}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <label className="flex-1 flex flex-col items-center justify-center h-full min-h-[5rem] px-4 py-2 border-2 text-white border-white/20 border-dashed rounded-xl cursor-pointer hover:bg-white/5 hover:border-oxy-orange transition-colors group">
                                            <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                                <UploadCloud className="w-6 h-6 mb-2 text-white/40 group-hover:text-oxy-orange" />
                                                <p className="text-xs text-white/60 text-center"><span className="font-bold group-hover:text-oxy-orange">Importer</span> une image</p>
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
                                form="actus-form"
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-oxy-orange hover:bg-orange-600 shadow-lg shadow-oxy-orange/20 transition-all disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : isEditing ? 'Enregistrer' : 'Publier'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
