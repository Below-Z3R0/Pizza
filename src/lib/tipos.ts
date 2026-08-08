// ================================================================
// tipos.ts — Tipos compartidos del dominio
// ================================================================

export interface Ingrediente {
  id: string;
  nombre: string;
  proveedor: string;
  unidad_base: string;
  formato_compra: string;
  unidad_base_por_formato: number;
  es_perecedero: boolean;
}

export interface ConsumoHistorico {
  sucursal: string;
  ingrediente_id: string;
  semana: string;
  consumo_unidad_base: number;
}

export interface InventarioActual {
  sucursal: string;
  ingrediente_id: string;
  stock_actual_unidad_base: number;
}

export interface OrdenCompra {
  sucursal: string;
  ingrediente_id: string;
  cantidad_formatos: number;
}

export type TipoAlerta = "quiebre" | "sobrecompra" | "ok" | "sin_datos";

export interface Alerta {
  sucursal: string;
  ingrediente_id: string;
  nombre: string;
  proveedor: string;
  formato: string;
  unidad_base_por_formato: number;
  unidad_base: string;
  consumo_proyectado: number;
  stock_actual: number;
  necesidad_real: number;
  formatos_necesarios: number;
  formatos_pedidos: number;
  diferencia_formatos: number;
  tipo: TipoAlerta;
  mensaje: string;
}
