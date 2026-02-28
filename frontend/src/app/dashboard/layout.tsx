"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        checkAuth().then(() => {
            const auth = useAuthStore.getState().isAuthenticated;
            if (!auth) {
                router.push("/");
            }
        });
    }, [checkAuth, router]);

    if (!mounted || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-white overflow-hidden selection:bg-brand-500/30">
            <Navbar />
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12 relative z-10">
                {children}
            </main>

            {/* Subtle Background Elements */}
            <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
        </div>
    );
}
