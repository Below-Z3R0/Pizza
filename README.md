# nextjs-template

> **Next.js 16+ template with batteries included.** Designed for AI agents and humans to start projects without repetitive setup.

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Below-Z3R0/nextjs-template.git my-project
cd my-project

# 2. Install
pnpm install

# 3. Configure
cp .env.example .env.local
# Fill in your Supabase URL and publishable key

# 4. Setup database
# Open Supabase Dashboard → SQL Editor → Run setup-database.sql

# 5. Dev
pnpm dev
```

---

## What's Included

| System | Description |
|--------|-------------|
| **App Router** | Next.js 16 with route groups `(public)` / `(admin)` |
| **Atomic Design** | atoms, molecules, organisms with server/client separation |
| **Design System** | CSS variables, light/dark themes, semantic tokens |
| **Supabase SSR** | Server, browser, and middleware clients |
| **Auth** | Login page, Google OAuth, email/password, middleware session refresh |
| **i18n** | Database-driven via content_blocks + translations, RPC-based |
| **Skeletons** | Loading states for every section |
| **Animations** | Framer Motion: FadeUp, MiniTitleAnimation, staggerContainer |
| **TypeScript** | Strict mode, centralized types, path aliases |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root: fonts, ThemeProvider, Background, Toaster
│   ├── globals.css             # Design tokens + light/dark themes
│   ├── (public)/
│   │   ├── layout.tsx          # Navbar + Footer (fetches data from Supabase)
│   │   └── page.tsx            # Landing page (Server Component)
│   ├── (admin)/
│   │   ├── layout.tsx          # Auth check + admin shell
│   │   └── admin/
│   │       └── page.tsx        # Admin preview (placeholder)
│   ├── login/
│   │   └── page.tsx            # Login with Google + email/password
│   └── auth/
│       └── callback/route.ts   # OAuth callback handler
├── components/
│   ├── atoms/                  # Typography: Title1, Title2, Span, Paragraph, MiniTitle
│   ├── molecules/              # Cards, forms (to be added per project)
│   ├── organisms/              # NavBar, FooterSection
│   ├── skeletons/              # Loading skeletons
│   │   ├── molecules/
│   │   └── organism/
│   ├── animations/             # FadeUp, MiniTitleAnimation, staggerContainer
│   ├── Background.tsx          # Decorative background (grid + blobs)
│   ├── types.ts                # Centralized TypeScript types
│   ├── server-components.ts    # Barrel: Server Components only
│   ├── client-components.ts    # Barrel: Client Components only
│   └── scheletons.ts           # Barrel: Skeleton components
├── hooks/
│   ├── themeProvider.tsx        # Next-themes wrapper
│   ├── useTheme.tsx            # Theme hook (light/dark)
│   └── useIsOpen.tsx           # Toggle with localStorage persistence
├── services/
│   ├── sections/
│   │   └── content.service.ts  # RPC wrapper: get_translation_by_key
│   ├── navbar.data.service.ts  # Navbar data fetcher
│   └── footer.data.service.ts  # Footer data fetcher
├── utils/
│   ├── supabase/
│   │   ├── server.ts           # Server client (RSC)
│   │   ├── client.ts           # Browser client (CSR)
│   │   └── middleware.ts       # Session refresh
│   └── getSiteURL.ts           # Site URL resolver
├── schema/                     # Zod schemas (add per project)
└── assets/                     # SVG icons, images
```

---

## Decision Trees

### "¿Necesito separación (public)/(admin)?"

| Situación | Acción |
|-----------|--------|
| El sitio tiene panel de administración | Mantener `(admin)/` |
| Es solo landing page | Borrar carpeta `(admin)/` y eliminar `redirect(/admin)` de auth route |
| Hay login pero no admin | Borrar `(admin)/`, mantener `login/` |

### "¿Necesito i18n?"

| Situación | Acción |
|-----------|--------|
| El sitio es multilingüe | Mantener content_blocks + translations + RPC |
| Es solo un idioma | Borrar `services/sections/`, LanguageSwitcher, eliminar detección de lang en layouts. Hardcodear contenido. |
| Usa otro sistema i18n (next-intl) | Reemplazar content service por el adapter correspondiente |

### "¿Necesito Supabase?"

