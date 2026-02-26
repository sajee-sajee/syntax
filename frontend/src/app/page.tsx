"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Lock, Mail, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, { email, password });

      if (res.data.success) {
        setAuth(res.data.data.user, res.data.data.token);
        if (res.data.data.user.characterCreated) {
          router.push("/dashboard");
        } else {
          router.push("/character-creation");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grid bg-[#09090b] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyber-purple/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Terminal className="w-12 h-12 text-neon-blue" />
          <h1 className="text-5xl font-bold tracking-tight text-glow">
            CODE REALITY
          </h1>
        </div>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Repair the Structured Realm. Defeat the Chaos Compiler. Code your way to Legend.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="z-10 w-full max-w-md"
      >
        <div className="bg-cyber-dark/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl box-glow">
          <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 text-center font-semibold transition-colors ${isLogin ? 'text-neon-blue' : 'text-gray-500 hover:text-gray-300'}`}
            >
              INITIALIZE
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 text-center font-semibold transition-colors ${!isLogin ? 'text-cyber-purple' : 'text-gray-500 hover:text-gray-300'}`}
            >
              CREATE FIXER
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Terminal Access ID</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                  placeholder="fixer@kernel.sys"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Security Passphrase</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold tracking-wide flex items-center justify-center gap-2 transition-all group ${isLogin
                  ? 'bg-brand-600 hover:bg-brand-500 text-white'
                  : 'bg-cyber-purple hover:bg-purple-500 text-white'
                }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'ENTER REALM' : 'FORMAT NEW DATA'}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider">START YOUR CODING JOURNEY</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
