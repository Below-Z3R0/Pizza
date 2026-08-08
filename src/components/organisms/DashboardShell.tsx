// ================================================================
// DashboardShell — Client Component: estado + composición de organismos
// Recibe datos del Server Component padre, compone la UI
// ================================================================
"use client";

import { useState, useMemo } from "react";
import { Settings2, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Tabs } from "@/components/ui";
import { UploadButton } from "@/components/molecules/UploadButton";
import { MetodosInfoDialog } from "@/components/molecules/MetodosInfoDialog";
import { ArchivosProblematicosModal } from "@/components/molecules/ArchivosProblematicosModal";
import { ChatBox } from "@/components/molecules/ChatBox";
import { FadeUp } from "@/components/animations/Animations";
import { MiniTitle, Title1, Paragraph } from "@/components/server-components";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { DashboardHeader } from "@/components/organisms/DashboardHeader";
import { DashboardNav } from "@/components/organisms/DashboardNav";
import { generarAlertas, detectarAnomalias, agruparPorProveedor, type Alerta, type MetodoProyeccion } from "@/lib/data";
import { procesarCSV } from "@/services/upload.service";
import { eliminarOrdenesPorIngrediente } from "@/services/ordenes.data.service";
import type { TipoAlerta } from "@/lib/tipos";

const SUCURSALES = ["Brisas del Golf", "Costa del Este", "Marbella", "Via Argentina"];

const metodos: { id: MetodoProyeccion; label: string }[] = [
  { id: "mediana", label: "Mediana" },
  { id: "media_movil", label: "Media móvil (3sem)" },
  { id: "media_ponderada", label: "Ponderada" },
];

interface DashboardShellProps {
  alertas: Alerta[];
  anomalas: Alerta[];
}

export function DashboardShell({ alertas: iniciales, anomalas: anomalasIniciales }: DashboardShellProps) {
  const [alertas, setAlertas] = useState(iniciales);
  const [anomalas, setAnomalas] = useState(anomalasIniciales);
  const [sucursalActiva, setSucursalActiva] = useState("Todas");
  const [metodo, setMetodo] = useState<MetodoProyeccion>("mediana");
  const [filtroTipo, setFiltroTipo] = useState<TipoAlerta | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [sinDatosOpen, setSinDatosOpen] = useState(false);

  const recargar = async (m?: MetodoProyeccion) => {
    const res = await generarAlertas(m ?? metodo);
    setAlertas(res);
    setAnomalas(detectarAnomalias(res));
  };

  const cambiarMetodo = (m: MetodoProyeccion) => { setMetodo(m); recargar(m); };

  const procesarUpload = async (file: File): Promise<string> => {
    const { rows, warnings } = await procesarCSV(file);
    await recargar();
    return `${rows} órdenes cargadas${warnings > 0 ? ` (${warnings} advertencias)` : ""}`;
  };

  const eliminarSinDatos = async () => {
    const ids = alertas.filter((a) => a.tipo === "sin_datos").map((a) => a.ingrediente_id);
    if (ids.length > 0) { await eliminarOrdenesPorIngrediente(ids); await recargar(); }
  };

  const filtradas = useMemo(() => {
    let r = alertas;
    if (sucursalActiva !== "Todas") r = r.filter((a) => a.sucursal === sucursalActiva);
    if (filtroTipo) r = r.filter((a) => a.tipo === filtroTipo);
    return r;
  }, [alertas, sucursalActiva, filtroTipo]);

  const stats = useMemo(() => ({
    quiebres: alertas.filter((a) => a.tipo === "quiebre").length,
    sobrecompras: alertas.filter((a) => a.tipo === "sobrecompra").length,
    ok: alertas.filter((a) => a.tipo === "ok").length,
    sinDatos: alertas.filter((a) => a.tipo === "sin_datos").length,
    total: alertas.length,
  }), [alertas]);

  const criticas = useMemo(() =>
    filtroTipo ? filtradas : filtradas.filter((a) => a.tipo === "quiebre" || a.tipo === "sobrecompra"),
  [filtradas, filtroTipo]);

  const sinDatosList = useMemo(() => alertas.filter((a) => a.tipo === "sin_datos"), [alertas]);
  const porProveedor = useMemo(() => agruparPorProveedor(alertas), [alertas]);

  return (
    <main className="min-h-screen bg-page">
      {/* Header */}
      <section className="py-6 md:py-10 px-6 md:px-12 border-b border-border-subtle">
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
            <Paragraph className="text-body mt-2" txt={`Revisión automática de órdenes — ${stats.total} items analizados`} />
          </FadeUp>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Settings2 className="size-4 text-muted" />
            <Tabs items={metodos} active={metodo} onChange={(id) => {
              cambiarMetodo(id as MetodoProyeccion);
              toast.info(`Método: ${metodos.find((m) => m.id === id)?.label}`);
            }} />
            <button onClick={() => setInfoOpen(true)} className="p-1.5 rounded-full text-muted hover:text-main hover:bg-hover transition-colors" aria-label="Info">
              <HelpCircle className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <UploadButton onUpload={procesarUpload} />
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <DashboardHeader
              quiebres={stats.quiebres} sobrecompras={stats.sobrecompras}
              ok={stats.ok} sinDatos={stats.sinDatos} total={stats.total}
              filtroActivo={filtroTipo} onFiltrar={setFiltroTipo}
              onAbrirSinDatos={() => setSinDatosOpen(true)}
            />
          </FadeUp>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="px-6 md:px-12 pb-12">
        <div className="max-w-7xl mx-auto">
          <DashboardNav
            porProveedor={porProveedor} anomalas={anomalas} filtradas={filtradas} criticas={criticas}
            sucursalActiva={sucursalActiva} setSucursalActiva={setSucursalActiva}
            filtroTipo={filtroTipo} sucursales={SUCURSALES} total={stats.total}
          />
        </div>
      </section>

      {/* Modales y chat */}
      <MetodosInfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
      <ArchivosProblematicosModal open={sinDatosOpen} onClose={() => setSinDatosOpen(false)} sinDatos={sinDatosList} onEliminarArchivos={eliminarSinDatos} />
      <ChatBox alertas={filtradas} />
    </main>
  );
}
