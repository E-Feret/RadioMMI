"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");

        // Insert into Supabase table 'newsletter'
        const { error } = await supabase
            .from('newsletter')
            .insert([{
                email: email.toLowerCase().trim(),
                status: 'Actif',
                created_at: new Date().toISOString()
            }]);

        if (error) {
            console.error("Erreur Inscription Newsletter:", error.message);
            // Ignore unique constraint error gracefully if someone resubscribes
            if (error.code === '23505') {
                setStatus("success");
                setEmail("");
                setTimeout(() => setStatus("idle"), 4000);
                return;
            }
            setStatus("error");
            setTimeout(() => setStatus("idle"), 4000);
        } else {
            setStatus("success");
            setEmail("");
            setTimeout(() => setStatus("idle"), 4000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative flex items-center w-full">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse e-mail"
                    required
                    disabled={status === "loading" || status === "success"}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-4 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-oxy-orange/50 transition-all disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={status === "loading" || status === "success" || !email}
                    className="absolute right-2 p-2 bg-oxy-orange hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-oxy-orange"
                >
                    {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
            </div>

            {/* Feedback Messages */}
            {status === "success" && (
                <p className="text-sm font-bold text-green-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                    <CheckCircle2 className="w-4 h-4" /> Inscription réussie !
                </p>
            )}
            {status === "error" && (
                <p className="text-sm font-bold text-red-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4" /> Une erreur est survenue.
                </p>
            )}
        </form>
    );
}
