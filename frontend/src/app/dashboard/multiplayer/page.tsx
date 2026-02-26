"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { io, Socket } from "socket.io-client";
import { Users, Swords, Crown, Play, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";

let socket: Socket;

export default function MultiplayerRoom() {
    const user = useAuthStore((state) => state.user);
    const router = useRouter();
    const [roomCode, setRoomCode] = useState("");
    const [inRoom, setInRoom] = useState(false);
    const [gameState, setGameState] = useState<any>(null);
    const [problem, setProblem] = useState<any>(null);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4000");

        socket.on("room_updated", (data) => {
            setGameState(data);
        });

        socket.on("game_started", (data) => {
            setProblem(data.problem);
            if (data.problem?.starterCode) {
                setCode(data.problem.starterCode["python"] || "def solve():\n    pass");
            }
        });

        socket.on("leaderboard_updated", (leaders) => {
            setGameState((prev: any) => ({ ...prev, participants: leaders }));
        });

        socket.on("error", (err) => {
            setError(err.message);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const createRoom = () => {
        socket.emit("create_room", {
            userId: user?.id,
            characterName: user?.email?.split('@')[0],
            difficulty: "medium"
        });
        setInRoom(true);
    };

    const joinRoom = () => {
        if (!roomCode) return;
        socket.emit("join_room", {
            roomCode: roomCode.toUpperCase(),
            userId: user?.id,
            characterName: user?.email?.split('@')[0]
        });
        setInRoom(true);
    };

    const startGame = () => {
        if (gameState?.id) {
            socket.emit("start_game", { roomCode: gameState.id });
        }
    };

    const handleTestRun = () => {
        // Mock execution that gives a random score boost
        const newTestsPassed = Math.floor(Math.random() * 5) + 1;
        const newScore = newTestsPassed * 10;

        socket.emit("submit_progress", {
            roomCode: gameState.id,
            userId: user?.id,
            testsPassed: newTestsPassed,
            score: newScore
        });
    };

    if (!inRoom) {
        return (
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center box-glow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-pink/20 rounded-full blur-[50px]" />
                    <Swords className="w-16 h-16 text-cyber-pink mx-auto mb-6" />
                    <h1 className="text-3xl font-black mb-2 text-white">Multiplayer Arena</h1>
                    <p className="text-gray-400 mb-8">Race against other Code Fixers in real-time latency battles.</p>

                    <button
                        onClick={createRoom}
                        className="w-full py-4 bg-cyber-pink hover:bg-pink-500 text-white rounded-xl font-bold tracking-widest shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all mb-6"
                    >
                        CREATE NEW LOBBY
                    </button>

                    <div className="relative flex items-center py-5">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">OR JOIN EXISTING</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="ENTER ROOM CODE"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                            className="flex-1 bg-black border border-white/20 rounded-lg px-4 text-center tracking-widest text-white uppercase focus:border-neon-blue focus:outline-none"
                        />
                        <button
                            onClick={joinRoom}
                            className="px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors"
                        >
                            JOIN
                        </button>
                    </div>
                    {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 animate-in fade-in">
            {/* Left Pane: Game/Editor */}
            <div className="w-full lg:w-3/4 flex flex-col gap-4">
                {gameState?.status === 'waiting' ? (
                    <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 box-glow">
                        <h2 className="text-4xl font-black text-white tracking-widest mb-4">LOBBY CODE: <span className="text-cyber-pink text-glow">{gameState.id}</span></h2>
                        <p className="text-gray-400 mb-8 max-w-md text-center">Share this code with other Code Fixers. The host can initiate the synchronization sequence when ready.</p>

                        {gameState.hostId === user?.id && (
                            <button
                                onClick={startGame}
                                className="py-4 px-12 bg-white text-black hover:bg-gray-200 rounded-xl font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
                            >
                                INITIATE ALGORITHM
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 bg-[#1e1e1e] border border-cyber-pink/30 rounded-2xl flex flex-col overflow-hidden box-glow relative">
                        <div className="h-12 border-b border-white/10 bg-black/60 flex items-center justify-between px-4">
                            <span className="font-bold text-white text-sm flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-brand-400" /> Topic: {problem?.title || "Unknown Anomaly"}
                            </span>
                            <button
                                onClick={handleTestRun}
                                className="px-4 py-1.5 bg-cyber-pink hover:bg-pink-500 text-white font-bold rounded shadow-[0_0_10px_rgba(236,72,153,0.5)] flex items-center gap-2 text-sm transition-all"
                            >
                                <Play className="w-4 h-4" /> Run Integration Tests
                            </button>
                        </div>
                        <div className="flex-1 relative">
                            <Editor
                                height="100%"
                                language="python"
                                theme="vs-dark"
                                value={code}
                                onChange={(val) => setCode(val || "")}
                                options={{ minimap: { enabled: false }, fontSize: 15 }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Right Pane: Live Leaderboard */}
            <div className="w-full lg:w-1/4 bg-black/40 border border-white/10 rounded-2xl p-6 box-glow h-full overflow-y-auto">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                    <Users className="w-5 h-5 text-cyber-purple" />
                    Active Fixers
                </h3>

                <div className="space-y-4">
                    <AnimatePresence>
                        {gameState?.participants.map((p: any, idx: number) => (
                            <motion.div
                                key={p.userId}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-xl border ${p.userId === user?.id ? 'bg-white/10 border-white/30' : 'bg-black/50 border-white/5'} flex items-center gap-4 relative overflow-hidden`}
                            >
                                {idx === 0 && gameState.status === 'in_progress' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent pointer-events-none" />
                                )}
                                <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center font-bold text-xl relative z-10">
                                    {idx === 0 && gameState.status === 'in_progress' ? <Crown className="w-5 h-5 text-yellow-500" /> : idx + 1}
                                </div>
                                <div className="flex-1 relative z-10">
                                    <div className="font-bold text-white leading-tight">
                                        {p.characterName} {p.userId === user?.id && <span className="text-xs text-brand-400 font-normal ml-1">(You)</span>}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs mt-1">
                                        <span className="text-gray-400">Score: <span className="text-white font-mono">{p.score}</span></span>
                                        <span className="text-gray-400">Tests: <span className="text-green-400 font-mono">{p.testsPassed}/{problem?.testCases?.length || 5}</span></span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
