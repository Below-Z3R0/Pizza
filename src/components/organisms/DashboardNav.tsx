"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui-components";
import { AnomaliasSection } from "@/components/molecules/AnomaliasSection";
import { ProveedoresList } from "@/components/molecules/ProveedoresList";
import { ComparativaSemanal } from "@/components/molecules/ComparativaSemanal";
import { SucursalPanel } from "@/components/organisms/SucursalPanel";
import { agruparPorProveedor } from "@/lib/data";
import { useMemo } from "react";
import type { Alerta, TipoAlerta } from "@/lib/tipos";

const SUCURSALES = ["Brisas del Golf", "Costa del Este", "Marbella", "Via Argentina"];

type Vista = "default" | "proveedores" | "anomalias" | "tendencias";

interface DashboardNavProps {
  alertas: Alerta[];
  anomalas: Alerta[];
}

export function DashboardNav({ alertas, anomalas }: DashboardNavProps) {
  const searchParams = useSearchParams();
  const filtroTipo = (searchParams.get("filtro") as TipoAlerta) || null;
  const [view, setView] = useState<Vista>("default");
  const [sucursalActiva, setSucursalActiva] = useState("Todas");

  const porProveedor = useMemo(() => agruparPorProveedor(alertas), [alertas]);

  const filtradas = useMemo(() => {
    let r = alertas;
    if (sucursalActiva !== "Todas") r = r.filter((a) => a.sucursal === sucursalActiva);
    if (filtroTipo) r = r.filter((a) => a.tipo === filtroTipo);
    return r;
  }, [alertas, sucursalActiva, filtroTipo]);

  const criticas = useMemo(() =>
    filtroTipo ? filtradas : filtradas.filter((a) => a.tipo === "quiebre" || a.tipo === "sobrecompra"),
  [filtradas, filtroTipo]);

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
          <span className="text-sm text-muted">Mostrando {filtradas.length} de {alertas.length} alertas</span>
        )}
      </div>

      {view === "anomalias" && <AnomaliasSection anomalas={anomalas} visible />}
      {view === "proveedores" && <ProveedoresList grupos={porProveedor} />}
      {view === "tendencias" && <ComparativaSemanal />}
      {view === "default" && (
        <SucursalPanel sucursales={SUCURSALES} activa={sucursalActiva} onChange={setSucursalActiva} criticas={criticas} filtradas={filtradas} />
      )}
    </div>
  );
}

function NavBadge({ active, variant = "outline", onClick, children }: {
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
