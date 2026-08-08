// ================================================================
// DashboardClient — Client Component con toda la UI del dashboard
// Recibe datos pre-fetcheados del server
// ================================================================
"use client";

import { useState, useMemo } from "react";
import { agruparPorProveedor, type Alerta, type MetodoProyeccion } from "@/lib/data";
import { generarAlertas, detectarAnomalias } from "@/lib/data";
import { guardarOrdenes, eliminarOrdenesPorIngrediente } from "@/services/ordenes.data.service";
import { procesarCSV } from "@/services/upload.service";
import type { TipoAlerta } from "@/lib/tipos";
import { DashboardShell } from "@/components/organisms/DashboardShell";
import { DashboardHeader } from "@/components/organisms/DashboardHeader";
import { DashboardNav } from "@/components/organisms/DashboardNav";
import { MetodosInfoDialog } from "@/components/molecules/MetodosInfoDialog";
import { ArchivosProblematicosModal } from "@/components/molecules/ArchivosProblematicosModal";
import { ChatBox } from "@/components/molecules/ChatBox";
import { FadeUp } from "@/components/animations/Animations";

const SUCURSALES = ["Brisas del Golf", "Costa del Este", "Marbella", "Via Argentina"];

interface DashboardClientProps {
  alertasIniciales: Alerta[];
  anomalasIniciales: Alerta[];
}

export function DashboardClient({ alertasIniciales, anomalasIniciales }: DashboardClientProps) {
  const [alertas, setAlertas] = useState(alertasIniciales);
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
    const extra = warnings > 0 ? ` (${warnings} advertencias)` : "";
    return `${rows} órdenes cargadas${extra}`;
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
      <DashboardShell metodo={metodo} cambiarMetodo={cambiarMetodo} procesarUpload={procesarUpload} totalItems={stats.total} onOpenInfo={() => setInfoOpen(true)} />

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

      <section className="px-6 md:px-12 pb-12">
        <div className="max-w-7xl mx-auto">
          <DashboardNav
            porProveedor={porProveedor} anomalas={anomalas} filtradas={filtradas} criticas={criticas}
            sucursalActiva={sucursalActiva} setSucursalActiva={setSucursalActiva}
            filtroTipo={filtroTipo} sucursales={SUCURSALES} total={stats.total}
          />
        </div>
      </section>

      <MetodosInfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
      <ArchivosProblematicosModal open={sinDatosOpen} onClose={() => setSinDatosOpen(false)} sinDatos={sinDatosList} onEliminarArchivos={eliminarSinDatos} />
      <ChatBox alertas={filtradas} />
    </main>
  );
}
