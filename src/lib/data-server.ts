// ================================================================
// data-server.ts — Capa de fetch server-side
// Solo obtiene datos de Supabase y delega a data.ts la lógica
// ================================================================

import { createClient } from "@/utils/supabase/server";
import { generarAlertas as generar, detectarAnomalias, type MetodoProyeccion, type Alerta, type DatosEntrada } from "./data";

export type { Alerta, MetodoProyeccion };
export { detectarAnomalias };

/**
 * Obtiene todos los datos desde Supabase (server-side)
 * y genera las alertas usando la lógica pura de data.ts.
 */
export async function generarAlertas(metodo: MetodoProyeccion = "mediana"): Promise<Alerta[]> {
  const supabase = await createClient();

  const fetchTable = async (table: string) => {
    const { data, error } = await supabase.from(table).select("*");
    if (error) throw error;
    return data;
  };

  const [ingredientes, historico, inventario, ordenes] = await Promise.all([
    fetchTable("ingredientes"),
    fetchTable("consumo_historico"),
    fetchTable("inventario"),
    fetchTable("ordenes"),
  ]);

  return generar(
    { ingredientes, historico, inventario, ordenes } as DatosEntrada,
    metodo
  );
}
