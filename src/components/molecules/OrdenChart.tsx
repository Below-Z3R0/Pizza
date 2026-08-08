"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-components";
import type { Alerta } from "@/lib/tipos";

export function OrdenChart({ alertas, sucursal }: { alertas: Alerta[]; sucursal: string }) {
  const data = alertas
    .filter((a) => a.sucursal === sucursal)
    .slice(0, 15)
    .map((a) => ({
      name: a.nombre.length > 12 ? a.nombre.slice(0, 12) + "..." : a.nombre,
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
      <CardHeader><CardTitle>Formatos: Necesario vs Pedido — {sucursal}</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10, fill: "var(--text-muted)" }} interval={0} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
            <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-mid)", borderRadius: "8px", fontSize: "12px" }} />
            <Legend />
            <Bar dataKey="Necesario" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Pedido" fill="var(--accent-light)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
