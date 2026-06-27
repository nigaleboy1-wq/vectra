'use client';

import Navbar from "@/components/vectra/navbar";
import Hero from "@/components/vectra/hero";
import StatsBand from "@/components/vectra/stats-band";
import WorkSection from "@/components/vectra/work-section";
import ProjectGallerySection from "@/components/vectra/project-gallery-section";
import ProcessSection from "@/components/vectra/process-section";
import TestimonialsSection from "@/components/vectra/testimonials-section";
import CTASection from "@/components/vectra/cta-section";
import Footer from "@/components/vectra/footer";
import ErrorBoundary from "@/components/vectra/error-boundary";

export default function Home() {
  return (
    <>
      {/* Navbar (fixed, overlays everything) */}
      <Navbar />

      <main className="relative w-full overflow-x-hidden bg-[#2b2344]" aria-label="Contenu principal">
        <ErrorBoundary>
          {/* Hero (with video background + bottom gradient fade) */}
          <Hero />

          {/* Floating stats band — overlaps Hero bottom and Work top */}
          <StatsBand />

          {/* Page sections */}
          <WorkSection />
          <ProjectGallerySection />
          <ProcessSection />
          <TestimonialsSection />
          <CTASection />
          <Footer />
        </ErrorBoundary>
      </main>
    </>
  );
}
