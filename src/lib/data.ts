// ================================================================
// data.ts — Lógica pura: proyección + alertas (sin dependencias de BD)
// ================================================================

import { proyectarConsumo, type MetodoProyeccion } from "./proyeccion";
import { calcularNecesidad } from "./necesidad";
import { detectarAnomalias } from "./anomalias";
import { getDatosCompletos } from "@/services/orquestador.service";
import type { Alerta } from "./tipos";

export type { Alerta, MetodoProyeccion };
export { detectarAnomalias };

// ================================================================
// GENERACIÓN DE ALERTAS
// ================================================================

export async function generarAlertas(metodo: MetodoProyeccion = "mediana"): Promise<Alerta[]> {
  const { ingredientes, historico, inventario, ordenes } = await getDatosCompletos();

  const mapaCat = new Map(ingredientes.map((i) => [i.id, i]));
  const sucursales = [...new Set(historico.map((h) => h.sucursal))];
  const alertas: Alerta[] = [];

  for (const suc of sucursales) {
    for (const [ingId, ing] of mapaCat) {
      const histSuc = historico
        .filter((h) => h.sucursal === suc && h.ingrediente_id === ingId)
        .map((h) => h.consumo_unidad_base);
      const invSuc = inventario.find((i) => i.sucursal === suc && i.ingrediente_id === ingId)?.stock_actual_unidad_base ?? 0;
      const ordenItem = ordenes.find((o) => o.sucursal === suc && o.ingrediente_id === ingId);
      if (histSuc.length === 0 && !ordenItem) continue;

      if (ordenItem && histSuc.length === 0) {
        alertas.push({
          sucursal: suc, ingrediente_id: ingId, nombre: ingId, proveedor: "Desconocido",
          formato: "?", unidad_base_por_formato: 1, unidad_base: "?",
          consumo_proyectado: 0, stock_actual: 0, necesidad_real: 0,
          formatos_necesarios: 0, formatos_pedidos: ordenItem.cantidad_formatos,
          diferencia_formatos: ordenItem.cantidad_formatos, tipo: "sin_datos",
          mensaje: `⚠️ "${ingId}" en orden de ${suc} no existe en catálogo.`,
        });
        continue;
      }

      const proyectado = proyectarConsumo(histSuc, metodo);
      const { formatos_necesarios, necesidad_unidades } = calcularNecesidad(proyectado, invSuc, ing.unidad_base_por_formato);
      const formatosPedidos = ordenItem?.cantidad_formatos ?? 0;
      const diff = formatosPedidos - formatos_necesarios;
      let tipo: Alerta["tipo"] = "ok";
      let mensaje = "";

      if (!ordenItem) {
        tipo = "quiebre";
        mensaje = `🔴 ALERTA: ${suc} NO pidió ${ing.nombre}. Necesita ${formatos_necesarios} ${ing.formato_compra} (${necesidad_unidades.toFixed(1)} ${ing.unidad_base}). ¡Riesgo de quiebre!`;
      } else if (diff < 0) {
        tipo = "quiebre";
        mensaje = `🔴 ALERTA: ${suc} pide ${Math.abs(diff)} ${ing.formato_compra} MENOS de ${ing.nombre}. Necesita ${formatos_necesarios}, pide ${formatosPedidos}. Riesgo de quiebre.`;
      } else if (diff > 0) {
        tipo = "sobrecompra";
        mensaje = `🟡 SOBRECOMPRA: ${suc} pide ${diff} ${ing.formato_compra} MÁS de ${ing.nombre}. Necesita ${formatos_necesarios}, pide ${formatosPedidos}.${ing.es_perecedero ? " ⚠️ Perecedero." : ""}`;
      } else {
        mensaje = `✅ ${ing.nombre}: pedido correcto (${formatosPedidos} ${ing.formato_compra}).`;
      }

      alertas.push({
        sucursal: suc, ingrediente_id: ingId, nombre: ing.nombre, proveedor: ing.proveedor,
        formato: ing.formato_compra, unidad_base_por_formato: ing.unidad_base_por_formato,
        unidad_base: ing.unidad_base, consumo_proyectado: proyectado, stock_actual: invSuc,
        necesidad_real: necesidad_unidades, formatos_necesarios, formatos_pedidos: formatosPedidos,
        diferencia_formatos: diff, tipo, mensaje,
      });
    }
  }

  for (const o of ordenes) {
    if (!mapaCat.has(o.ingrediente_id)) {
      alertas.push({
        sucursal: o.sucursal, ingrediente_id: o.ingrediente_id, nombre: o.ingrediente_id,
        proveedor: "Desconocido", formato: "?", unidad_base_por_formato: 1, unidad_base: "?",
        consumo_proyectado: 0, stock_actual: 0, necesidad_real: 0, formatos_necesarios: 0,
        formatos_pedidos: o.cantidad_formatos, diferencia_formatos: o.cantidad_formatos,
        tipo: "sin_datos", mensaje: `⚠️ "${o.ingrediente_id}" no existe en catálogo.`,
      });
    }
  }

  return alertas;
}

export function agruparPorProveedor(alertas: Alerta[]): Record<string, Alerta[]> {
  const g: Record<string, Alerta[]> = {};
  for (const a of alertas) {
    if (!g[a.proveedor]) g[a.proveedor] = [];
    g[a.proveedor].push(a);
  }
  return g;
}
