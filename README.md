# Vectra — Agence de développement web premium

Site vitrine pour Vectra, agence de développement web premium. Construit avec Next.js 16, TypeScript, Tailwind CSS 4, Framer Motion et shadcn/ui.

## Stack technique

- **Framework** : Next.js 16 (App Router) + TypeScript 5
- **Styles** : Tailwind CSS 4 + shadcn/ui
- **Animations** : Framer Motion
- **Polices** : Manrope, Cabin, Instrument Serif, Inter (Google Fonts via `next/font`)
- **Icônes** : Lucide React

## Démarrage local

```bash
# Installer les dépendances
bun install

# Lancer le serveur de développement
bun run dev

# Ouvrir http://localhost:3000
```

## Build de production

```bash
# Build standard (pour Vercel)
bun run build:vercel

# Lint
bun run lint
```

## Déploiement sur Vercel

### Option 1 — Via le dashboard Vercel

1. Poussez ce projet sur un dépôt GitHub/GitLab/Bitbucket
2. Connectez-vous sur [vercel.com](https://vercel.com) et cliquez sur **Add New → Project**
3. Importez le dépôt
4. Vercel détecte automatiquement Next.js — laissez les paramètres par défaut :
   - **Framework Preset** : Next.js
   - **Build Command** : `bun run build:vercel` (ou laissez `next build`)
   - **Install Command** : `bun install`
5. Cliquez sur **Deploy**

### Option 2 — Via la CLI Vercel

```bash
# Installer la CLI Vercel
npm i -g vercel

# Se connecter
vercel login

# Déployer en preview
vercel

# Déployer en production
vercel --prod
```

### Variables d'environnement (optionnel)

Le formulaire de contact fonctionne côté client (simulation). Pour envoyer réellement les emails, ajoutez ces variables dans le dashboard Vercel → Settings → Environment Variables :

```
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL_TO=hello@vectra.studio
```

Ou utilisez Formspree :
```
FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

## Structure du projet

```
src/
├── app/
│   ├── layout.tsx          # Layout racine (polices, skip-link, providers)
│   ├── page.tsx            # Page d'accueil (composition des sections)
│   └── globals.css         # Styles globaux + tokens thème Vectra
├── components/
│   ├── ui/                 # Composants shadcn/ui (Button, Dialog, Input, etc.)
│   └── vectra/             # Composants spécifiques au site
│       ├── navbar.tsx
│       ├── hero.tsx
│       ├── stats-band.tsx
│       ├── work-section.tsx        # Carrousel services
│       ├── project-gallery-section.tsx  # Carrousel projets
│       ├── process-section.tsx
│       ├── testimonials-section.tsx     # Carrousel témoignages
│       ├── cta-section.tsx
│       ├── footer.tsx
│       ├── contact-modal.tsx       # Modal formulaire de contact
│       ├── smooth-scroll.tsx       # Animation scroll Framer Motion
│       ├── section-heading.tsx     # En-tête réutilisable
│       ├── animations.tsx          # Variants Framer Motion partagés
│       └── error-boundary.tsx
└── lib/
    ├── db.ts                # Client Prisma
    └── utils.ts             # Utilitaires (cn, etc.)
```

## Fonctionnalités

- **Hero** éditorial avec vidéo background, headline animée, carte "journal de bord"
- **3 carrousels** (Services, Projets, Témoignages) avec drag, navigation clavier, animations spring
- **Section Process** en roadmap horizontal avec livrables concrets
- **Modal de contact** avec formulaire complet (nom, email, entreprise, type de projet, budget, message)
- **Smooth scroll** animé avec Framer Motion + flash visuel à l'arrivée
- **Stats animées** (compteur de 0 à la valeur)
- **Accessibilité** : skip-link, focus-visible, ARIA, reduced-motion, focus trap, landmarks sémantiques
- **Responsive** mobile-first

## Licence

© Vectra Studio. Tous droits réservés.
