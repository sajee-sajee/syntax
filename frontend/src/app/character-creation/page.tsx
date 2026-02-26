"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { User, Sparkles, Wand2 } from "lucide-react";

const AURA_COLORS = [
    { id: "aura-blue", name: "Neon Blue", class: "bg-blue-500 shadow-blue-500/50" },
    { id: "aura-purple", name: "Cyber Purple", class: "bg-purple-500 shadow-purple-500/50" },
    { id: "aura-pink", name: "Plasma Pink", class: "bg-pink-500 shadow-pink-500/50" },
    { id: "aura-green", name: "Matrix Green", class: "bg-green-500 shadow-green-500/50" },
];

export default function CharacterCreation() {
    const [displayName, setDisplayName] = useState("");
    const [aura, setAura] = useState("aura-blue");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!displayName) return;
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/character", {
                displayName,
                hair: "default",
                dress: "default",
                shoes: "default",
                aura
            });

            if (res.data.success && user && token) {
                setAuth({ ...user, characterCreated: true }, token);
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create character");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Dynamic Background based on Aura */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 ${aura === 'aura-blue' ? 'bg-blue-500/10' :
                    aura === 'aura-purple' ? 'bg-purple-500/10' :
                        aura === 'aura-pink' ? 'bg-pink-500/10' :
                            'bg-green-500/10'
                }`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-2xl bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-4 box-glow">
                        <Wand2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Initialize Your Avatar</h1>
                    <p className="text-gray-400">The Kernel requires your physical manifestation parameters.</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-8">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Name Selection */}
                    <div className="space-y-3">
                        <label className="text-sm text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                            <User className="w-4 h-4" /> Alias / Codename
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={20}
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-5 text-xl font-mono text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-white/20"
                            placeholder="e.g. NeoCoder99"
                        />
                    </div>

                    {/* Aura Selection */}
                    <div className="space-y-3">
                        <label className="text-sm text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Energy Signature
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {AURA_COLORS.map((c) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setAura(c.id)}
                                    className={`relative h-24 rounded-xl border-2 transition-all overflow-hidden flex flex-col items-center justify-center gap-2 ${aura === c.id
                                            ? 'border-white scale-105'
                                            : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full shadow-lg ${c.class}`} />
                                    <span className="text-xs font-medium text-gray-300">{c.name}</span>
                                    {aura === c.id && (
                                        <div className={`absolute inset-0 opacity-20 ${c.class}`} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !displayName}
                        className="w-full py-4 mt-8 rounded-xl font-bold tracking-widest uppercase bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                    >
                        {loading ? 'Compiling Avatar...' : 'Deploy to Realm'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
