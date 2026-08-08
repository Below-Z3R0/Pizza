// ================================================================
// DashboardShell — Header compuesto (delega upload a molécula)
// ================================================================
"use client";

import { Settings2, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Tabs } from "@/components/ui";
import { UploadButton } from "@/components/molecules/UploadButton";
import { FadeUp } from "@/components/animations/Animations";
import { MiniTitle, Title1, Paragraph } from "@/components/server-components";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import type { MetodoProyeccion } from "@/lib/data";

interface DashboardShellProps {
  metodo: MetodoProyeccion;
  cambiarMetodo: (m: MetodoProyeccion) => void;
  procesarUpload: (file: File) => Promise<string>;
  totalItems: number;
  onOpenInfo: () => void;
}

const metodos: { id: MetodoProyeccion; label: string }[] = [
  { id: "mediana", label: "Mediana" },
  { id: "media_movil", label: "Media móvil (3sem)" },
  { id: "media_ponderada", label: "Ponderada" },
];

export function DashboardShell({ metodo, cambiarMetodo, procesarUpload, totalItems, onOpenInfo }: DashboardShellProps) {
  return (
    <section className="py-8 md:py-12 px-6 md:px-12 border-b border-border-subtle bg-card">
      <div className="max-w-7xl mx-auto relative">
        <div className="absolute top-0 right-0 z-10">
          <ThemeToggle />
        </div>
        <FadeUp>
          <MiniTitle content="Barrio Pizza" />
        </FadeUp>
        <FadeUp delay={0.05}>
          <Title1 className="text-[clamp(1.75rem,4vw,2.5rem)]" txt="Dashboard de Compras" />
        </FadeUp>
        <FadeUp delay={0.1}>
          <Paragraph className="text-body mt-2" txt={`Revisión automática de órdenes — ${totalItems} items analizados`} />
        </FadeUp>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <Settings2 className="size-4 text-muted" />
          <Tabs items={metodos} active={metodo} onChange={(id) => {
            cambiarMetodo(id as MetodoProyeccion);
            toast.info(`Método: ${metodos.find((m) => m.id === id)?.label}`);
          }} />
          <button onClick={onOpenInfo} className="p-1.5 rounded-full text-muted hover:text-main hover:bg-hover transition-colors" aria-label="Info">
            <HelpCircle className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <UploadButton onUpload={procesarUpload} />
        </div>
      </div>
    </section>
  );
}
