// ================================================================
// orquestador.service.ts — Compone todos los servicios de datos
// ================================================================
import { getIngredientes } from "./ingredientes.data.service";
import { getHistorico } from "./historico.data.service";
import { getInventario } from "./inventario.data.service";
import { getOrdenes } from "./ordenes.data.service";

export interface DatosCompletos {
  ingredientes: Awaited<ReturnType<typeof getIngredientes>>;
  historico: Awaited<ReturnType<typeof getHistorico>>;
  inventario: Awaited<ReturnType<typeof getInventario>>;
  ordenes: Awaited<ReturnType<typeof getOrdenes>>;
}

/**
 * Obtiene todos los datos necesarios para generar las alertas.
 * Las 4 queries se ejecutan en paralelo.
 * Si alguna falla, el error se propaga con contexto.
 */
export const getDatosCompletos = async (): Promise<DatosCompletos> => {
  try {
    const [ingredientes, historico, inventario, ordenes] = await Promise.all([
      getIngredientes(),
      getHistorico(),
      getInventario(),
      getOrdenes(),
    ]);

    return { ingredientes, historico, inventario, ordenes };
  } catch (e) {
    console.error("[orquestador.service] Error al obtener datos completos:", e);
    throw new Error(
      `Error al cargar los datos del dashboard: ${e instanceof Error ? e.message : "Error desconocido"}`
    );
  }
};
