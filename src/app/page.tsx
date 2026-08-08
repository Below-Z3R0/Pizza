"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";
import { useDashboard } from "@/hooks/useDashboard";
import { DashboardShell } from "@/components/organisms/DashboardShell";
import { DashboardHeader } from "@/components/organisms/DashboardHeader";
import { SucursalPanel } from "@/components/organisms/SucursalPanel";
import { MetodosInfoDialog } from "@/components/molecules/MetodosInfoDialog";
import { AnomaliasSection } from "@/components/molecules/AnomaliasSection";
import { ProveedoresList } from "@/components/molecules/ProveedoresList";
import { ArchivosProblematicosModal } from "@/components/molecules/ArchivosProblematicosModal";
import { Badge } from "@/components/ui";
import { FadeUp } from "@/components/animations/Animations";

export default function DashboardPage() {
  const {
    loading,
    sucursalActiva, setSucursalActiva,
    metodo, cambiarMetodo,
    filtroTipo, setFiltroTipo,
    filtradas, stats, criticas, sinDatosList, anomalas, porProveedor,
    eliminarSinDatos, procesarUpload,
    SUCURSALES,
  } = useDashboard();

  const [mostrarProveedores, setMostrarProveedores] = useState(false);
  const [mostrarAnomalias, setMostrarAnomalias] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [sinDatosOpen, setSinDatosOpen] = useState(false);

  if (loading) return null;

  return (
    <main className="min-h-screen bg-page">
      <DashboardShell
        metodo={metodo}
        cambiarMetodo={cambiarMetodo}
        procesarUpload={procesarUpload}
        totalItems={stats.total}
        onOpenInfo={() => setInfoOpen(true)}
      />

      <section className="px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <DashboardHeader
              quiebres={stats.quiebres} sobrecompras={stats.sobrecompras}
              ok={stats.ok} sinDatos={stats.sinDatos} total={stats.total}
              filtroActivo={filtroTipo}
              onFiltrar={setFiltroTipo}
              onAbrirSinDatos={() => setSinDatosOpen(true)}
            />
          </FadeUp>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Badges de navegación */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={mostrarProveedores ? "default" : "outline"} className="cursor-pointer"
              onClick={() => { setMostrarProveedores(!mostrarProveedores); setMostrarAnomalias(false); }}>
              Por proveedor ({Object.keys(porProveedor).length})
            </Badge>
            {anomalas.length > 0 && (
              <Badge variant={mostrarAnomalias ? "warning" : "outline"} className="cursor-pointer"
                onClick={() => { setMostrarAnomalias(!mostrarAnomalias); setMostrarProveedores(false); }}>
                Anomalías ({anomalas.length})
              </Badge>
            )}
            {filtroTipo && (
              <span className="text-sm text-muted">Mostrando {filtradas.length} de {stats.total} alertas</span>
            )}
          </div>

          {/* Contenido condicional */}
          <AnomaliasSection anomalas={anomalas} visible={mostrarAnomalias} />

          {mostrarProveedores ? (
            <ProveedoresList grupos={porProveedor} />
          ) : (
            <SucursalPanel sucursales={SUCURSALES} activa={sucursalActiva} onChange={setSucursalActiva} criticas={criticas} filtradas={filtradas} />
          )}
        </div>
      </section>

      <MetodosInfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
      <ArchivosProblematicosModal open={sinDatosOpen} onClose={() => setSinDatosOpen(false)} sinDatos={sinDatosList} onEliminarArchivos={eliminarSinDatos} />
    </main>
  );
}
