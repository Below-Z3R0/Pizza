// ================================================================
// ingredientes.data.service.ts — Catálogo de ingredientes
// ================================================================
import { supabase } from "@/lib/supabase";
import type { Ingrediente } from "@/lib/tipos";

/**
 * Obtiene el catálogo completo de ingredientes desde Supabase.
 *
 * @throws {Error} Si la query falla, con el mensaje original de Supabase.
 */
export const getIngredientes = async (): Promise<Ingrediente[]> => {
  const { data, error } = await supabase.from("ingredientes").select("*");

  if (error) {
    console.error("[ingredientes.data.service] Error al obtener ingredientes:", {
      code: error.code,
      message: error.message,
      details: error.details,
    });
    throw new Error(`No se pudieron cargar los ingredientes: ${error.message}`);
  }

  if (!data || data.length === 0) {
    console.warn("[ingredientes.data.service] No hay ingredientes en la base de datos.");
    return [];
  }

  return data as Ingrediente[];
};
