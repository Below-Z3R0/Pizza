import { MiniTitle, Title1, Paragraph } from "@/components/server-components";
import { FadeUp } from "@/components/animations/Animations";
import { ThemeToggleWrapper } from "@/components/atoms/ThemeToggleWrapper";
import { MethodSelector } from "@/components/molecules/MethodSelector";
import { UploadButton } from "@/components/molecules/UploadButton";
import { InfoButton } from "@/components/molecules/InfoButton";
import { DashboardHeader } from "@/components/organisms/DashboardHeader";
import { DashboardNav } from "@/components/organisms/DashboardNav";
import { ChatBox } from "@/components/molecules/ChatBox";
import type { Alerta, MetodoProyeccion } from "@/lib/data";

interface DashboardShellProps {
  alertas: Alerta[];
  anomalas: Alerta[];
  metodo: MetodoProyeccion;
}

export function DashboardShell({ alertas, anomalas, metodo }: DashboardShellProps) {
  return (
    <main className="min-h-screen bg-page">
      <section className="py-6 md:py-10 px-6 md:px-12 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto relative">
          <ThemeToggleWrapper />
          <FadeUp>
            <MiniTitle content="Barrio Pizza" />
          </FadeUp>
          <FadeUp delay={0.05}>
            <Title1 className="text-[clamp(1.75rem,4vw,2.5rem)]" txt="Dashboard de Compras" />
          </FadeUp>
          <FadeUp delay={0.1}>
            <Paragraph className="text-body mt-2" txt={`Revisión automática de órdenes — ${alertas.length} items analizados`} />
          </FadeUp>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <MethodSelector actual={metodo} />
            <InfoButton />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <UploadButton />
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <DashboardHeader alertas={alertas} />
          </FadeUp>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-12">
        <div className="max-w-7xl mx-auto">
          <DashboardNav alertas={alertas} anomalas={anomalas} />
        </div>
      </section>

      <ChatBox alertas={alertas} />
    </main>
  );
}
