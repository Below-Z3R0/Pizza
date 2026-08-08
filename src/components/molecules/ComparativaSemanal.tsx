"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-components";
import { Badge } from "@/components/ui-components";
import { Tabs } from "@/components/ui-components";
import { getTendencias, formatearParaGrafico, type TendenciaSucursal } from "@/services/tendencias.service";

const INGREDIENTES_CLAVE = ["harina", "mozzarella", "pepperoni", "salsa_pelatti", "cebolla", "aceite_oliva"];
const COLORS = ["#6366F1", "#8B5CF6", "#A78BFA", "#10B981", "#F59E0B", "#EF4444"];

export function ComparativaSemanal() {
  const [tendencias, setTendencias] = useState<TendenciaSucursal[]>([]);
  const [sucursal, setSucursal] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTendencias()
      .then((t) => { setTendencias(t); if (t.length > 0) setSucursal(t[0].sucursal); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Card><CardContent className="p-4 text-center text-muted text-sm">Cargando tendencias...</CardContent></Card>;
  }

  const data = formatearParaGrafico(tendencias, sucursal, INGREDIENTES_CLAVE);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>Tendencia de consumo semanal — {sucursal}</CardTitle>
          <Tabs items={tendencias.map((t) => ({ id: t.sucursal, label: t.sucursal }))} active={sucursal} onChange={setSucursal} />
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="semana" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-mid)", borderRadius: "8px", fontSize: "12px" }} />
              <Legend />
              {INGREDIENTES_CLAVE.map((ing, i) => (
                <Line key={ing} type="monotone" dataKey={ing} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted text-sm py-8">Sin datos para mostrar</p>
        )}
        <div className="flex gap-2 mt-3 flex-wrap">
          {INGREDIENTES_CLAVE.map((ing) => <Badge key={ing} variant="outline">{ing}</Badge>)}
        </div>
      </CardContent>
    </Card>
  );
}
