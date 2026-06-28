"use client";

import { createContext, useContext, useSyncExternalStore, useCallback, type ReactNode } from "react";

const DASHBOARD_PASSWORD = "bienvenuverctradanslegame";
const STORAGE_KEY = "vectra_dashboard_auth";

type AuthContextValue = {
  isAuthed: boolean;
  isReady: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useDashboardAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useDashboardAuth must be used inside DashboardAuthProvider");
  return ctx;
}

// useSyncExternalStore — la façon React 18+ de lire un store externe (sessionStorage)
// sans causer d'erreur d'hydration ni de "setState in effect"
function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  // Polling léger pour détecter les changements dans le même onglet
  const interval = setInterval(callback, 1000);
  return () => {
    window.removeEventListener("storage", callback);
    clearInterval(interval);
  };
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function getServerSnapshot(): string {
  return "";
}

export function DashboardAuthProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore gère correctement le SSR + hydration
  const storedValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isAuthed = storedValue === "true";
  // isReady est true dès que le client a rendu une fois (après hydration)
  const isReady = typeof window !== "undefined";

  const login = useCallback((password: string) => {
    if (password === DASHBOARD_PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "true");
        // Force la mise à jour du store
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.warn("sessionStorage unavailable:", e);
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.warn("sessionStorage unavailable:", e);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthed, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
