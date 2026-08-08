"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-components";
import type { Alerta } from "@/lib/tipos";

const COLORS = ["#6366F1", "#8B5CF6", "#A78BFA", "#C4B5FD", "#818CF8", "#A5B4FC", "#7C3AED", "#4F46E5"];

export function TodasChart({ alertas }: { alertas: Alerta[] }) {
  const sucursales = [...new Set(alertas.map((a) => a.sucursal))];
  if (sucursales.length === 0) return null;

  const ingredientes = [...new Set(alertas.map((a) => a.ingrediente_id))].slice(0, 8);

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
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
            <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-mid)", borderRadius: "8px", fontSize: "12px" }} />
            <Legend />
            {ingredientes.map((ing, i) => (
              <Bar key={ing} dataKey={ing} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
