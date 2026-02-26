"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { Map, Swords, Target, Flame, Trophy, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardData {
    streak?: { currentStreak: number };
    totalSolved?: number;
    ranking?: { tier: string; totalScore: number };
    currentRegion?: { name: string };
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const user = useAuthStore((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/dashboard");
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }

    const { streak, totalSolved, ranking, currentRegion } = data;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            {/* Header Profile Section */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 box-glow relative overflow-hidden text-center md:text-left">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px]" />

                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-brand-500 p-1">
                        <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-brand-500 to-cyber-purple text-transparent bg-clip-text">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-black border border-white/20 px-2 py-0.5 rounded text-xs font-bold text-cyber-purple">
                        LVL 1
                    </div>
                </div>

                <div className="flex-1">
                    <h2 className="text-3xl font-black tracking-tight mb-1 text-white">{ranking?.tier.toUpperCase()}</h2>
                    <p className="text-gray-400">Total Score: {ranking?.totalScore}</p>
                </div>

                <div className="flex gap-4 sm:gap-8 w-full md:w-auto mt-6 md:mt-0 justify-center">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <span className="text-2xl font-bold">{streak?.currentStreak || 0}</span>
                        </div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Day Streak</p>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            <span className="text-2xl font-bold">{totalSolved}</span>
                        </div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Anomalies Fixed</p>
                    </div>
                </div>
            </div>

            {/* Main Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Solo Adventure */}
                <motion.button
                    onClick={() => router.push('/dashboard/adventure')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative h-64 bg-black/40 border border-white/10 rounded-2xl overflow-hidden text-left p-6 transition-colors hover:border-brand-500/50"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Map className="w-10 h-10 text-brand-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-2 text-white">Solo Adventure</h3>
                    <p className="text-gray-400 mb-6 line-clamp-2">Continue repairing the {currentRegion?.name || 'Structured Realm'} through algorithm mastery.</p>

                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-brand-400 font-semibold text-sm">
                        <span>RESUME MISSION</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </motion.button>

                {/* Multiplayer Room */}
                <motion.button
                    onClick={() => router.push('/dashboard/multiplayer')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative h-64 bg-black/40 border border-white/10 rounded-2xl overflow-hidden text-left p-6 transition-colors hover:border-cyber-pink/50"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyber-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Swords className="w-10 h-10 text-cyber-pink mb-4" />
                    <h3 className="text-2xl font-bold mb-2 text-white">Multiplayer Arena</h3>
                    <p className="text-gray-400 mb-6">Compete against other Code Fixers in real-time latency battles.</p>

                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-cyber-pink font-semibold text-sm">
                        <span>FIND MATCH</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </motion.button>

                {/* Daily Quest */}
                <motion.button
                    onClick={() => console.log('Daily quests not implemented yet')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative h-64 bg-black/40 border border-white/10 rounded-2xl overflow-hidden text-left p-6 transition-colors hover:border-neon-blue/50"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Target className="w-10 h-10 text-neon-blue mb-4" />
                    <h3 className="text-2xl font-bold mb-2 text-white">Daily Override</h3>
                    <p className="text-gray-400 mb-6">Short high-priority tasks issued by the Kernel. Resets every 24h.</p>

                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-neon-blue font-semibold text-sm">
                        <span>VIEW QUEST</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </motion.button>

            </div>

            {/* Progress Section */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 relative">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-cyber-purple" /> Realm Status</h3>
                <p className="text-gray-400 text-sm mb-6">Your current active node: <strong className="text-white">{currentRegion?.name || 'Village of Primitives'}</strong></p>

                <div className="w-full bg-white/5 rounded-full h-3 mb-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-500 to-cyber-purple h-3 rounded-full w-1/4" />
                </div>
                <p className="text-xs text-right text-gray-500 font-mono">25% RESTORED</p>
            </div>

        </div>
    );
}
