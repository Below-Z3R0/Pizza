// ============================================
// (public)/page.tsx — Landing page de ejemplo
// ============================================
// Server Component: hace fetch paralelo de datos y renderiza
// las secciones. Cada proyecto define sus propias secciones.

import { FadeUp } from "@/components/animations/Animations";
import { MiniTitle, Paragraph, Title1 } from "@/components/server-components";

/* ================================================================
   NOTA: Esta es una página de ejemplo. Reemplazar con las
   secciones reales del proyecto (HeroSection, etc.).
   ================================================================ */

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const lang = resolvedParams.lang || "es";

  return (
    <main className="flex flex-col">
      {/* Ejemplo de sección Hero */}
      <section className="relative bg-page min-h-screen pt-28 md:pt-40 pb-20 px-6 md:px-12 overflow-hidden">
        <div className="relative max-w-3xl mx-auto text-center">
          <FadeUp>
            <MiniTitle content="Next.js Template" />
          </FadeUp>

          <FadeUp delay={0.1}>
            <Title1
              className="text-[clamp(2.5rem,6vw,5rem)] font-sans font-bold leading-[1.05] tracking-tight"
              txt={`Tu proyecto empieza aquí (${lang.toUpperCase()})`}
            />
          </FadeUp>

          <FadeUp delay={0.16}>
            <Paragraph
              className="text-lg text-body leading-relaxed mt-4"
              txt="Este template incluye Atomic Design, Supabase SSR, autenticación, i18n con content blocks, sistema de diseño con temas light/dark, y skeleton loaders."
            />
          </FadeUp>

          <FadeUp delay={0.22}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-alt text-white text-sm font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Iniciar sesión
              </a>
              <a
                href="https://github.com/Below-Z3R0/nextjs-template"
                className="inline-flex items-center gap-2 px-5 py-3 border border-border-mid hover:border-accent text-main text-sm font-medium rounded-md transition-all duration-200 hover:bg-hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver en GitHub
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
