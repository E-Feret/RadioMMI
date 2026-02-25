"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError("Adresse e-mail ou mot de passe incorrect.");
            setIsLoading(false);
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 selection:bg-oxy-orange/30">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-oxy-orange/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[0%] -right-[10%] w-[40%] h-[40%] bg-oxy-blue/20 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-24 h-24 mb-6 bg-white/5 rounded-3xl border border-white/10 p-4 shadow-2xl flex items-center justify-center">
                        <Image
                            src="/assets/logo/logo.svg"
                            alt="Radio MMI Logo"
                            width={64}
                            height={64}
                            className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                        MMI <span className="text-oxy-orange">Studio</span>
                    </h1>
                    <p className="text-white/40 text-sm mt-2 font-medium tracking-widest uppercase">Espace d'Administration</p>
                </div>

                {/* Login Form */}
                <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm font-bold animate-in shake">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Adresse E-mail</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-white/30 group-focus-within:text-oxy-orange transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-oxy-orange focus:ring-1 focus:ring-oxy-orange transition-all"
                                        placeholder="admin@radiommi.fr"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Mot de passe</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-white/30 group-focus-within:text-oxy-orange transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-oxy-orange focus:ring-1 focus:ring-oxy-orange transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-white hover:bg-neutral-200 text-black rounded-xl font-black uppercase tracking-wider transition-all disabled:opacity-50 group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            {isLoading ? (
                                <span className="animate-spin inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" /> Connexion
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/30 text-xs mt-8">
                    Accès restreint aux membres de l'équipe de Radio MMI.<br />Toute tentative d'accès non autorisé est surveillée.
                </p>
            </div>
        </div>
    );
}
