// ================================================================
// DashboardHeader — KPIs como filtros clickeables (versión original)
// ================================================================
"use client";

import { AlertCircle, AlertTriangle, CheckCircle2, HelpCircle, X } from "lucide-react";
import { StatCard } from "@/components/molecules/StatCard";
import type { TipoAlerta } from "@/lib/tipos";

interface DashboardHeaderProps {
  quiebres: number;
  sobrecompras: number;
  ok: number;
  sinDatos: number;
  total: number;
  filtroActivo: TipoAlerta | null;
  onFiltrar: (tipo: TipoAlerta | null) => void;
  onAbrirSinDatos: () => void;
}

const filtros: { tipo: TipoAlerta; label: string; icon: typeof AlertCircle; variant: "danger" | "warning" | "success" | "default" }[] = [
  { tipo: "quiebre", label: "Quiebres", icon: AlertCircle, variant: "danger" },
  { tipo: "sobrecompra", label: "Sobrecompras", icon: AlertTriangle, variant: "warning" },
  { tipo: "ok", label: "Correctos", icon: CheckCircle2, variant: "success" },
  { tipo: "sin_datos", label: "Sin datos", icon: HelpCircle, variant: "default" },
];

export function DashboardHeader({ quiebres, sobrecompras, ok, sinDatos, total, filtroActivo, onFiltrar, onAbrirSinDatos }: DashboardHeaderProps) {
  const valores: Record<TipoAlerta, number> = { quiebre: quiebres, sobrecompra: sobrecompras, ok, sin_datos: sinDatos };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filtros.map((f) => {
          const activo = filtroActivo === f.tipo;
          return (
            <button
              key={f.tipo}
              onClick={() => {
                if (f.tipo === "sin_datos") {
                  onAbrirSinDatos();
                  return;
                }
                onFiltrar(activo ? null : f.tipo);
              }}
              className={`text-left transition-all duration-200 ${
                activo ? "ring-2 ring-accent scale-[1.02]" : ""
              }`}
            >
              <StatCard
                title={f.label}
                value={valores[f.tipo]}
                subtitle={f.tipo === "ok" ? `de ${total} items` : undefined}
                icon={f.icon}
                variant={f.variant}
              />
            </button>
          );
        })}
      </div>
      {filtroActivo && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">
            Mostrando: <span className="font-semibold text-main">{filtros.find((f) => f.tipo === filtroActivo)?.label}</span>
          </span>
          <button
            onClick={() => onFiltrar(null)}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-accent hover:text-accent-alt transition-colors"
          >
            <X className="size-3" />
            Limpiar filtro
          </button>
        </div>
      )}
    </div>
  );
}
