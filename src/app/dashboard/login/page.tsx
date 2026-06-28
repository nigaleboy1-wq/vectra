"use client";

import { useState } from "react";
import { useDashboardAuth } from "@/components/vectra/dashboard-auth";
import { Lock, ArrowRight } from "lucide-react";

export default function DashboardLoginPage() {
  const { login } = useDashboardAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(password)) {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2344] flex items-center justify-center px-6">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7b39fc] to-[#5b2db8] mb-5 shadow-[0_10px_30px_rgba(123,57,252,0.4)]">
            <Lock className="h-6 w-6 text-white" strokeWidth={2} />
          </div>
          <h1
            className="text-white text-3xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Dashboard Vectra
          </h1>
          <p
            className="text-white/60 text-[14px]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Entrez le mot de passe pour accéder à l'administration
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex flex-col gap-1.5">
            <label
              className="text-white/75 text-[12px] font-medium uppercase tracking-wider"
              style={{ fontFamily: "var(--font-cabin)" }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              autoFocus
              placeholder="••••••••••••"
              className="h-12 rounded-[10px] bg-white/[0.04] border border-white/12 text-white placeholder:text-white/30 px-4 text-[15px] focus:outline-none focus:border-[#7b39fc] focus:ring-2 focus:ring-[#7b39fc]/25 transition-all"
              style={{ fontFamily: "var(--font-inter)" }}
            />
            {error && (
              <p className="text-red-400 text-[12px] mt-1">
                Mot de passe incorrect. Réessayez.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="h-12 rounded-[10px] bg-[#7b39fc] text-white text-[15px] font-semibold flex items-center justify-center gap-2 hover:bg-[#8a4dff] hover:shadow-[0_10px_30px_rgba(123,57,252,0.45)] transition-all group"
            style={{ fontFamily: "var(--font-cabin)" }}
          >
            Se connecter
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
          </button>
        </form>

        <p className="text-center text-white/40 text-[12px] mt-6" style={{ fontFamily: "var(--font-inter)" }}>
          ← Retour au <a href="/" className="text-[#c4a4ff] hover:underline">site</a>
        </p>
      </div>
    </div>
  );
}
