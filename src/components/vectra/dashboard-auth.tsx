"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const DASHBOARD_PASSWORD = "bienvenuverctradanslegame";
const STORAGE_KEY = "vectra_dashboard_auth";

type AuthContextValue = {
  isAuthed: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useDashboardAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useDashboardAuth must be used inside DashboardAuthProvider");
  return ctx;
}

// Read sessionStorage once at module load (client-side only)
function getInitialAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}

export function DashboardAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(getInitialAuthed);

  const login = (password: string) => {
    if (password === DASHBOARD_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setIsAuthed(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAuthed(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
