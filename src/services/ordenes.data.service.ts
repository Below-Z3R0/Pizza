// ================================================================
// ordenes.data.service.ts — Órdenes de compra (fetch + upload + delete)
// ================================================================
import { supabase } from "@/lib/supabase";
import type { OrdenCompra } from "@/lib/tipos";

export const getOrdenes = async (): Promise<OrdenCompra[]> => {
  const { data, error } = await supabase.from("ordenes").select("*");

  if (error) {
    console.error("[ordenes.data.service] Error al obtener órdenes:", {
      code: error.code,
      message: error.message,
    });
    throw new Error(`No se pudieron cargar las órdenes: ${error.message}`);
  }

  return data as OrdenCompra[];
};

/**
 * Reemplaza todas las órdenes con las filas parseadas de un CSV.
 * Primero borra las existentes, luego inserta las nuevas.
 * Si alguna operación falla, lanza un error descriptivo.
 */
export const guardarOrdenes = async (
  rows: { sucursal: string; ingrediente_id: string; cantidad_formatos: number }[]
): Promise<number> => {
  if (rows.length === 0) {
    console.warn("[ordenes.data.service] guardarOrdenes llamado con 0 filas.");
    return 0;
  }

  // 1. Borrar órdenes anteriores
  const { error: delErr } = await supabase.from("ordenes").delete().gt("id", 0);
  if (delErr) {
    console.error("[ordenes.data.service] Error al borrar órdenes anteriores:", {
      code: delErr.code,
      message: delErr.message,
    });
    throw new Error(`No se pudieron reemplazar las órdenes: ${delErr.message}`);
  }

  // 2. Insertar nuevas
  const { data, error: insErr } = await supabase.from("ordenes").insert(rows).select("id");
  if (insErr) {
    console.error("[ordenes.data.service] Error al insertar nuevas órdenes:", {
      code: insErr.code,
      message: insErr.message,
      details: insErr.details,
      hint: insErr.hint,
    });
    throw new Error(`No se pudieron guardar las órdenes: ${insErr.message}${insErr.details ? ` (${insErr.details})` : ""}`);
  }

  const count = data?.length ?? rows.length;
  console.log(`[ordenes.data.service] ${count} órdenes guardadas correctamente.`);
  return count;
};

/**
 * Elimina las órdenes de ingredientes desconocidos (sin datos en el catálogo).
 * Usado por el modal "Archivos problemáticos".
 */
export const eliminarOrdenesPorIngrediente = async (ids: string[]): Promise<void> => {
  if (ids.length === 0) return;

  const { error } = await supabase.from("ordenes").delete().in("ingrediente_id", ids);

  if (error) {
    console.error("[ordenes.data.service] Error al eliminar órdenes por ingrediente:", {
      code: error.code,
      message: error.message,
    });
    throw new Error(`No se pudieron eliminar las órdenes problemáticas: ${error.message}`);
  }

  console.log(`[ordenes.data.service] ${ids.length} órdenes problemáticas eliminadas.`);
};
