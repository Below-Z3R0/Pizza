// ================================================================
// inventario.data.service.ts — Stock actual por sucursal/ingrediente
// ================================================================
import { supabase } from "@/lib/supabase";
import type { InventarioActual } from "@/lib/tipos";

export const getInventario = async (): Promise<InventarioActual[]> => {
  const { data, error } = await supabase.from("inventario").select("*");

  if (error) {
    console.error("[inventario.data.service] Error al obtener inventario:", {
      code: error.code,
      message: error.message,
    });
    throw new Error(`No se pudo cargar el inventario: ${error.message}`);
  }

  return data as InventarioActual[];
};
