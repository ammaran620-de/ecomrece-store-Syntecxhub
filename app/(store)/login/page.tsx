"use client";

export const dynamic = "force-dynamic";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, Github, Globe } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmit(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials expression. Check parameters.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Secure transaction handshake failed.");
    } finally {
      setIsSubmit(false);
    }
  };

  const handleOAuth = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-void flex items-center justify-center px-6 py-12 relative overflow-hidden">
      
      {/* Background mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-accent-primary)_0%,_transparent_55%)] opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-obsidian border border-border-dim rounded-2xl p-8 glass-panel shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <span className="text-accent-gold text-xs font-mono tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            <ShieldCheck size={14} /> SECURE GATEWAY
          </span>
          <h2 className="text-3xl font-display font-extrabold text-white mt-3">AURA PORTAL</h2>
          <p className="text-text-secondary text-xs mt-1">SIGN IN TO ACCESS YOUR DEPLOYED DASHBOARD</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/30 border border-red-500/20 text-red-400 text-xs font-mono rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div>
            <label className="block text-[9px] font-mono text-text-muted mb-2 uppercase">EMAIL ADDRESS</label>
            <div className="relative">
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@aura.com"
                className="w-full bg-chrome/50 border border-border-dim rounded-lg py-3.5 pl-10 pr-4 text-xs font-mono text-white focus:outline-none focus:border-accent-primary"
              />
              <Mail size={12} className="absolute left-3 top-4 text-text-muted" />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-[9px] font-mono text-text-muted mb-2 uppercase">PASSWORD</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-chrome/50 border border-border-dim rounded-lg py-3.5 pl-10 pr-4 text-xs font-mono text-white focus:outline-none focus:border-accent-primary"
              />
              <Lock size={12} className="absolute left-3 top-4 text-text-muted" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmit}
            className="w-full py-4 bg-accent-primary text-white font-bold rounded-lg uppercase tracking-wider text-xs border border-white/5 flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all shadow-lg cursor-pointer"
          >
            {isSubmit ? (
              <><Loader2 size={14} className="animate-spin" /> ESTABLISHING SESSION...</>
            ) : (
              <>ESTABLISH SESSION <ArrowRight size={14} /></>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center"><hr className="w-full border-border-dim" /></div>
          <span className="relative bg-obsidian px-3 text-[9px] font-mono text-text-muted">OR ACCESS VIA PROVIDER</span>
        </div>

        {/* OAuth Social sign-ins */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleOAuth("google")}
            className="py-3 bg-chrome hover:bg-void border border-border-dim rounded-lg text-xs font-mono text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Globe size={14} className="text-accent-ice" />
            <span>GOOGLE</span>
          </button>
          <button 
            onClick={() => handleOAuth("github")}
            className="py-3 bg-chrome hover:bg-void border border-border-dim rounded-lg text-xs font-mono text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Github size={14} />
            <span>GITHUB</span>
          </button>
        </div>

        <p className="text-center text-[10px] font-mono text-text-muted mt-8">
          Any seeded email (e.g. <span className="text-accent-gold">admin@aura.com</span>) logs in automatically without checks.
        </p>

      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-void flex items-center justify-center text-xs font-mono text-text-muted">
        ESTABLISHING GATEWAY handshakes...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
