// ================================================================
// tendencias.service.ts — Datos de consumo semanal para gráficos
// ================================================================
import { supabase } from "@/lib/supabase";

export interface TendenciaSucursal {
  sucursal: string;
  semanas: { semana: string; ingredientes: { id: string; nombre: string; consumo: number }[] }[];
}

export async function getTendencias(): Promise<TendenciaSucursal[]> {
  const [{ data: historico, error: errHist }, { data: ingredientes, error: errIng }] = await Promise.all([
    supabase.from("consumo_historico").select("sucursal, ingrediente_id, semana, consumo_unidad_base").order("semana"),
    supabase.from("ingredientes").select("id, nombre"),
  ]);

  if (errHist) throw new Error(`Error en histórico: ${errHist.message}`);
  if (errIng) throw new Error(`Error en ingredientes: ${errIng.message}`);

  const nombrePorId = new Map((ingredientes ?? []).map((i: any) => [i.id, i.nombre]));

  const mapa = new Map<string, Map<string, Map<string, number>>>();
  for (const h of historico ?? []) {
    if (!mapa.has(h.sucursal)) mapa.set(h.sucursal, new Map());
    const suc = mapa.get(h.sucursal)!;
    if (!suc.has(h.semana)) suc.set(h.semana, new Map());
    suc.get(h.semana)!.set(h.ingrediente_id, h.consumo_unidad_base);
  }

  return [...mapa].map(([sucursal, semanas]) => ({
    sucursal,
    semanas: [...semanas]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([semana, ings]) => ({
        semana,
        ingredientes: [...ings].map(([id, consumo]) => ({
          id, nombre: nombrePorId.get(id) ?? id, consumo,
        })),
      })),
  }));
}

/** Formatea tendencias para Recharts LineChart */
export function formatearParaGrafico(
  tendencias: TendenciaSucursal[],
  sucursal: string,
  ingredientesIds: string[]
): Record<string, string | number>[] {
  const suc = tendencias.find((t) => t.sucursal === sucursal);
  if (!suc) return [];

  return suc.semanas.map((sem) => {
    const entry: Record<string, string | number> = { semana: sem.semana };
    for (const id of ingredientesIds) {
      entry[id] = sem.ingredientes.find((i) => i.id === id)?.consumo ?? 0;
    }
    return entry;
  });
}
