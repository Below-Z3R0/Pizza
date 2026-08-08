// ================================================================
// ArchivosProblematicosModal — Modal para ingredientes sin datos
// ================================================================
"use client";

import { Download, Trash2, X } from "lucide-react";
import { Dialog } from "@/components/ui";
import { Badge } from "@/components/ui";
import type { Alerta } from "@/lib/tipos";

interface ArchivosProblematicosModalProps {
  open: boolean;
  onClose: () => void;
  sinDatos: Alerta[];
  onEliminarArchivos: () => void;
}

export function ArchivosProblematicosModal({ open, onClose, sinDatos, onEliminarArchivos }: ArchivosProblematicosModalProps) {
  const csvContent = [
    "sucursal,ingrediente_id,cantidad_formatos",
    ...sinDatos.map((a) => `${a.sucursal},${a.ingrediente_id},${a.formatos_pedidos}`),
  ].join("\n");

  const descargarCSV = () => {
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ingredientes_sin_datos.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-1 text-muted hover:text-main transition-colors"
          aria-label="Cerrar"
        >
          <X className="size-5" />
        </button>

        <h2 className="text-xl font-bold text-main mb-2">Archivos con problemas</h2>
        <p className="text-sm text-body mb-4">
          {sinDatos.length} ingrediente{sinDatos.length !== 1 ? "s" : ""} en las órdenes que no existen en el catálogo.
          Descargá esta lista, completá los datos faltantes, y volvé a subir el archivo corregido.
        </p>

        {sinDatos.length > 0 ? (
          <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
            {sinDatos.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-md border border-border-subtle bg-surface/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{a.ingrediente_id}</Badge>
                  <span className="text-sm text-body">{a.sucursal}</span>
                  <span className="text-xs text-muted">×{a.formatos_pedidos}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted mb-6">No hay ingredientes problemáticos. ¡Todo en orden!</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={descargarCSV}
            disabled={sinDatos.length === 0}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-alt disabled:opacity-50 disabled:cursor-not-allowed text-page text-sm font-medium rounded-md transition-all shadow-sm"
          >
            <Download className="size-4" />
            Descargar lista
          </button>
          <button
            onClick={() => {
              onEliminarArchivos();
              onClose();
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/50 text-sm font-medium rounded-md transition-all"
          >
            <Trash2 className="size-4" />
            Eliminar
          </button>
        </div>
      </div>
    </Dialog>
  );
}
