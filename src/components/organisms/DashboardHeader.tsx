"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, AlertTriangle, CheckCircle2, HelpCircle, X } from "lucide-react";
import { StatCard } from "@/components/molecules/StatCard";
import { ArchivosProblematicosModal } from "@/components/molecules/ArchivosProblematicosModal";
import { eliminarOrdenesPorIngrediente } from "@/services/ordenes.data.service";
import { useMemo, useState, useCallback } from "react";
import type { Alerta, TipoAlerta } from "@/lib/tipos";

interface DashboardHeaderProps {
  alertas: Alerta[];
}

const filtros: { tipo: TipoAlerta; label: string; icon: typeof AlertCircle; variant: "danger" | "warning" | "success" | "default" }[] = [
  { tipo: "quiebre", label: "Quiebres", icon: AlertCircle, variant: "danger" },
  { tipo: "sobrecompra", label: "Sobrecompras", icon: AlertTriangle, variant: "warning" },
  { tipo: "ok", label: "Correctos", icon: CheckCircle2, variant: "success" },
  { tipo: "sin_datos", label: "Sin datos", icon: HelpCircle, variant: "default" },
];

export function DashboardHeader({ alertas }: DashboardHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filtroActivo = (searchParams.get("filtro") as TipoAlerta) || null;
  const [sinDatosOpen, setSinDatosOpen] = useState(false);

  const stats = useMemo(() => ({
    quiebres: alertas.filter((a) => a.tipo === "quiebre").length,
    sobrecompras: alertas.filter((a) => a.tipo === "sobrecompra").length,
    ok: alertas.filter((a) => a.tipo === "ok").length,
    sinDatos: alertas.filter((a) => a.tipo === "sin_datos").length,
    total: alertas.length,
  }), [alertas]);

  const sinDatosList = useMemo(() => alertas.filter((a) => a.tipo === "sin_datos"), [alertas]);

  const handleFiltrar = (tipo: TipoAlerta | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tipo) params.set("filtro", tipo);
    else params.delete("filtro");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const eliminarSinDatos = useCallback(async () => {
    const ids = sinDatosList.map((a) => a.ingrediente_id);
    if (ids.length > 0) {
      await eliminarOrdenesPorIngrediente(ids);
      router.refresh();
    }
  }, [sinDatosList, router]);

  const valores: Record<TipoAlerta, number> = {
    quiebre: stats.quiebres,
    sobrecompra: stats.sobrecompras,
    ok: stats.ok,
    sin_datos: stats.sinDatos,
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filtros.map((f) => (
          <StatCard
            key={f.tipo}
            title={f.label}
            value={valores[f.tipo]}
            subtitle={f.tipo === "ok" ? `de ${stats.total} items` : undefined}
            icon={f.icon}
            variant={f.variant}
            onClick={() => {
              if (f.tipo === "sin_datos") {
                setSinDatosOpen(true);
                return;
              }
              handleFiltrar(filtroActivo === f.tipo ? null : f.tipo);
            }}
          />
        ))}
      </div>
      {filtroActivo && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">
            Mostrando: <span className="font-semibold text-main">{filtros.find((f) => f.tipo === filtroActivo)?.label}</span>
          </span>
          <button onClick={() => handleFiltrar(null)} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-accent hover:text-accent-alt transition-colors">
            <X className="size-3" /> Limpiar filtro
          </button>
        </div>
      )}
      <ArchivosProblematicosModal open={sinDatosOpen} onClose={() => setSinDatosOpen(false)} sinDatos={sinDatosList} onEliminarArchivos={eliminarSinDatos} />
    </div>
  );
}
