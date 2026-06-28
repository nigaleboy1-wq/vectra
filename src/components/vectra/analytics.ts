"use client";

import { useEffect } from "react";

const VISITOR_ID_KEY = "vectra_visitor_id";
const SESSION_TRACKED_KEY = "vectra_session_tracked";

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "unknown";
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

function track(type: string, name: string) {
  if (typeof window === "undefined") return;
  const visitorId = getOrCreateVisitorId();
  const body = {
    type,
    name,
    visitorId,
    path: window.location.pathname,
    referrer: document.referrer || null,
  };
  // Fire and forget — use sendBeacon for reliability on page unload
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([JSON.stringify(body)], { type: "application/json" }));
  } else {
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true }).catch(() => {});
  }
}

/**
 * Hook to track a page view when a section enters the viewport.
 */
export function useSectionTracking(sectionName: string) {
  useEffect(() => {
    const section = document.getElementById(sectionName);
    if (!section) return;

    let tracked = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !tracked) {
            tracked = true;
            track("page_view", sectionName);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionName]);
}

/**
 * Track a CTA click. Call from onClick handlers.
 */
export function trackCtaClick(name: string) {
  track("cta_click", name);
}

/**
 * Track session start (once per page load).
 */
export function trackSessionStart() {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(SESSION_TRACKED_KEY)) return;
  sessionStorage.setItem(SESSION_TRACKED_KEY, "1");
  track("session_start", "session");
}
