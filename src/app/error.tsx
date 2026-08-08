// ================================================================
// error.tsx — Error boundary del dashboard (Next.js standard)
// ================================================================
"use client";

import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { Title1, Paragraph } from "@/components/server-components";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen bg-page flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 flex flex-col items-center text-center space-y-6">
        {/* Icono */}
        <div className="relative">
          <div className="absolute inset-0 bg-red-100 blur-2xl rounded-full" />
          <div className="relative bg-red-50 p-4 rounded-full border border-red-200">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <Title1 className="text-xl!" txt="Algo salió mal" />
          <Paragraph
            className="text-sm text-muted leading-relaxed"
            txt={error.message || "Error inesperado al cargar el dashboard."}
          />
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
            Inicio
          </a>
        </div>
      </Card>
    </main>
  );
}
