// ================================================================
// necesidad.ts — Cálculo de necesidad real y conversión a formatos
// ================================================================

export interface NecesidadResult {
  necesidad_unidades: number;
  formatos_necesarios: number;
}

/**
 * Calcula cuánto se necesita pedir de un ingrediente.
 *
 * @param proyectado  - Consumo proyectado en unidad base (kg, L, und)
 * @param inventario  - Stock actual en unidad base
 * @param formato     - Unidad base por formato de compra (ej: 25 kg por saco)
 * @returns Necesidad en unidad base y en formatos (redondeado hacia arriba)
 */
export function calcularNecesidad(
  proyectado: number,
  inventario: number,
  formato: number
): NecesidadResult {
  const necesidad = Math.max(0, proyectado - inventario);
  const formatos = necesidad > 0 ? Math.ceil(necesidad / formato) : 0;
  return { necesidad_unidades: necesidad, formatos_necesarios: formatos };
}
