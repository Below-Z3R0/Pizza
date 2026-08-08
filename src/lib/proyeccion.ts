// ================================================================
// proyeccion.ts — Métodos de proyección de consumo
// ================================================================

/** Mediana: ignora outliers, robusta para datos con picos */
export function mediana(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Media móvil: últimas N semanas, captura tendencias recientes */
export function mediaMovil(nums: number[], ventana: number = 3): number {
  if (nums.length === 0) return 0;
  const recientes = nums.slice(-ventana);
  return recientes.reduce((a, b) => a + b, 0) / recientes.length;
}

/** Media ponderada: más peso a semanas recientes */
export function mediaPonderada(nums: number[]): number {
  if (nums.length === 0) return 0;
  const pesos = [0.05, 0.08, 0.12, 0.15, 0.25, 0.35].slice(-nums.length);
  let suma = 0;
  let pesoTotal = 0;
  nums.forEach((n, i) => {
    suma += n * pesos[i];
    pesoTotal += pesos[i];
  });
  return pesoTotal > 0 ? suma / pesoTotal : 0;
}

export type MetodoProyeccion = "mediana" | "media_movil" | "media_ponderada";

export function proyectarConsumo(historico: number[], metodo: MetodoProyeccion = "mediana"): number {
  switch (metodo) {
    case "media_movil": return mediaMovil(historico);
    case "media_ponderada": return mediaPonderada(historico);
    default: return mediana(historico);
  }
}
