"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  X,
  Send,
  CheckCircle2,
  Mail,
  Clock,
  Sparkles,
  User,
  Building2,
  Phone,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

type ContactContextValue = {
  open: () => void;
  close: () => void;
};

const ContactContext = createContext<ContactContextValue | null>(null);

export function useContactModal() {
  const ctx = useContext(ContactContext);
  if (!ctx) {
    throw new Error("useContactModal doit être utilisé à l'intérieur de <ContactModalProvider>");
  }
  return ctx;
}

const PROJECT_TYPES = [
  { label: "Site vitrine", value: "Site vitrine / portfolio" },
  { label: "E-commerce", value: "E-commerce" },
  { label: "Application web", value: "Application web / SaaS" },
  { label: "Refonte", value: "Refonte de site existant" },
  { label: "Branding & UX", value: "Branding & UX" },
  { label: "Autre", value: "Autre" },
];

const BUDGETS = [
  "< 5 000 €",
  "5 000 – 15 000 €",
  "15 000 – 30 000 €",
  "30 000 € +",
  "À définir",
];

const CONTACT_INFOS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@vectra.studio",
  },
  {
    icon: Clock,
    label: "Réponse",
    value: "Sous 24 heures",
  },
  {
    icon: Sparkles,
    label: "Disponibilité",
    value: "2 projets ouverts",
  },
];

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const open = useCallback(() => {
    setSubmitted(false);
    setIsSubmitting(false);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handler = () => open();
    window.addEventListener("open-contact-modal", handler);
    return () => window.removeEventListener("open-contact-modal", handler);
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulation d'envoi — remplacer par un vrai appel API en production
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 3000);
    }, 1200);
  };

  return (
    <ContactContext.Provider value={{ open, close }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-[860px] max-h-[92vh] overflow-hidden rounded-2xl border border-white/15 bg-[#2b2344] p-0 shadow-[0_30px_90px_rgba(0,0,0,0.7)] gap-0"
        >
          {/* Header invisible — requis par Radix pour l'accessibilité */}
          <DialogHeader className="sr-only">
            <DialogTitle>Parlons de votre projet</DialogTitle>
            <DialogDescription>
              Formulaire de contact Vectra. Remplissez vos coordonnées et la
              description de votre projet.
            </DialogDescription>
          </DialogHeader>

          {/* Close button */}
          <button
            type="button"
            onClick={close}
            aria-label="Fermer"
            className="absolute top-4 right-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white hover:rotate-90 duration-300"
          >
            <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-5 p-16 text-center min-h-[400px]"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
                  className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(123,57,252,0.18)] border-2 border-[#7b39fc]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[#7b39fc] opacity-40 blur-xl animate-pulse"
                  />
                  <CheckCircle2 className="relative h-10 w-10 text-[#c4a4ff]" strokeWidth={1.5} aria-hidden="true" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center gap-2"
                >
                  <h2
                    className="text-white text-3xl font-semibold"
                    style={{ fontFamily: "var(--font-instrument-serif)" }}
                  >
                    Message envoyé
                  </h2>
                  <p
                    className="text-white/70 text-[15px] max-w-[360px]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Merci pour votre message. Nous revenons vers vous sous 24 heures
                    avec les prochaines étapes.
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-[300px_1fr]"
              >
                {/* === Sidebar: header + contact infos === */}
                <div className="relative bg-gradient-to-br from-[#3a2d5e] to-[#1f1a33] p-7 lg:p-8 flex flex-col overflow-hidden">
                  {/* Decorative glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#7b39fc] opacity-20 blur-3xl"
                  />

                  <div className="relative flex flex-col gap-6 h-full">
                    <div>
                      <span
                        className="inline-flex items-center rounded-full border border-[rgba(164,132,215,0.5)] bg-[rgba(123,57,252,0.2)] px-3 py-1 text-[11px] font-medium text-white/90 mb-4"
                        style={{ fontFamily: "var(--font-cabin)" }}
                      >
                        Contact
                      </span>
                      <h2
                        className="text-white text-3xl lg:text-4xl leading-[1.05] tracking-[-0.02em] mb-3"
                        style={{ fontFamily: "var(--font-instrument-serif)" }}
                      >
                        Parlons de votre{" "}
                        <em className="italic text-[#c4a4ff]">projet</em>
                      </h2>
                      <p
                        className="text-white/65 text-[13px] leading-relaxed"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        Dites-nous qui vous êtes, comment vous contacter, et ce que
                        vous cherchez à accomplir.
                      </p>
                    </div>

                    {/* Contact infos */}
                    <div className="flex flex-col gap-4 mt-2">
                      {CONTACT_INFOS.map((info) => {
                        const Icon = info.icon;
                        return (
                          <div key={info.label} className="flex items-center gap-3">
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(123,57,252,0.18)] border border-[rgba(164,132,215,0.35)] text-[#c4a4ff]">
                              <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                            </div>
                            <div className="flex flex-col">
                              <span
                                className="text-white/45 text-[10px] uppercase tracking-wider"
                                style={{ fontFamily: "var(--font-cabin)" }}
                              >
                                {info.label}
                              </span>
                              <span
                                className="text-white text-[13px] font-medium"
                                style={{ fontFamily: "var(--font-inter)" }}
                              >
                                {info.value}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom note */}
                    <div className="mt-auto pt-6 border-t border-white/10">
                      <p
                        className="text-white/50 text-[11px] leading-relaxed"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        En envoyant ce formulaire, vous acceptez d'être recontacté par
                        Vectra. Vos données ne sont jamais partagées.
                      </p>
                    </div>
                  </div>
                </div>

                {/* === Form === */}
                <div className="overflow-y-auto max-h-[92vh] lg:max-h-[640px]">
                  <form
                    onSubmit={handleSubmit}
                    className="p-7 lg:p-8 flex flex-col gap-5"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {/* Section: Qui êtes-vous */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-[#c4a4ff]" strokeWidth={2} aria-hidden="true" />
                        <span
                          className="text-white/90 text-[11px] uppercase tracking-[0.15em] font-semibold"
                          style={{ fontFamily: "var(--font-cabin)" }}
                        >
                          Qui êtes-vous
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="contact-name" className="text-white/75 text-[12px] font-medium">
                            Nom complet <span className="text-[#c4a4ff]">*</span>
                          </Label>
                          <Input
                            id="contact-name"
                            name="name"
                            required
                            placeholder="Marie Dupont"
                            className="h-11 bg-white/[0.04] border-white/12 text-white placeholder:text-white/35 focus-visible:border-[#7b39fc] focus-visible:ring-[#7b39fc]/25 transition-colors"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="contact-email" className="text-white/75 text-[12px] font-medium">
                            Email <span className="text-[#c4a4ff]">*</span>
                          </Label>
                          <Input
                            id="contact-email"
                            name="email"
                            type="email"
                            required
                            placeholder="marie@entreprise.com"
                            className="h-11 bg-white/[0.04] border-white/12 text-white placeholder:text-white/35 focus-visible:border-[#7b39fc] focus-visible:ring-[#7b39fc]/25 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="contact-company" className="text-white/75 text-[12px] font-medium">
                            Entreprise
                          </Label>
                          <Input
                            id="contact-company"
                            name="company"
                            placeholder="Nom de l'entreprise"
                            className="h-11 bg-white/[0.04] border-white/12 text-white placeholder:text-white/35 focus-visible:border-[#7b39fc] focus-visible:ring-[#7b39fc]/25 transition-colors"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="contact-phone" className="text-white/75 text-[12px] font-medium">
                            Téléphone
                          </Label>
                          <Input
                            id="contact-phone"
                            name="phone"
                            type="tel"
                            placeholder="+33 6 12 34 56 78"
                            className="h-11 bg-white/[0.04] border-white/12 text-white placeholder:text-white/35 focus-visible:border-[#7b39fc] focus-visible:ring-[#7b39fc]/25 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/8" />

                    {/* Section: Votre projet */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-[#c4a4ff]" strokeWidth={2} aria-hidden="true" />
                        <span
                          className="text-white/90 text-[11px] uppercase tracking-[0.15em] font-semibold"
                          style={{ fontFamily: "var(--font-cabin)" }}
                        >
                          Votre projet
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-white/75 text-[12px] font-medium">
                          Type de projet <span className="text-[#c4a4ff]">*</span>
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {PROJECT_TYPES.map((type) => (
                            <label
                              key={type.value}
                              className="cursor-pointer inline-flex items-center rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2 text-[12px] text-white/75 transition-all hover:border-[rgba(164,132,215,0.5)] hover:bg-white/[0.07] hover:text-white has-[:checked]:border-[#7b39fc] has-[:checked]:bg-[#7b39fc] has-[:checked]:text-white has-[:checked]:shadow-[0_4px_14px_rgba(123,57,252,0.4)]"
                            >
                              <input
                                type="radio"
                                name="projectType"
                                value={type.value}
                                required
                                className="sr-only"
                              />
                              {type.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-white/75 text-[12px] font-medium">
                          Budget estimé
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {BUDGETS.map((budget) => (
                            <label
                              key={budget}
                              className="cursor-pointer inline-flex items-center rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2 text-[12px] text-white/75 transition-all hover:border-[rgba(164,132,215,0.5)] hover:bg-white/[0.07] hover:text-white has-[:checked]:border-[#7b39fc] has-[:checked]:bg-[#7b39fc] has-[:checked]:text-white has-[:checked]:shadow-[0_4px_14px_rgba(123,57,252,0.4)]"
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
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/8" />

                    {/* Section: Message */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-3.5 w-3.5 text-[#c4a4ff]" strokeWidth={2} aria-hidden="true" />
                        <span
                          className="text-white/90 text-[11px] uppercase tracking-[0.15em] font-semibold"
                          style={{ fontFamily: "var(--font-cabin)" }}
                        >
                          Votre message
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="contact-message" className="text-white/75 text-[12px] font-medium">
                          Décrivez votre projet <span className="text-[#c4a4ff]">*</span>
                        </Label>
                        <Textarea
                          id="contact-message"
                          name="message"
                          required
                          rows={4}
                          placeholder="Vos objectifs, vos délais, ce qui vous inspire…"
                          className="bg-white/[0.04] border-white/12 text-white placeholder:text-white/35 focus-visible:border-[#7b39fc] focus-visible:ring-[#7b39fc]/25 resize-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 h-12 rounded-[10px] bg-[#7b39fc] text-white text-[15px] font-semibold hover:bg-[#8a4dff] hover:shadow-[0_10px_30px_rgba(123,57,252,0.5)] disabled:opacity-60 disabled:cursor-wait group"
                      style={{ fontFamily: "var(--font-cabin)" }}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                          />
                          Envoi en cours…
                        </>
                      ) : (
                        <>
                          Envoyer le message
                          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </ContactContext.Provider>
  );
}
