// ================================================================
// anomalias.ts — Detección de órdenes atípicas entre sucursales
// ================================================================

import { mediana } from "./proyeccion";
import type { Alerta } from "./tipos";

/**
 * Detecta sucursales que piden significativamente más que el resto
 * para el mismo ingrediente (comparación inter-sucursal).
 */
export function detectarAnomalias(
  alertas: Alerta[],
  factorAnomalia: number = 2
): Alerta[] {
  const anomalas: Alerta[] = [];
  const porIngrediente = new Map<string, Alerta[]>();

  for (const a of alertas) {
    if (!porIngrediente.has(a.ingrediente_id)) {
      porIngrediente.set(a.ingrediente_id, []);
    }
    porIngrediente.get(a.ingrediente_id)!.push(a);
  }

  for (const [, grupo] of porIngrediente) {
    if (grupo.length < 2) continue;
    const cantidades = grupo.map((a) => a.formatos_pedidos);
    const med = mediana(cantidades);
    if (med === 0) continue;

    for (const a of grupo) {
      if (a.formatos_pedidos > med * factorAnomalia) {
        anomalas.push({
          ...a,
          tipo: "sin_datos", // reutilizamos el tipo para marcarlo
          mensaje: `⚠️ ANOMALÍA: ${a.sucursal} pide ${a.formatos_pedidos} ${a.formato} de ${a.nombre}, mientras que la mediana del resto de sucursales es ${med}. Posible error o caso atípico.`,
        });
      }
    }
  }

  return anomalas;
}
