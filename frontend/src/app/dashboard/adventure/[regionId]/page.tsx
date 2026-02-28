"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Code2, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface Level {
    id: string;
    order: number;
    isBoss: boolean;
    title: string;
    problem?: {
        title: string;
        difficulty: 'easy' | 'medium' | 'hard';
    };
}

export default function RegionLevels() {
    const { regionId } = useParams();
    const router = useRouter();
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLevels = async () => {
            try {
                const res = await api.get(`/adventure/regions/${regionId}/levels`);
                if (res.data.success) {
                    setLevels(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (regionId) fetchLevels();
    }, [regionId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
            <button
                onClick={() => router.push("/dashboard/adventure")}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Map
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tight text-white">Sectors List</h1>
                <p className="text-gray-400 text-sm mt-1">Navigate sequentially to repair the code anomalies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {levels.map((level, idx) => {
                    const isUnlocked = idx === 0; // Simple mock progression for now

                    return (
                        <motion.div
                            key={level.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => isUnlocked && router.push(`/dashboard/adventure/level/${level.id}`)}
                            className={`p-6 rounded-2xl border transition-all relative overflow-hidden h-full flex flex-col ${isUnlocked
                                ? "bg-black/60 border-brand-500/50 hover:border-brand-500 cursor-pointer box-glow group"
                                : "bg-black/20 border-white/5 opacity-60 cursor-not-allowed"
                                }`}
                        >
                            {isUnlocked && (
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <span className="text-xs font-bold font-mono text-brand-400 px-2 py-1 rounded bg-white/10">
                                    SECTOR {level.order} {level.isBoss && "• BOSS"}
                                </span>
                                {!isUnlocked && <Lock className="w-4 h-4 text-gray-500" />}
                            </div>

                            <h3 className="text-xl font-bold mb-2 text-white relative z-10">{level.title}</h3>

                            <div className="flex-1 mt-4 relative z-10">
                                {level.problem ? (
                                    <div className="flex gap-2">
                                        <span className="text-xs px-2 py-1 rounded-full border border-white/10 text-gray-300">
                                            Algorithm: {level.problem.title}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${level.problem.difficulty === 'easy' ? 'text-green-400 bg-green-400/10 border border-green-400/20' :
                                            level.problem.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' :
                                                'text-red-400 bg-red-400/10 border border-red-400/20'
                                            }`}>
                                            {level.problem.difficulty.toUpperCase()}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <BookOpen className="w-3 h-3" /> Story only
                                    </div>
                                )}
                            </div>

                            {isUnlocked && (
                                <div className="mt-6 flex items-center justify-between text-brand-400 text-sm font-semibold relative z-10">
                                    <span>INITIATE FIX</span>
                                    <Code2 className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
