// ================================================================
// error.tsx — Error boundary del dashboard (Next.js standard)
// Con tema de marca 🍕 — mensaje de error con identidad Barrio Pizza
// ================================================================
"use client";

import { RefreshCcw, Home, Pizza } from "lucide-react";
import { Card } from "@/components/ui-components";
import { Title1, Paragraph } from "@/components/server-components";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen bg-page flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 flex flex-col items-center text-center space-y-6 overflow-hidden relative">
        {/* Fondo decorativo tenue (salsa) */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-accent-soft/20 blur-3xl pointer-events-none" />

        {/* Toast / icono estilo horno caliente */}
        <div className="relative">
          <div className="absolute inset-0 bg-orange-100 dark:bg-orange-900/30 blur-2xl rounded-full" />
          <div className="relative w-20 h-20 rounded-full border border-orange-200 dark:border-orange-800/40 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30 flex items-center justify-center">
            <Pizza className="w-10 h-10 text-orange-500 dark:text-orange-400" />
          </div>
          {/* Mini chispas de calor */}
          <span className="absolute -top-1 left-2 text-orange-400 text-lg animate-pulse">🔥</span>
          <span className="absolute top-6 -right-1 text-orange-300 text-sm animate-pulse" style={{ animationDelay: "0.3s" }}>💨</span>
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <Title1 className="text-xl!" txt="🍕 Algo se cayó del horno." />
          <Paragraph
            className="text-sm text-muted leading-relaxed"
            txt="El dashboard se está recalentando. Volvé a intentarlo o agarrá una pizza fría mientras tanto."
          />
          {error?.digest ? (
            <p className="text-[11px] font-mono text-dim mt-1">Código: {error.digest}</p>
          ) : null}
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-alt text-page rounded-md font-medium text-sm transition-all shadow-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            Reintentar
          </button>
          <a
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 border border-border-mid hover:bg-hover text-main rounded-md font-medium text-sm transition-all"
          >
            <Home className="w-4 h-4" />
            Volver al inicio
          </a>
        </div>
      </Card>
    </main>
  );
}
