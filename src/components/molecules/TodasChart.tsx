// ================================================================
// TodasChart — Gráfico combinado de todas las sucursales
// ================================================================
"use client";

import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-components";
import type { Alerta } from "@/lib/tipos";

const CombinedBarChart = dynamic(
  () => import("./CombinedBarChart"),
  { ssr: false, loading: () => <Card><CardContent className="p-4 text-center text-muted text-sm">Cargando gráfico...</CardContent></Card> }
);

export function TodasChart({ alertas }: { alertas: Alerta[] }) {
  const sucursales = [...new Set(alertas.map((a) => a.sucursal))];
  if (sucursales.length === 0) return null;

  const ingredientes = [...new Set(alertas.map((a) => a.ingrediente_id))]
    .slice(0, 8);

  const data = sucursales.map((suc) => {
    const entry: Record<string, string | number> = { name: suc };
    for (const ing of ingredientes) {
      const a = alertas.find((x) => x.sucursal === suc && x.ingrediente_id === ing);
      entry[ing] = a ? a.formatos_necesarios : 0;
    }
    return entry;
  });

  return (
    <Card>
      <CardHeader><CardTitle>Comparativa: Formatos necesarios por sucursal</CardTitle></CardHeader>
      <CardContent>
        <CombinedBarChart data={data} ingredientes={ingredientes} />
      </CardContent>
    </Card>
  );
}
