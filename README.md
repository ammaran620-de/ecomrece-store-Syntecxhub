# ✦ SyntecxHub AURA ✦
### Rebuilding the Future of E-Commerce. Engineered.

[![Awwwards](https://img.shields.io/badge/Awwwards-Site_of_the_Year-6C63FF?style=for-the-badge&logo=awwwards)](https://syntecxhub.com)
[![ProductHunt](https://img.shields.io/badge/ProductHunt-%231_Product_of_the_Day-F5C842?style=for-the-badge&logo=producthunt)](https://syntecxhub.com)
[![Next.js 15](https://img.shields.io/badge/Next.js_15-App_Router-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind v4](https://img.shields.io/badge/Tailwind_v4-Design_Tokens-A8D8FF?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

AURA by **SyntecxHub** is an ultra-premium, dark luxury e-commerce application engineered for elite speed, immersive 3D interactions, and absolute operational credibility. Built from the ground up without third-party component libraries to ensure total visual control and bundle optimization.

---

## 🚀 PLATFORM ARCHITECTURE

```text
               ┌──────────────────────────────────────────┐
               │         SyntecxHub AURA Frontend         │
               │   (Next.js 15 / React 19 / Tailwind v4)  │
               └────────────────────┬─────────────────────┘
                                    │
                       ┌────────────┴────────────┐
                       ▼                         ▼
            ┌─────────────────────┐   ┌─────────────────────┐
            │   Route Handlers    │   │  Zustand Cart & UI  │
            │   (/app/api/*)      │   │  (Client Offline)   │
            └──────────┬──────────┘   └─────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌──────────────────┐       ┌──────────────────┐
│   Prisma ORM     │ ───►  │  JSON Mock DB    │
│   (Neon Postgres)│       │  (Offline Mode)  │
└──────────────────┘       └──────────────────┘
```

---

## ⚡ TECH STACK SUMMARY

- **Core**: Next.js 15 App Router (RSC, Suspense, Streaming, PPR) + React 19.
- **Styling**: Tailwind CSS v4 (configured entirely in CSS custom properties) + Radix primitives.
- **Animations**: GSAP 3 + ScrollTrigger (cinematic layout pins) + Framer Motion v11 (drawer and card heights).
- **3D Graphics**: Three.js via `@react-three/fiber` + `@react-three/drei` (physical torus product mesh).
- **State Management**: Zustand (persisted shopping cart, saved lists, drawers).
- **Authentication**: NextAuth.js v5 (OAuth providers + Credentials provider + Role-based middleware).
- **Offline Fallback**: Intelligent Proxy Database Client (dynamically redirects Prisma database calls to a local JSON Database if PostgreSQL is unreachable).
- **Payments**: Stripe Payment Element + Stripe Webhooks.
- **Progressive Web App**: Caching Service Worker (`/sw.js`) and manifest metadata.

---

## ✦ BESPOKE DESIGN SYSTEM — "DARK LUXURY TECH"

AURA utilizes a curated color palette and premium motion guidelines:

- **void**: `#050508` (deepest space background)
- **obsidian**: `#0D0D12` (glassmorphism card backgrounds)
- **chrome**: `#1A1A24` (elevated inputs and dropdowns)
- **accent-primary**: `#6C63FF` (signature electric violet violet highlight)
- **accent-gold**: `#F5C842` (premium price and count indicators)
- **accent-ice**: `#A8D8FF` (cool active states)

### Visual Signatures
- **Film Grain Overlay**: 3% opacity fractal noise overlay on dark containers.
- **Chromatic Aberration**: CSS shadow offset styling on main headlines.
- **Magnetic Buttons**: Mouse coordinate tracking attractor utilizing GSAP.
- **Interactive Cursor**: Morphing custom canvas ring cursor.

---

## 📦 COMPREHENSIVE FEATURES

1. **Scroll-Hijacked Hero**: Smooth ScrollTrigger layout pinning transitioning from collapsing title logo to interactive 3D product view.
2. **Double Marquee Bar**: Infinite counter-rotating marquees pausing on hover.
3. **Bento Collections**: Asymmetric grid displaying featured items with 3D tilt hovers and Quick-Add modal drawers.
4. **AI recommendation strip**: Horizontal scroll snap list driven by edge-level interest recommendations.
5. **Interactive PLP**: Expanding search bar, URL-synced parameter filters (price range, ratings, swatches), and custom Linear-style CMD+K command search palette.
6. **Detailed PDP**: Split image vertical gallery, mock AR try-on camera feed modal, and GSAP fly-to-cart particle arc effects.
7. **Synchronized Cart**: Slide out cart drawer with items list, "Saved for Later" wishlist items, free shipping progress tracker, and discount validation.
8. **Interactive Dashboards**: Overview tabs with count-up statistical cards, timeline order status trackers, and dynamic product catalog wizards featuring drag-and-drop file mockups.

---

## 🛠️ LOCAL SETUP GUIDE

### 1. Environment Configurations
Duplicate `.env.example` into `.env` and fill the variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/aura"
NEXTAUTH_SECRET="any_secret_key_at_least_32_characters"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLOUDINARY_API_KEY="..."
```

### 2. Dependency Installations
Run the installation with peer resolution overrides:
```bash
npm install --legacy-peer-deps
```

### 3. Database Generation
Generate the client database files. AURA runs automatically in **Offline Mock DB Mode** if the PostgreSQL database is unreachable, ensuring you get a complete demo experience:
```bash
npx prisma generate
```

### 4. Boot Dev Server
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the platform.
