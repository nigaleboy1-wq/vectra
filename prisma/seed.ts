import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SERVICES = [
  { title: "Conception web sur mesure", description: "Des sites web sur mesure, conçus pour convertir et refléter votre marque, qui captivent votre audience dès le premier scroll.", iconName: "Code2", order: 0 },
  { title: "E-commerce & applications web", description: "Boutiques headless, tableaux de bord et produits SaaS conçus pour la vitesse, l'évolutivité et une expérience utilisateur sans faille.", iconName: "ShoppingCart", order: 1 },
  { title: "Branding & stratégie UX", description: "Des wireframes aux prototypes haute-fidélité, nous concevons des interfaces et des identités qui sont aussi agréables à utiliser qu'à regarder.", iconName: "Palette", order: 2 },
  { title: "Design UI/UX", description: "Des interfaces centrées utilisateur, validées par la recherche, les tests et l'accessibilité. Des parcours élégants qui convertissent les visiteurs en clients.", iconName: "PenTool", order: 3 },
  { title: "Expériences mobile-first", description: "Chaque produit que nous livrons est responsive par défaut. Nous concevons et développons des parcours mobile-first qui se chargent vite et semblent natifs sur tout appareil.", iconName: "Smartphone", order: 4 },
  { title: "SEO & analytique", description: "SEO technique, données structurées et tableaux de bord analytiques. Nous nous assurons que les bonnes personnes vous trouvent — et que vous puissiez le mesurer.", iconName: "Search", order: 5 },
  { title: "Optimisation des performances", description: "Temps de chargement sous la seconde, scores Lighthouse parfaits et Core Web Vitals au vert. La vitesse est une fonctionnalité — et nous la livrons.", iconName: "Zap", order: 6 },
];

const PROJECTS = [
  { title: "Lumen Finance", category: "Fintech · Application web", description: "Un tableau de bord bancaire moderne avec analytique en temps réel, authentification biométrique et transitions de page sous 200ms.", domain: "lumen.finance", year: "2025", mockupFrom: "#7b39fc", mockupTo: "#2b2344", accent: "#c4a4ff", order: 0 },
  { title: "Atlas Studio", category: "Créatif · Portfolio", description: "Un portfolio primé pour un studio de design berlinois — transitions WebGL et CMS sur mesure.", domain: "atlas.studio", year: "2025", mockupFrom: "#2b2344", mockupTo: "#7b39fc", accent: "#c4a4ff", order: 1 },
  { title: "Nimbus Commerce", category: "E-commerce · Headless", description: "Boutique Shopify headless avec LCP de 1,2s et un checkout personnalisé qui a augmenté le panier moyen de 22%.", domain: "nimbus.shop", year: "2024", mockupFrom: "#a484d7", mockupTo: "#2b2344", accent: "#7b39fc", order: 2 },
  { title: "Pulse Health", category: "SaaS · Santé", description: "Un portail patient connectant 14 cliniques. Conforme HIPAA, WCAG AA, 99,98% de disponibilité.", domain: "pulse.health", year: "2024", mockupFrom: "#2b2344", mockupTo: "#5b2db8", accent: "#c4a4ff", order: 3 },
  { title: "Orbit Labs", category: "IA · Outils développeur", description: "Une plateforme développeur avec playground API en direct, recherche de docs par IA et un bac à sable de code sur mesure.", domain: "orbit.dev", year: "2024", mockupFrom: "#5b2db8", mockupTo: "#2b2344", accent: "#7b39fc", order: 4 },
  { title: "Maison Noir", category: "Luxe · Site de marque", description: "Un site éditoriel haute-couture avec scroll cinématographique, typographie sur mesure et un lookbook shoppable.", domain: "maisonnoir.com", year: "2023", mockupFrom: "#2b2344", mockupTo: "#a484d7", accent: "#c4a4ff", order: 5 },
];

const TESTIMONIALS = [
  { quote: "Vectra a entièrement reconstruit notre tableau de bord SaaS. La nouvelle version se charge en moins d'une seconde et notre conversion d'essai vers payant a bondi de 31% au premier trimestre.", name: "Sarah Chen", role: "CEO, Pulse Health", initials: "SC", accent: "from-[#7b39fc] to-[#a484d7]", order: 0 },
  { quote: "L'équipe la plus rigoureuse avec laquelle nous ayons travaillé. Ils se souciaient de l'expérience de nos clients autant que nous — et ça se voit dans chaque pixel.", name: "Marcus Bauer", role: "Fondateur, Atlas Studio", initials: "MB", accent: "from-[#a484d7] to-[#2b2344]", order: 1 },
  { quote: "Nous avons livré une refonte headless commerce en 7 semaines. La vitesse de page est passée de 4,2s à 1,1s et notre trafic organique a doublé en trois mois. Vraiment au-dessus du lot.", name: "Léa Park", role: "Head of Growth, Nimbus", initials: "LP", accent: "from-[#2b2344] to-[#7b39fc]", order: 2 },
  { quote: "Un accompagnement sans faille du brief au déploiement. Communication limpide, tenue parfaite des délais, et un résultat qui a dépassé nos attentes sur tous les fronts.", name: "Antoine Mercier", role: "Cofondateur, Orbit Labs", initials: "AM", accent: "from-[#5b2db8] to-[#a484d7]", order: 3 },
  { quote: "Vectra a transformé notre vision en une plateforme web rapide, élégante et maintenable. Nos équipes internes ont pris le relais sans aucune friction.", name: "Camille Roux", role: "CTO, Maison Noir", initials: "CR", accent: "from-[#a484d7] to-[#5b2db8]", order: 4 },
];

const STATS = [
  { label: "Projets livrés", value: 50, suffix: "+", decimals: 0, order: 0 },
  { label: "Secteurs servis", value: 12, suffix: "", decimals: 0, order: 1 },
  { label: "Disponibilité SLA", value: 99.9, suffix: "%", decimals: 1, order: 2 },
  { label: "Note client", value: 4.9, suffix: "/5", decimals: 1, order: 3 },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clean
  await prisma.analyticsEvent.deleteMany();
  await prisma.dailyStat.deleteMany();
  await prisma.service.deleteMany();
  await prisma.project.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.stat.deleteMany();

  // Seed
  for (const s of SERVICES) {
    await prisma.service.create({ data: s });
  }
  for (const p of PROJECTS) {
    await prisma.project.create({ data: p });
  }
  for (const t of TESTIMONIALS) {
    await prisma.testimonial.create({ data: t });
  }
  for (const s of STATS) {
    await prisma.stat.create({ data: s });
  }

  console.log(`✅ Seeded: ${SERVICES.length} services, ${PROJECTS.length} projects, ${TESTIMONIALS.length} testimonials, ${STATS.length} stats`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
