// ================================================================
// data.ts — Lógica pura de generación de alertas
// No tiene dependencias de BD. Recibe datos pre-fetcheados.
// ================================================================

import { proyectarConsumo, type MetodoProyeccion } from "./proyeccion";
import { calcularNecesidad } from "./necesidad";
import { detectarAnomalias } from "./anomalias";
import type { Alerta, Ingrediente, ConsumoHistorico, InventarioActual, OrdenCompra } from "./tipos";

export type { Alerta, MetodoProyeccion };
export { detectarAnomalias };

// ================================================================
// DATOS DE ENTRADA
// ================================================================

export interface DatosEntrada {
  ingredientes: Ingrediente[];
  historico: ConsumoHistorico[];
  inventario: InventarioActual[];
  ordenes: OrdenCompra[];
}

// ================================================================
// HELPERS DE MENSAJES
// ================================================================

function mensajeQuiebre(suc: string, ing: Ingrediente, necesita: number, unidades: number, pide: number): string {
  if (pide === 0) {
    return `🔴 ALERTA: ${suc} NO pidió ${ing.nombre}. Necesita ${necesita} ${ing.formato_compra} (${unidades.toFixed(1)} ${ing.unidad_base}). ¡Riesgo de quiebre!`;
  }
  return `🔴 ALERTA: ${suc} pide ${Math.abs(pide - necesita)} ${ing.formato_compra} MENOS de ${ing.nombre}. Necesita ${necesita}, pide ${pide}. Riesgo de quiebre.`;
}

function mensajeSobrecompra(suc: string, ing: Ingrediente, necesita: number, pide: number, diff: number): string {
  const extra = ing.es_perecedero ? " ⚠️ Perecedero." : "";
  return `🟡 SOBRECOMPRA: ${suc} pide ${diff} ${ing.formato_compra} MÁS de ${ing.nombre}. Necesita ${necesita}, pide ${pide}.${extra}`;
}

function mensajeOk(ing: Ingrediente, pide: number): string {
  return `✅ ${ing.nombre}: pedido correcto (${pide} ${ing.formato_compra}).`;
}

// ================================================================
// ALERTA DESCONOCIDA (helper)
// ================================================================

function alertaDesconocida(suc: string, ingId: string, cantidad: number): Alerta {
  return {
    sucursal: suc, ingrediente_id: ingId, nombre: ingId,
    proveedor: "Desconocido", formato: "?", unidad_base_por_formato: 1, unidad_base: "?",
    consumo_proyectado: 0, stock_actual: 0, necesidad_real: 0,
    formatos_necesarios: 0, formatos_pedidos: cantidad,
    diferencia_formatos: cantidad, tipo: "sin_datos",
    mensaje: `⚠️ "${ingId}" en orden de ${suc} no existe en catálogo.`,
  };
}

// ================================================================
// GENERACIÓN DE ALERTAS (función pura)
// ================================================================

export function generarAlertas(
  datos: DatosEntrada,
  metodo: MetodoProyeccion = "mediana"
): Alerta[] {
  const { ingredientes, historico, inventario, ordenes } = datos;
  const mapaCat = new Map(ingredientes.map((i) => [i.id, i]));
  const sucursales = [...new Set(historico.map((h) => h.sucursal))];
  const alertas: Alerta[] = [];

  for (const suc of sucursales) {
    for (const [ingId, ing] of mapaCat) {
      const histSuc = historico
        .filter((h) => h.sucursal === suc && h.ingrediente_id === ingId)
        .map((h) => h.consumo_unidad_base);

      const invSuc = inventario.find(
        (i) => i.sucursal === suc && i.ingrediente_id === ingId
      )?.stock_actual_unidad_base ?? 0;

      const ordenItem = ordenes.find(
        (o) => o.sucursal === suc && o.ingrediente_id === ingId
      );

      if (histSuc.length === 0 && !ordenItem) continue;

      // Ingrediente en orden pero sin histórico → desconocido
      if (ordenItem && histSuc.length === 0) {
        alertas.push(alertaDesconocida(suc, ingId, ordenItem.cantidad_formatos));
        continue;
      }

      // Cálculo normal
      const proyectado = proyectarConsumo(histSuc, metodo);
      const { formatos_necesarios, necesidad_unidades } = calcularNecesidad(
        proyectado, invSuc, ing.unidad_base_por_formato
      );
      const pedido = ordenItem?.cantidad_formatos ?? 0;
      const diff = pedido - formatos_necesarios;

      let tipo: Alerta["tipo"];
      let mensaje: string;

      if (!ordenItem) {
        tipo = "quiebre";
        mensaje = mensajeQuiebre(suc, ing, formatos_necesarios, necesidad_unidades, 0);
      } else if (diff < 0) {
        tipo = "quiebre";
        mensaje = mensajeQuiebre(suc, ing, formatos_necesarios, necesidad_unidades, pedido);
      } else if (diff > 0) {
        tipo = "sobrecompra";
        mensaje = mensajeSobrecompra(suc, ing, formatos_necesarios, pedido, diff);
      } else {
        tipo = "ok";
        mensaje = mensajeOk(ing, pedido);
      }

      alertas.push({
        sucursal: suc, ingrediente_id: ingId, nombre: ing.nombre,
        proveedor: ing.proveedor, formato: ing.formato_compra,
        unidad_base_por_formato: ing.unidad_base_por_formato,
        unidad_base: ing.unidad_base, consumo_proyectado: proyectado,
        stock_actual: invSuc, necesidad_real: necesidad_unidades,
        formatos_necesarios, formatos_pedidos: pedido,
        diferencia_formatos: diff, tipo, mensaje,
      });
    }
  }

  // Órdenes con ingredientes no registrados en catálogo
  for (const o of ordenes) {
    if (!mapaCat.has(o.ingrediente_id)) {
      alertas.push(alertaDesconocida(o.sucursal, o.ingrediente_id, o.cantidad_formatos));
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
