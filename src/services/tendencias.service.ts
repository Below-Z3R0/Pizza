// ================================================================
// tendencias.service.ts — Datos de consumo semanal para gráficos
// ================================================================
import { supabase } from "@/lib/supabase";

export interface TendenciaSucursal {
  sucursal: string;
  semanas: {
    semana: string;
    ingredientes: {
      ingrediente_id: string;
      nombre: string;
      consumo: number;
    }[];
  }[];
}

/**
 * Obtiene el consumo histórico agrupado por sucursal y semana.
 * Útil para gráficos de tendencia y comparativas.
 */
export const getTendencias = async (): Promise<TendenciaSucursal[]> => {
  const { data: historico, error } = await supabase
    .from("consumo_historico")
    .select("sucursal, ingrediente_id, semana, consumo_unidad_base")
    .order("semana");

  if (error) {
    console.error("[tendencias.service] Error:", error);
    throw new Error(`No se pudieron cargar las tendencias: ${error.message}`);
  }

  const { data: ingredientes } = await supabase
    .from("ingredientes")
    .select("id, nombre");

  const nombrePorId = new Map((ingredientes ?? []).map((i: any) => [i.id, i.nombre]));

  const mapa = new Map<string, Map<string, Map<string, number>>>();

  for (const h of historico ?? []) {
    if (!mapa.has(h.sucursal)) mapa.set(h.sucursal, new Map());
    const suc = mapa.get(h.sucursal)!;
    if (!suc.has(h.semana)) suc.set(h.semana, new Map());
    suc.get(h.semana)!.set(h.ingrediente_id, h.consumo_unidad_base);
  }

  const tendencias: TendenciaSucursal[] = [];
  for (const [sucursal, semanas] of mapa) {
    const semanasArr = [];
    for (const [semana, ings] of [...semanas].sort((a, b) => a[0].localeCompare(b[0]))) {
      semanasArr.push({
        semana,
        ingredientes: [...ings].map(([id, consumo]) => ({
          ingrediente_id: id,
          nombre: nombrePorId.get(id) ?? id,
          consumo,
        })),
      });
    }
    tendencias.push({ sucursal, semanas: semanasArr });
  }

  return tendencias;
};

/**
 * Formatea las tendencias para un gráfico de líneas de Recharts.
 * Devuelve datos por sucursal → una línea por ingrediente → puntos por semana.
 */
export const formatearParaGrafico = (
  tendencias: TendenciaSucursal[],
  sucursal: string,
  ingredientesSeleccionados: string[]
) => {
  const suc = tendencias.find((t) => t.sucursal === sucursal);
  if (!suc) return [];

  const semanas = suc.semanas.map((s) => s.semana);

  return semanas.map((semana) => {
    const entry: Record<string, string | number> = { semana };
    const semanaData = suc.semanas.find((s) => s.semana === semana);
    for (const ing of ingredientesSeleccionados) {
      const d = semanaData?.ingredientes.find((i) => i.ingrediente_id === ing);
      entry[ing] = d?.consumo ?? 0;
    }
    return entry;
  });
};
