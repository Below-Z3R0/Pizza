// ================================================================
// upload.service.ts — Parseo de CSV y guardado de órdenes
// ================================================================
import Papa from "papaparse";
import { guardarOrdenes } from "@/services/ordenes.data.service";

export interface UploadResult {
  rows: number;
  warnings: number;
}

/**
 * Parsea un archivo CSV de órdenes y las guarda en Supabase.
 * Retorna la cantidad de filas procesadas.
 */
export const procesarCSV = (file: File): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data
            .filter((r: any) => r.sucursal && r.ingrediente_id && r.cantidad_formatos)
            .map((r: any) => ({
              sucursal: r.sucursal,
              ingrediente_id: r.ingrediente_id,
              cantidad_formatos: parseInt(r.cantidad_formatos, 10),
            }));

          if (rows.length === 0) {
            reject(new Error("El archivo no contiene filas válidas. Revisá que tenga las columnas: sucursal, ingrediente_id, cantidad_formatos."));
            return;
          }

          await guardarOrdenes(rows);
          resolve({ rows: rows.length, warnings: results.errors.length });
        } catch (e: any) {
          reject(new Error(e?.message || "Error al guardar las órdenes"));
        }
      },
      error: (err: any) => reject(new Error(`Error al leer el archivo: ${err.message}`)),
    });
  });
};
