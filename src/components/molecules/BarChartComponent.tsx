// ================================================================
// BarChartComponent — Componente aislado de Recharts para carga dinámica
// Evita problemas de SSR con Turbopack al cargarse solo en cliente
// ================================================================
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface BarChartData {
  name: string;
  Necesario: number;
  Pedido: number;
}

export default function BarChartComponent({ data }: { data: BarChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fontSize: 10, fill: "var(--text-muted)" }}
          interval={0}
        />
        <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-mid)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Legend />
        <Bar dataKey="Necesario" fill="var(--accent)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Pedido" fill="var(--accent-light)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
