"use client";

import { useState, useRef } from "react";
import { Plus, Users, UserPlus, Edit2, Trash2, Shield, X, UploadCloud, Loader2 } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { supabase } from "@/lib/supabase";

export default function AdminEquipePage() {
    const { data: equipe, addItem, updateItem, deleteItem } = useAdminData("equipe");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;


    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Contributeur",
        show: "",
        isAdmin: false,
        avatar: ""
    });

    const [file, setFile] = useState<File | null>(null);

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({ name: "", email: "", role: "Contributeur", show: "", isAdmin: false, avatar: "" });
        setFile(null);
        setIsModalOpen(true);
    };

    const openEditModal = (member: any) => {
        setIsEditing(true);
        setCurrentId(member.id);
        setFormData({
            name: member.name,
            email: member.email || "",
            role: member.role || "Contributeur",
            show: member.show || "",
            isAdmin: member.isAdmin || false,
            avatar: member.avatar || ""
        });
        setFile(null);
        setIsModalOpen(true);
    };

    const handleUploadImage = async (fileToUpload: File) => {
        try {
            const fileExt = fileToUpload.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

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

        let finalAvatarUrl = formData.avatar;

        if (file) {
            const uploadedUrl = await handleUploadImage(file);
            if (uploadedUrl) {
                finalAvatarUrl = uploadedUrl;
            } else if (!finalAvatarUrl) {
                finalAvatarUrl = `https://ui-avatars.com/api/?name=${formData.name}&background=random`; // fallback
            }
        } else if (!finalAvatarUrl && !isEditing) {
            finalAvatarUrl = `https://ui-avatars.com/api/?name=${formData.name}&background=random`; // init fallback
        }

        const memberData = {
            ...formData,
            avatar: finalAvatarUrl
        };

        if (isEditing && currentId) {
            await updateItem(currentId, memberData);
        } else {
            await addItem(memberData);
        }

        setIsSaving(false);
        setIsModalOpen(false);
    };

    const totalPages = Math.ceil(equipe.length / itemsPerPage);
    const paginatedEquipe = equipe.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                        <Users className="w-8 h-8 text-green-400" />
                        Gestion de l'Équipe
                    </h1>
                    <p className="text-white/50">Ajoutez les membres de la radio, configurez leurs rôles et accès.</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-600 transition-all transform hover:-translate-y-0.5">
                    <UserPlus className="w-5 h-5" /> Ajouter un Membre
                </button>
            </div>

            {/* Content Table */}
            <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">Membres Actifs</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-white/40 font-bold">
                                <th className="p-4 pl-6">Membre</th>
                                <th className="p-4">Rôle</th>
                                <th className="p-4">Émission Rattachée</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {paginatedEquipe.map((member: any) => (
                                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`} alt={member.name} className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white text-base group-hover:text-green-400 transition-colors flex items-center gap-2">
                                                    {member.name}
                                                    {member.isAdmin && <Shield className="w-3.5 h-3.5 text-oxy-orange" />}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider
                                            ${member.isAdmin ? 'bg-oxy-orange/20 text-oxy-orange border border-oxy-orange/30' : 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'}
                                        `}>
                                            {member.isAdmin ? "Administrateur" : member.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-white/70">
                                        {member.show || '-'}
                                    </td>
                                    <td className="p-4 pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEditModal(member)} className="p-2 text-white/40 hover:text-green-400 bg-white/5 hover:bg-green-400/10 rounded-lg transition-colors" title="Éditer">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => { if (confirm("Voulez-vous supprimer ce membre ?")) deleteItem(member.id); }} className="p-2 text-white/40 hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors" title="Supprimer">
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
                            Affichage {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, equipe.length)} sur {equipe.length}
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
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-green-500 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white'
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
                                {isEditing ? "Modifier le membre" : "Ajouter un membre"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="equipe-form" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Prénom et Nom</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50"
                                        placeholder="Ex: Jean Dupont"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Adresse E-mail (Importante pour la connexion)</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50"
                                        placeholder="jean.dupont@webradio.fr"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Rôle</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50"
                                            placeholder="Ex: Animateur"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Émission</label>
                                        <input
                                            type="text"
                                            value={formData.show}
                                            onChange={(e) => setFormData({ ...formData, show: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50"
                                            placeholder="Ex: Le Réveil"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Avatar / Photo de profil</label>
                                    <div className="flex items-center gap-4">
                                        {(file || formData.avatar) && (
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500 shrink-0">
                                                <img
                                                    src={file ? URL.createObjectURL(file) : formData.avatar}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <label className="flex-1 flex flex-col items-center justify-center h-full min-h-[5rem] px-4 py-2 border-2 text-white border-white/20 border-dashed rounded-xl cursor-pointer hover:bg-white/5 hover:border-green-400 transition-colors group">
                                            <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                                <UploadCloud className="w-6 h-6 mb-2 text-white/40 group-hover:text-green-400" />
                                                <p className="text-xs text-white/60 text-center"><span className="font-bold group-hover:text-green-400">Cliquez pour importer</span> une nouvelle image</p>
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

                                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.isAdmin}
                                        onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                                        className="w-5 h-5 rounded border-white/20 text-oxy-orange focus:ring-oxy-orange bg-black/40"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">Administrateur</span>
                                        <span className="text-xs text-white/50">Donne l'accès complet au panneau d'administration MMI.</span>
                                    </div>
                                </label>
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
                                form="equipe-form"
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : isEditing ? 'Enregistrer' : 'Ajouter'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
