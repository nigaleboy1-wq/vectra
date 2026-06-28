'use client';

import { useEffect } from "react";
import { animate, useReducedMotion } from "framer-motion";

/**
 * Intercepte les clics sur les liens d'ancrage (#xxx) et anime le scroll
 * avec Framer Motion (courbe d'easing + duration plus marquées que le CSS smooth).
 * Ajoute aussi un flash visuel subtil sur la section ciblée à l'arrivée.
 *
 * Pour #contact : déclenche un CustomEvent "open-contact-modal" écouté par le
 * ContactModalProvider, au lieu de scroller vers la section CTA.
 */
export default function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const highlightSection = (el: HTMLElement) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 5;
        box-shadow: inset 0 0 0 2px rgba(164, 132, 215, 0.8);
        border-radius: inherit;
        opacity: 1;
        transition: opacity 1.2s ease-out;
      `;

      const computed = window.getComputedStyle(el);
      if (computed.position === "static") {
        el.style.position = "relative";
      }

      el.appendChild(overlay);
      void overlay.offsetWidth;
      requestAnimationFrame(() => {
        overlay.style.opacity = "0";
      });

      setTimeout(() => {
        overlay.remove();
      }, 1400);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href === "#") {
        e.preventDefault();
        return;
      }

      // Cas spécial : #contact ouvre le modal au lieu de scroller
      if (href === "#contact") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-contact-modal"));
        return;
      }

      const destination = document.querySelector(href);
      if (!destination) return;

      e.preventDefault();

      const navbarHeight = 90;
      const elementTop =
        destination.getBoundingClientRect().top + window.scrollY;
      const targetY = Math.max(0, elementTop - navbarHeight);

      if (reduceMotion) {
        window.scrollTo({ top: targetY, behavior: "auto" });
        highlightSection(destination as HTMLElement);
        return;
      }

      const controls = animate(window.scrollY, targetY, {
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (value) => {
          window.scrollTo({ top: value, behavior: "auto" });
        },
        onComplete: () => {
          highlightSection(destination as HTMLElement);
        },
      });

      return () => controls.stop();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [reduceMotion]);

  return null;
}
