// ================================================================
// formatear.ts — Helpers de formato de mensajes para alertas
// ================================================================
import type { Alerta } from "./tipos";
import type { Ingrediente } from "./tipos";

export function formatearAlerta(
  suc: string,
  ing: Ingrediente,
  formatosNecesarios: number,
  necesidadUnidades: number,
  formatosPedidos: number,
  ordenItem: { cantidad_formatos: number } | undefined,
  diff: number
): { tipo: Alerta["tipo"]; mensaje: string } {
  if (!ordenItem) {
    return {
      tipo: "quiebre",
      mensaje: `🔴 ALERTA: ${suc} NO pidió ${ing.nombre}. Necesita ${formatosNecesarios} ${ing.formato_compra} (${necesidadUnidades.toFixed(1)} ${ing.unidad_base}). ¡Riesgo de quiebre!`,
    };
  }

  if (diff < 0) {
    return {
      tipo: "quiebre",
      mensaje: `🔴 ALERTA: ${suc} pide ${Math.abs(diff)} ${ing.formato_compra} MENOS de ${ing.nombre}. Necesita ${formatosNecesarios}, pide ${formatosPedidos}. Riesgo de quiebre.`,
    };
  }

  if (diff > 0) {
    const extra = ing.es_perecedero ? " ⚠️ Perecedero." : "";
    return {
      tipo: "sobrecompra",
      mensaje: `🟡 SOBRECOMPRA: ${suc} pide ${diff} ${ing.formato_compra} MÁS de ${ing.nombre}. Necesita ${formatosNecesarios}, pide ${formatosPedidos}.${extra}`,
    };
  }

  return {
    tipo: "ok",
    mensaje: `✅ ${ing.nombre}: pedido correcto (${formatosPedidos} ${ing.formato_compra}).`,
  };
}
