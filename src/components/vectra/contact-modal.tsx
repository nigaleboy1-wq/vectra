"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Send, CheckCircle2 } from "lucide-react";

type ContactContextValue = {
  open: () => void;
  close: () => void;
};

const ContactContext = createContext<ContactContextValue | null>(null);

/** Hook à utiliser dans n'importe quel composant client pour ouvrir le modal */
export function useContactModal() {
  const ctx = useContext(ContactContext);
  if (!ctx) {
    throw new Error("useContactModal doit être utilisé à l'intérieur de <ContactModalProvider>");
  }
  return ctx;
}

const PROJECT_TYPES = [
  "Site vitrine / portfolio",
  "E-commerce",
  "Application web / SaaS",
  "Refonte de site existant",
  "Branding & UX",
  "Autre",
];

const BUDGETS = [
  "< 5 000 €",
  "5 000 € – 15 000 €",
  "15 000 € – 30 000 €",
  "30 000 € +",
  "À définir ensemble",
];

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const open = useCallback(() => {
    setSubmitted(false);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Écouter le CustomEvent dispatché par SmoothScroll quand on clique sur #contact
  useEffect(() => {
    const handler = () => open();
    window.addEventListener("open-contact-modal", handler);
    return () => window.removeEventListener("open-contact-modal", handler);
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // En production : envoyer vers API route, Resend, Formspree, etc.
    // Ici on simule juste le succès pour le déploiement.
    setSubmitted(true);
    // Fermeture auto après 2.5s
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
    }, 2500);
  };

  return (
    <ContactContext.Provider value={{ open, close }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-[560px] max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#2b2344] p-0 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
        >
          {/* Close button custom (style Vectra) */}
          <button
            type="button"
            onClick={close}
            aria-label="Fermer"
            className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 p-10 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(123,57,252,0.18)] border border-[rgba(164,132,215,0.4)] text-[#c4a4ff]">
                <CheckCircle2 className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h2
                className="text-white text-2xl font-semibold"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Message envoyé !
              </h2>
              <p
                className="text-white/70 text-[15px] max-w-[320px]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Merci pour votre message. Nous revenons vers vous sous 24 heures avec les
                prochaines étapes.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader className="px-7 pt-7 pb-4 border-b border-white/10">
                <DialogTitle
                  className="text-white text-2xl font-semibold"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Parlons de votre projet
                </DialogTitle>
                <DialogDescription
                  className="text-white/70 text-[14px] mt-2"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Dites-nous qui vous êtes, comment vous contacter, et ce que vous cherchez
                  à accomplir. Nous répondons sous 24 h.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleSubmit}
                className="px-7 py-6 flex flex-col gap-5"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {/* Nom + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="contact-name" className="text-white/85 text-[13px] font-medium">
                      Nom complet <span className="text-[#c4a4ff]">*</span>
                    </Label>
                    <Input
                      id="contact-name"
                      name="name"
                      required
                      placeholder="Marie Dupont"
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-[#7b39fc] focus-visible:ring-[#7b39fc]/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="contact-email" className="text-white/85 text-[13px] font-medium">
                      Email <span className="text-[#c4a4ff]">*</span>
                    </Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="marie@entreprise.com"
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-[#7b39fc] focus-visible:ring-[#7b39fc]/30"
                    />
                  </div>
                </div>

                {/* Entreprise + Téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="contact-company" className="text-white/85 text-[13px] font-medium">
                      Entreprise
                    </Label>
                    <Input
                      id="contact-company"
                      name="company"
                      placeholder="Nom de l'entreprise"
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-[#7b39fc] focus-visible:ring-[#7b39fc]/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="contact-phone" className="text-white/85 text-[13px] font-medium">
                      Téléphone
                    </Label>
                    <Input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      placeholder="+33 6 12 34 56 78"
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-[#7b39fc] focus-visible:ring-[#7b39fc]/30"
                    />
                  </div>
                </div>

                {/* Type de projet */}
                <div className="flex flex-col gap-2">
                  <Label className="text-white/85 text-[13px] font-medium">
                    Type de projet <span className="text-[#c4a4ff]">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {PROJECT_TYPES.map((type) => (
                      <label
                        key={type}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] text-white/80 transition-all hover:border-[rgba(164,132,215,0.6)] hover:bg-white/10 has-[:checked]:border-[#7b39fc] has-[:checked]:bg-[#7b39fc] has-[:checked]:text-white"
                      >
                        <input
                          type="radio"
                          name="projectType"
                          value={type}
                          required
                          className="sr-only"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="flex flex-col gap-2">
                  <Label className="text-white/85 text-[13px] font-medium">
                    Budget estimé
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {BUDGETS.map((budget) => (
                      <label
                        key={budget}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] text-white/80 transition-all hover:border-[rgba(164,132,215,0.6)] hover:bg-white/10 has-[:checked]:border-[#7b39fc] has-[:checked]:bg-[#7b39fc] has-[:checked]:text-white"
                      >
                        <input
                          type="radio"
                          name="budget"
                          value={budget}
                          className="sr-only"
                        />
                        {budget}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="contact-message" className="text-white/85 text-[13px] font-medium">
                    Votre projet en quelques mots <span className="text-[#c4a4ff]">*</span>
                  </Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Décrivez ce que vous cherchez à accomplir, vos objectifs, vos délais…"
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:border-[#7b39fc] focus-visible:ring-[#7b39fc]/30 resize-none"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="mt-2 h-12 rounded-[10px] bg-[#7b39fc] text-white text-[15px] font-semibold hover:bg-[#8a4dff] hover:shadow-[0_10px_30px_rgba(123,57,252,0.45)]"
                  style={{ fontFamily: "var(--font-cabin)" }}
                >
                  <Send className="h-4 w-4 mr-2" strokeWidth={2} aria-hidden="true" />
                  Envoyer le message
                </Button>

                <p className="text-white/50 text-[11px] text-center mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                  En envoyant ce formulaire, vous acceptez d'être recontacté par Vectra.
                  Vos données ne sont jamais partagées.
                </p>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ContactContext.Provider>
  );
}