| Situación | Acción |
|-----------|--------|
| Backend en Supabase | Mantener todo `utils/supabase/`, middleware, auth |
| Backend custom (NestJS, Express) | Borrar `utils/supabase/`, `middleware.ts`, reemplazar auth por el sistema propio |
| Sin backend | Borrar `services/`, `utils/supabase/`, middleware, auth. Hardcodear datos. |

### "¿Qué colores uso?"

| Situación | Acción |
|-----------|--------|
| Quiero los colores Centeno | Mantener `globals.css` tal cual |
| Quiero otros colores | Editar solo los bloques `.light` y `.dark` en `globals.css` |
| Solo modo oscuro | Borrar bloque `.light`, hardcodear `class="dark"` en `<html>` |

### "¿Necesito animaciones?"

| Situación | Acción |
|-----------|--------|
| Landing con scroll | Mantener `animations/Animations.tsx` |
| App dashboard | Borrar carpeta `animations/`, eliminar `framer-motion` de package.json |

---

## Database Setup

Run `setup-database.sql` in Supabase SQL Editor. It creates:

1. **content_blocks** — each translatable section (navbar, footer, etc.)
2. **languages** — available languages (es, en)
3. **translations** — JSON content per block per language
4. **profiles** — user profiles with role (user/admin)
5. **get_translation_by_key RPC** — fetch translation by block key + lang
6. **handle_new_user trigger** — auto-create profile on signup
7. **Seed data** — navbar and footer in ES and EN

### How i18n works

```
User visits /?lang=en
  → Layout reads cookie 'lang' or query param
  → getNavbarData('en') calls RPC get_translation_by_key('navbar', 'en')
  → Returns JSON: { links: [...], button: "Get Started" }
  → Navbar component renders with English content
```

### How auth works

```
User clicks "Continuar con Google"
  → Supabase OAuth redirects to Google
  → Google redirects back to /auth/callback
  → exchangeCodeForSession()
  → Redirect to /auth/route
  → Checks role → admin → /admin, otherwise → /
```

### RLS Policies

- `content_blocks` / `translations`: public read, admin write
- `profiles`: public read
- Admin is identified by a specific UUID (set in policy)

---

## Adding a New Page Section

1. **Define types** in `components/types.ts`:
```typescript
export interface HeroProps {
  content: {
    title: string;
    subtitle: string;
  };
}
```

2. **Create organism** in `components/organisms/HeroSection.tsx`:
```typescript
import { Title1, Paragraph } from "@/components/server-components";
import { FadeUp } from "@/components/animations/Animations";
import type { HeroProps } from "@/components/types";

export function HeroSection({ content }: HeroProps) {
  return (
    <section className="bg-page py-20 px-6">
      <FadeUp>
        <Title1 className="text-[clamp(2.5rem,6vw,5rem)]" txt={content.title} />
      </FadeUp>
    </section>
  );
}
```

3. **Register in barrel**: add to `server-components.ts`:
```typescript
export * from "./organisms/HeroSection";
```

4. **Add to page**: in `(public)/page.tsx`:
```typescript
<HeroSection content={data.heroData} />
```

5. **Create skeleton**: `components/skeletons/organism/HeroSectionSkeleton.tsx`

---

## Conventions

- **Server Components by default** — only use `"use client"` when needed (state, effects, browser APIs)
- **Named exports** — no default exports
- **Props always typed** — `XxxProps` interface for every component
- **Semantic tokens** — never hardcoded colors (`bg-page`, not `bg-[#FAF8F5]`)
- **fetch in parallel** — `Promise.all` in orchestrators
- **Barrels separated** — `server-components.ts` and `client-components.ts` never mix
- **Skeletons mirror layout** — same classes as real component + `animate-pulse`
- **`viewport={{ once: true }}`** — animations play once

---

## Complementary Skills

For full standards reference, see the Hermes skills installed in the `coding` profile:

- `nextjs-app-router-architecture`
- `react-atomic-design`
- `design-system-tailwind`
- `supabase-nextjs-integration`
- `forms-react-hook-form-zod`
- `skeleton-loading-states`
- `typescript-conventions`
- `admin-editor-pattern`
- `animations-framer-motion`
- `i18n-content-blocks`

---

## To-Do / Coming Soon

- [ ] Panel admin completo (AdminNavbar + modo edición)
- [ ] Tests (Vitest + Testing Library)
- [ ] PWA support
- [ ] CI/CD template (GitHub Actions)
