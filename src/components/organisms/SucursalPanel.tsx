// ================================================================
// SucursalPanel — Panel con tabs, alertas toggleables, tabla, chart
// ================================================================
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Tabs } from "@/components/ui-components";
import { AlertCard } from "@/components/molecules/AlertCard";
import { IngredientesTable } from "@/components/molecules/IngredientesTable";
import { OrdenChart } from "@/components/molecules/OrdenChart";
import { TodasChart } from "@/components/molecules/TodasChart";
import { FadeUp } from "@/components/animations/Animations";
import type { Alerta } from "@/lib/tipos";

interface SucursalPanelProps {
  sucursales: string[];
  activa: string;
  onChange: (s: string) => void;
  criticas: Alerta[];
  filtradas: Alerta[];
}

export function SucursalPanel({ sucursales, activa, onChange, criticas, filtradas }: SucursalPanelProps) {
  const items = [{ id: "Todas", label: "Todas" }, ...sucursales.map((s) => ({ id: s, label: s }))];
  const [mostrarAlertas, setMostrarAlertas] = useState(false);

  return (
    <div className="space-y-6">
      <Tabs items={items} active={activa} onChange={onChange} />

      {criticas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-main">
              {criticas.length} alertas {activa === "Todas" ? "críticas" : `en ${activa}`}
            </h2>
            <button
              onClick={() => setMostrarAlertas(!mostrarAlertas)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-body hover:text-main border border-border-mid rounded-md hover:bg-hover transition-colors"
            >
              {mostrarAlertas ? (
                <><EyeOff className="size-3.5" /> Ocultar</>
              ) : (
                <><Eye className="size-3.5" /> Mostrar</>
              )}
            </button>
          </div>
          {mostrarAlertas && (
            <div className="space-y-3">
              {criticas.map((a, i) => (
                <FadeUp key={`${a.sucursal}-${a.ingrediente_id}-${i}`} delay={i * 0.05}>
                  <AlertCard alerta={a} />
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      )}

      {activa !== "Todas" ? (
        <FadeUp>
          <OrdenChart alertas={filtradas} sucursal={activa} />
        </FadeUp>
      ) : (
        <FadeUp>
          <TodasChart alertas={filtradas} />
        </FadeUp>
      )}

      <FadeUp delay={0.1}>
        <IngredientesTable alertas={filtradas} />
      </FadeUp>
    </div>
  );
}
