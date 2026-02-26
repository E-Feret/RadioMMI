"use client";

import { useState } from "react";
import { Mail, Search, Trash2, Download, Send, AlertTriangle, X, Loader2 } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

export default function AdminNewsletterPage() {
    const { data: subscribers, deleteItem } = useAdminData("newsletter");
    const { data: settings } = useAdminData("settings");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Campaign states
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
    const [campaignStatus, setCampaignStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [campaignData, setCampaignData] = useState({ subject: "", content: "", senderEmail: "" });

    // Computed properties
    const activeSubscribers = subscribers.filter((s: any) => s.status === 'Actif').length;

    const filteredSubscribers = subscribers.filter((s: any) =>
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
    const paginatedSubscribers = filteredSubscribers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleDownloadCSV = () => {
        const headers = ["Email", "Statut", "Date d'inscription"];
        const csvContent = [
            headers.join(","),
            ...filteredSubscribers.map((s: any) => `${s.email},${s.status},${s.date || new Date(s.created_at).toLocaleDateString('fr-FR')}`)
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `newsletter_radio_mmi_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSendCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!campaignData.subject || !campaignData.content) {
            alert("Veuillez remplir le sujet et le contenu.");
            return;
        }

        if (activeSubscribers === 0) {
            alert("Aucun abonné actif pour recevoir cette campagne.");
            return;
        }

        if (!confirm(`Confirmer l'envoi irréversible de cet email à ${activeSubscribers} abonné(s) ?`)) return;

        setCampaignStatus("loading");

        try {
            const sender = campaignData.senderEmail || (settings as any)?.email || "contact@feret-erwann.fr";

            const res = await fetch("/api/newsletter/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: campaignData.subject,
                    htmlContent: campaignData.content,
                    senderEmail: sender
                })
            });

            const result = await res.json();

            if (!res.ok) {
                alert(`Erreur d'envoi: ${result.error}`);
            } else {
                alert("Campagne expédiée avec succès !");
                setIsCampaignModalOpen(false);
                setCampaignData({ subject: "", content: "", senderEmail: "" });
            }
        } catch (error) {
            console.error(error);
            alert("Erreur réseau");
        } finally {
            setCampaignStatus("idle");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                        <Mail className="w-8 h-8 text-blue-500" />
                        Newsletter
                    </h1>
                    <p className="text-white/50">Gérez vos abonnés et préparez vos envois d'emails.</p>
                </div>
                <button
                    onClick={handleDownloadCSV}
                    disabled={filteredSubscribers.length === 0}
                    className="flex items-center gap-2 px-5 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all font-sans border border-white/10 disabled:opacity-50"
                >
                    <Download className="w-5 h-5" /> Exporter en CSV
                </button>
            </div>

            {/* Warning / Setup Notice */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                <div>
                    <h3 className="text-white font-bold mb-1">Envoi d'e-mails réels (Resend)</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Pour envoyer des mails à vos {activeSubscribers > 0 ? activeSubscribers : '...'} abonnés, vous devez configurer la clé API <strong>Resend</strong> dans les variables d'environnement (`RESEND_API_KEY`). Si celle-ci est bien configurée, le bouton Créer Campagne est sécurisé et fonctionnel.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setCampaignData(prev => ({ ...prev, senderEmail: (settings as any)?.email || "contact@feret-erwann.fr" }));
                        setIsCampaignModalOpen(true);
                    }}
                    disabled={activeSubscribers === 0}
                    className="hidden md:flex ml-auto items-center gap-2 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    <Send className="w-4 h-4" /> Créer Campagne
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6">
                    <p className="text-sm text-white/40 font-bold mb-1 uppercase tracking-wider">Total Inscrits</p>
                    <p className="text-3xl font-black text-white">{subscribers.length}</p>
                </div>
                <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6">
                    <p className="text-sm text-white/40 font-bold mb-1 uppercase tracking-wider">Abonnés Actifs</p>
                    <p className="text-3xl font-black text-green-400">{activeSubscribers}</p>
                </div>
                <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6">
                    <p className="text-sm text-white/40 font-bold mb-1 uppercase tracking-wider">Désabonnés</p>
                    <p className="text-3xl font-black text-red-400">{subscribers.length - activeSubscribers}</p>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                {/* Toolbar */}
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/[0.02]">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-white/30" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher par email..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-black/20 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-white/40 font-bold">
                                <th className="p-4 pl-6">Adresse Email</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4">Date Inscription</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {paginatedSubscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-white/40">
                                        Aucun abonné trouvé. Attention : La table 'newsletter' doit exister sur Supabase.
                                    </td>
                                </tr>
                            ) : (
                                paginatedSubscribers.map((sub: any) => (
                                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 pl-6 font-medium text-white">
                                            {sub.email}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider
                                                ${sub.status === 'Actif' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}
                                            `}>
                                                {sub.status || "Inconnu"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-white/50">
                                            {sub.date || new Date(sub.created_at || Date.now()).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { if (confirm("Désinscrire / Supprimer cet email ?")) deleteItem(sub.id); }}
                                                    className="p-2 text-white/40 hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <span className="text-sm text-white/50">
                            Affichage {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredSubscribers.length)} sur {filteredSubscribers.length}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg disabled:opacity-50 transition-colors"
                            >
                                Précédent
                            </button>
                            <span className="text-sm font-bold text-white/70 mx-2">{currentPage} / {totalPages}</span>
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

            {/* Campaign Modal */}
            {isCampaignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Send className="w-5 h-5 text-blue-400" />
                                Nouvelle Campagne d'E-mail
                            </h3>
                            <button onClick={() => setIsCampaignModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="campaign-form" onSubmit={handleSendCampaign} className="space-y-5">
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                    <p className="text-sm font-bold text-blue-400">Attention</p>
                                    <p className="text-xs text-white/70 mt-1">L'envoi sera effectué à {activeSubscribers} abonné(s) depuis l'adresse d'expédition configurée ci-dessous. Le domaine expéditeur doit être validé chez votre fournisseur (Resend).</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Expéditeur (Réponse)</label>
                                        <input
                                            type="email"
                                            value={campaignData.senderEmail}
                                            onChange={(e) => setCampaignData({ ...campaignData, senderEmail: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            placeholder="Ex: contact@radiommi.fr"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-white/70 mb-2">Sujet du mail</label>
                                        <input
                                            type="text"
                                            required
                                            value={campaignData.subject}
                                            onChange={(e) => setCampaignData({ ...campaignData, subject: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            placeholder="Découvrez notre nouvelle grille d'été !"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white/70 mb-2">Corps du message (Supporte le HTML basique)</label>
                                    <textarea
                                        required
                                        value={campaignData.content}
                                        onChange={(e) => setCampaignData({ ...campaignData, content: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[300px] font-mono text-sm resize-y custom-scrollbar"
                                        placeholder="<p>Bonjour à tous ! Voici les dernières nouvelles de Radio MMI...</p>"
                                    />
                                    <p className="text-xs text-white/40 mt-2">Vous pouvez utiliser des balises HTML comme &lt;b&gt;, &lt;strong&gt;, &lt;br&gt;, &lt;a href="..."&gt;, &lt;h1&gt;, etc.</p>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between mt-auto">
                            <span className="text-xs text-white/40">{activeSubscribers} destinataire(s)</span>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCampaignModalOpen(false)}
                                    disabled={campaignStatus === "loading"}
                                    className="px-5 py-2.5 rounded-xl font-bold text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    form="campaign-form"
                                    disabled={campaignStatus === "loading"}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                                >
                                    {campaignStatus === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Envoyer la Campagne</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
