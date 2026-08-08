// ================================================================
// TrendLineChart — Gráfico de líneas de tendencia (Recharts)
// ================================================================
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6366F1", "#8B5CF6", "#A78BFA", "#10B981", "#F59E0B", "#EF4444"];

export default function TrendLineChart({
  data,
  ingredientes,
}: {
  data: Record<string, any>[];
  ingredientes: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis dataKey="semana" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
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
        {ingredientes.map((ing, i) => (
          <Line
            key={ing}
            type="monotone"
            dataKey={ing}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
