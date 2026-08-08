// ================================================================
// DashboardNav — Badges de navegación + contenido condicional
// ================================================================
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui";
import { AnomaliasSection } from "@/components/molecules/AnomaliasSection";
import { ProveedoresList } from "@/components/molecules/ProveedoresList";
import { ComparativaSemanal } from "@/components/molecules/ComparativaSemanal";
import { SucursalPanel } from "@/components/organisms/SucursalPanel";
import type { Alerta } from "@/lib/tipos";

type Vista = "default" | "proveedores" | "anomalias" | "tendencias";

interface DashboardNavProps {
  porProveedor: Record<string, Alerta[]>;
  anomalas: Alerta[];
  filtradas: Alerta[];
  criticas: Alerta[];
  sucursalActiva: string;
  setSucursalActiva: (s: string) => void;
  filtroTipo: string | null;
  sucursales: string[];
  total: number;
}

export function DashboardNav({
  porProveedor, anomalas, filtradas, criticas,
  sucursalActiva, setSucursalActiva, filtroTipo,
  sucursales, total,
}: DashboardNavProps) {
  const [view, setView] = useState<Vista>("default");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <NavBadge active={view === "proveedores"} onClick={() => setView(view === "proveedores" ? "default" : "proveedores")}>
          Por proveedor ({Object.keys(porProveedor).length})
        </NavBadge>
        {anomalas.length > 0 && (
          <NavBadge active={view === "anomalias"} variant="warning" onClick={() => setView(view === "anomalias" ? "default" : "anomalias")}>
            Anomalías ({anomalas.length})
          </NavBadge>
        )}
        <NavBadge active={view === "tendencias"} variant="success" onClick={() => setView(view === "tendencias" ? "default" : "tendencias")}>
          Tendencias S1-S6
        </NavBadge>
        {filtroTipo && (
          <span className="text-sm text-muted">Mostrando {filtradas.length} de {total} alertas</span>
        )}
      </div>

      {view === "anomalias" && <AnomaliasSection anomalas={anomalas} visible />}
      {view === "proveedores" && <ProveedoresList grupos={porProveedor} />}
      {view === "tendencias" && <ComparativaSemanal />}
      {view === "default" && (
        <SucursalPanel
          sucursales={sucursales}
          activa={sucursalActiva}
          onChange={setSucursalActiva}
          criticas={criticas}
          filtradas={filtradas}
        />
      )}
    </div>
  );
}

function NavBadge({
  active, variant = "outline", onClick, children,
}: {
  active: boolean; variant?: "default" | "warning" | "success" | "outline"; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <Badge
      variant={active ? (variant === "warning" ? "warning" : variant === "success" ? "success" : "default") : "outline"}
      className="cursor-pointer"
      onClick={onClick}
    >
      {children}
    </Badge>
  );
}
