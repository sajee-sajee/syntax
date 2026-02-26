"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
                        <Terminal className="w-6 h-6 text-neon-blue" />
                        <span className="font-bold tracking-widest text-glow">CODE REALITY</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-sm font-mono text-gray-400">
                            {user?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
