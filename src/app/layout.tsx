import type { Metadata, Viewport } from "next";
import { Manrope, Cabin, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SmoothScroll from "@/components/vectra/smooth-scroll";
import { ContactModalProvider } from "@/components/vectra/contact-modal";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vectra — Agence de développement web premium",
  description:
    "Vectra est une agence de développement web premium qui conçoit, développe et lance des sites web sur mesure, des applications et des expériences numériques fluides.",
  keywords: [
    "Vectra",
    "agence développement web",
    "sites sur mesure",
    "design web",
    "expériences numériques",
  ],
  authors: [{ name: "Studio Vectra" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Vectra — Agence de développement web premium",
    description:
      "Concevez, développez et lancez votre site web parfait avec Studio Vectra.",
    siteName: "Vectra",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vectra — Agence de développement web premium",
    description:
      "Concevez, développez et lancez votre site web parfait avec Studio Vectra.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2b2344",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${cabin.variable} ${instrumentSerif.variable} ${inter.variable} antialiased bg-background text-foreground font-sans`}
      >
        {/* Skip to main content — keyboard accessibility */}
        <a href="#main-content" className="skip-link">
          Aller au contenu
        </a>
        {/* Smooth scroll animation pour les liens d'ancrage */}
        <SmoothScroll />
        {/* Provider du modal de contact — accessible partout via useContactModal() */}
        <ContactModalProvider>
          {children}
        </ContactModalProvider>
        <Toaster />
      </body>
    </html>
  );
}
