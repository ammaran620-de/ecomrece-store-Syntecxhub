# AURA: Next-Gen E-Commerce Platform

A production-grade, AI-powered commerce platform featuring a cinematic UI, real-time features, and enterprise-level architecture. Designed as a premium luxury commerce experience.

## Architecture

- **Framework**: Next.js 14 (App Router, RSC, Streaming)
- **Styling**: Tailwind CSS, Framer Motion, GSAP, Radix UI
- **State Management**: Zustand (Client), TanStack Query (Server state)
- **Database**: PostgreSQL (via Neon) + Prisma ORM
- **Cache**: Redis (Upstash)
- **Auth**: NextAuth.js (JWT, OAuth) with custom RBAC Middleware
- **Payments**: Stripe Payment Element
- **3D Viewer**: Three.js (@react-three/fiber)

## Folder Structure

```text
/app
  /(store)          → Customer-facing storefront
    /shop           → Product Listing Page (PLP)
    /shop/[slug]    → Product Detail Page (PDP) with 3D Viewer
    /checkout       → One-page animated checkout
    /dashboard      → User dashboard and order tracking
  /(admin)          → Protected Admin Dashboard
    /admin          → Admin Overview (KPIs, Real-time feed)
  /api              → API routes
/components
  /store            → Storefront components (CartDrawer, Header)
  /admin            → Admin components
  /ui               → Base UI components
/lib
  /db               → Prisma client configuration
/stores             → Zustand stores (cartStore)
/prisma
  schema.prisma     → Database models
```

## Setup & Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   Ensure you have a PostgreSQL database running. Update your `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/aura_db"
   NEXTAUTH_SECRET="your_secret"
   ```

3. **Prisma Migrations**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Implemented Features

### Phase 1: Foundation
- Project setup with Next.js 14 App Router
- Comprehensive Prisma Schema (Products, Variants, Orders, Users, Reviews)
- NextAuth setup with JWT strategy and RBAC middleware (`middleware.ts`)
- Cinematic UI Design System tokens configured in `tailwind.config.ts` and `globals.css`

### Phase 2: Customer Storefront
- **Homepage**: GSAP scroll-hijacked intro, full-screen video hero, bento grid, and horizontal marquees.
- **Shop (PLP)**: Grid layout with sidebar filters and smooth entry animations.
- **Product Detail (PDP)**: Integrated `@react-three/fiber` for an interactive 3D product model, tabbed details, and variant selection.
- **Cart**: Slide-in glassmorphism drawer powered by Zustand with persistence.
- **Checkout**: One-page step-by-step animated checkout flow.

### Phase 3 & 4: Dashboards
- **User Dashboard**: Personalized greeting based on time of day, active order shipment tracking map UI, and recent orders history.
- **Admin Dashboard**: Sidebar navigation, KPI metric cards, and a real-time live order feed mockup.

## Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Configure Environment Variables:
   - `DATABASE_URL` (Neon Postgres)
   - `NEXTAUTH_SECRET`
   - `STRIPE_SECRET_KEY`
4. The build command `next build` will automatically run Prisma generate if configured in `package.json` scripts.

## CI/CD Pipeline (GitHub Actions)

A template for GitHub actions is recommended in `.github/workflows/main.yml`:
- **Lint**: `npm run lint`
- **Test**: Run unit tests
- **Build**: `npm run build`
- **Deploy**: Vercel handles deployments on merge to `main`.
