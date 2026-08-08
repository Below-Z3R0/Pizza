// ================================================================
// ComparativaSemanal — Gráfico de líneas de tendencia semanal
// ================================================================
"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-components";
import { Badge } from "@/components/ui-components";
import { Tabs } from "@/components/ui-components";
import { getTendencias, formatearParaGrafico, type TendenciaSucursal } from "@/services/tendencias.service";

const TrendLineChart = dynamic(
  () => import("./TrendLineChart"),
  { ssr: false, loading: () => <CardContent className="p-4 text-center text-muted text-sm">Cargando...</CardContent> }
);

const INGREDIENTES_CLAVE = ["harina", "mozzarella", "pepperoni", "salsa_pelatti", "cebolla", "aceite_oliva"];

export function ComparativaSemanal() {
  const [tendencias, setTendencias] = useState<TendenciaSucursal[]>([]);
  const [sucursal, setSucursal] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTendencias()
      .then((t) => {
        setTendencias(t);
        if (t.length > 0) setSucursal(t[0].sucursal);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-muted text-sm">Cargando tendencias...</CardContent>
      </Card>
    );
  }

  const sucursalesConDatos = tendencias.filter((t) => t.sucursal === sucursal).length > 0;
  const data = sucursalesConDatos
    ? formatearParaGrafico(tendencias, sucursal, INGREDIENTES_CLAVE)
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>Tendencia de consumo semanal — {sucursal}</CardTitle>
          <div className="flex gap-1.5 flex-wrap">
            <Tabs
              items={tendencias.map((t) => ({ id: t.sucursal, label: t.sucursal }))}
              active={sucursal}
              onChange={setSucursal}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <TrendLineChart data={data} ingredientes={INGREDIENTES_CLAVE} />
        ) : (
          <p className="text-center text-muted text-sm py-8">Sin datos para mostrar</p>
        )}
        <div className="flex gap-2 mt-3 flex-wrap">
          {INGREDIENTES_CLAVE.map((ing) => (
            <Badge key={ing} variant="outline">{ing}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
