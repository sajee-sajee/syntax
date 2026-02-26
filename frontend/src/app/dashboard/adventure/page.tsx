"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Map as MapIcon, ChevronRight, Lock, Code2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Region {
    id: string;
    name: string;
    description: string;
    _count?: { levels: number };
}

export default function AdventureMap() {
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const res = await api.get("/adventure/regions");
                if (res.data.success) {
                    setRegions(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load regions", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRegions();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center gap-3 mb-8">
                <MapIcon className="w-8 h-8 text-brand-500" />
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Structured Realm Map</h1>
                    <p className="text-gray-400 text-sm mt-1">Select a region to begin repairing code anomalies.</p>
                </div>
            </div>

            <div className="space-y-6 relative">
                {/* Draw a connecting line between regions */}
                <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-white/10 hidden sm:block" />

                {regions.map((region, index) => {
                    // Mock unlocking logic - first region is unlocked, others are locked for now until we have progression tracking.
                    const isUnlocked = index === 0;

                    return (
                        <motion.div
                            key={region.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => isUnlocked && router.push(`/dashboard/adventure/${region.id}`)}
                            className={`relative flex flex-col sm:flex-row gap-6 p-6 rounded-2xl border transition-all ${isUnlocked
                                    ? "bg-black/60 border-brand-500/50 hover:border-brand-500 cursor-pointer box-glow"
                                    : "bg-black/20 border-white/5 opacity-60 cursor-not-allowed"
                                }`}
                        >
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-black border-2 border-brand-500 shrink-0">
                                {isUnlocked ? (
                                    <Code2 className="w-6 h-6 text-brand-500" />
                                ) : (
                                    <Lock className="w-6 h-6 text-gray-500" />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-bold text-white">{region.name}</h3>
                                    <span className="text-xs font-mono px-2 py-1 rounded bg-white/10 text-brand-400">
                                        {region._count?.levels || 0} SECTORS
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm">{region.description}</p>
                            </div>

                            {isUnlocked && (
                                <div className="flex items-center justify-end sm:justify-center">
                                    <ChevronRight className="w-6 h-6 text-brand-500" />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
