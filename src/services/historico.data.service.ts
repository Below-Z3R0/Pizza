// ================================================================
// historico.data.service.ts — Consumo histórico
// ================================================================
import { supabase } from "@/lib/supabase";
import type { ConsumoHistorico } from "@/lib/tipos";

export const getHistorico = async (): Promise<ConsumoHistorico[]> => {
  const { data, error } = await supabase.from("consumo_historico").select("*");

  if (error) {
    console.error("[historico.data.service] Error al obtener histórico:", {
      code: error.code,
      message: error.message,
    });
    throw new Error(`No se pudo cargar el histórico de consumo: ${error.message}`);
  }

  return data as ConsumoHistorico[];
};
