// ================================================================
// IngredientesTable — Tabla de alertas con TanStack Table v8
// Cuando hay múltiples sucursales, muestra una tabla por sucursal
// ================================================================
"use client";

import { useMemo, useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  flexRender,
} from "@tanstack/react-table";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui-components";
import { Badge } from "@/components/ui-components";
import { Input } from "@/components/ui-components";
import type { Alerta } from "@/lib/tipos";

const columnHelper = createColumnHelper<Alerta>();

function TablaSucursal({ alertas, sucursal }: { alertas: Alerta[]; sucursal: string }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(() => [
    columnHelper.accessor("nombre", { header: "Ingrediente" }),
    columnHelper.accessor("proveedor", { header: "Proveedor" }),
    columnHelper.accessor("consumo_proyectado", {
      header: "Proyectado",
      cell: (info) => info.getValue().toFixed(1),
    }),
    columnHelper.accessor("stock_actual", {
      header: "Stock",
      cell: (info) => info.getValue().toFixed(1),
    }),
    columnHelper.accessor("formatos_necesarios", { header: "Necesita" }),
    columnHelper.accessor("formatos_pedidos", { header: "Pide" }),
    columnHelper.accessor("diferencia_formatos", {
      header: "Dif",
      cell: (info) => {
        const v = info.getValue();
        return <span className={v < 0 ? "text-red-500 font-semibold" : v > 0 ? "text-amber-500 font-semibold" : "text-emerald-500"}>{v > 0 ? `+${v}` : v}</span>;
      },
    }),
    columnHelper.accessor("tipo", {
      header: "Estado",
      cell: (info) => {
        const t = info.getValue();
        const map: Record<string, { label: string; variant: "danger" | "warning" | "success" | "outline" }> = {
          quiebre: { label: "Quiebre", variant: "danger" },
          sobrecompra: { label: "Exceso", variant: "warning" },
          ok: { label: "OK", variant: "success" },
          sin_datos: { label: "?¿", variant: "outline" },
        };
        const m = map[t] ?? { label: t, variant: "outline" as const };
        return <Badge variant={m.variant}>{m.label}</Badge>;
      },
    }),
  ], []);

  const table = useReactTable({
    data: alertas,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (alertas.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-main mb-2 px-1">{sucursal} ({alertas.length})</h3>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id} onClick={h.column.getToggleSortingHandler()} className="cursor-pointer select-none">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {{ asc: " ↑", desc: " ↓" }[h.column.getIsSorted() as string] ?? ""}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function IngredientesTable({ alertas }: { alertas: Alerta[] }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const sucursales = [...new Set(alertas.map((a) => a.sucursal))];

  const filtrar = (lista: Alerta[]) => {
    if (!globalFilter) return lista;
    const q = globalFilter.toLowerCase();
    return lista.filter((a) =>
      a.nombre.toLowerCase().includes(q) || a.proveedor.toLowerCase().includes(q)
    );
  };

  if (sucursales.length <= 1) {
    const data = filtrar(alertas);
    return (
      <div className="space-y-3">
        <Input placeholder="Filtrar..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm" />
        <TablaSucursal alertas={data} sucursal={sucursales[0] ?? ""} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Input placeholder="Filtrar..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm" />
      <div className="space-y-6">
        {sucursales.map((suc) => {
          const data = filtrar(alertas.filter((a) => a.sucursal === suc));
          return <TablaSucursal key={suc} alertas={data} sucursal={suc} />;
        })}
      </div>
    </div>
  );
}
