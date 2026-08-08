// ================================================================
// OrdenChart — Gráfico de barras comparativo con Recharts
// Carga dinámica para evitar problemas de SSR con Turbopack
// ================================================================
"use client";

import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import type { Alerta } from "@/lib/tipos";

const BarChartComponent = dynamic(
  () => import("./BarChartComponent"),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="p-4 text-center text-muted text-sm">Cargando gráfico...</CardContent>
      </Card>
    ),
  }
);

export function OrdenChart({ alertas, sucursal }: { alertas: Alerta[]; sucursal: string }) {
  const data = alertas
    .filter((a) => a.sucursal === sucursal)
    .slice(0, 15)
    .map((a) => ({
      name: a.nombre,
      Necesario: a.formatos_necesarios,
      Pedido: a.formatos_pedidos,
    }));

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-muted text-sm">Sin datos para graficar</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formatos: Necesario vs Pedido — {sucursal}</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChartComponent data={data} />
      </CardContent>
    </Card>
  );
}
