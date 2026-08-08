// ================================================================
// IngredientesTable — Tabla de alertas con TanStack Table v9 + shadcn
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
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Input } from "@/components/ui";
import type { Alerta } from "@/lib/tipos";

const columnHelper = createColumnHelper<Alerta>();

export function IngredientesTable({ alertas }: { alertas: Alerta[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

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
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-3">
      <Input
        placeholder="Filtrar por ingrediente o proveedor..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />
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
          {table.getRowModel().rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted py-8">
                Sin resultados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
