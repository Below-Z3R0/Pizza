-- ================================================================
-- pizza.sql — Schema pizza para Barrio Pizza Dashboard
-- Proyecto: NINCy (hlsjbvwnqcwrzfuyocja)
-- Sin RLS para prototipo rápido
-- ================================================================

-- 1. Crear schema
CREATE SCHEMA IF NOT EXISTS pizza;

-- 2. Tabla: ingredientes (catálogo)
CREATE TABLE IF NOT EXISTS pizza.ingredientes (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  proveedor TEXT NOT NULL,
  unidad_base TEXT NOT NULL,
  formato_compra TEXT NOT NULL,
  unidad_base_por_formato NUMERIC NOT NULL,
  es_perecedero BOOLEAN NOT NULL DEFAULT false
);

-- 3. Tabla: sucursales
CREATE TABLE IF NOT EXISTS pizza.sucursales (
  id SERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL
);

INSERT INTO pizza.sucursales (nombre) VALUES
  ('Brisas del Golf'),
  ('Costa del Este'),
  ('Marbella'),
  ('Via Argentina')
ON CONFLICT (nombre) DO NOTHING;

-- 4. Tabla: inventario_actual
CREATE TABLE IF NOT EXISTS pizza.inventario (
  id SERIAL PRIMARY KEY,
  sucursal TEXT NOT NULL,
  ingrediente_id TEXT NOT NULL REFERENCES pizza.ingredientes(id),
  stock_actual_unidad_base NUMERIC NOT NULL DEFAULT 0,
  UNIQUE(sucursal, ingrediente_id)
);

-- 5. Tabla: consumo_historico
CREATE TABLE IF NOT EXISTS pizza.consumo_historico (
  id SERIAL PRIMARY KEY,
  sucursal TEXT NOT NULL,
  ingrediente_id TEXT NOT NULL REFERENCES pizza.ingredientes(id),
  semana TEXT NOT NULL,
  consumo_unidad_base NUMERIC NOT NULL,
  UNIQUE(sucursal, ingrediente_id, semana)
);

-- 6. Tabla: ordenes (orden de compra de la semana)
CREATE TABLE IF NOT EXISTS pizza.ordenes (
  id SERIAL PRIMARY KEY,
  sucursal TEXT NOT NULL,
  ingrediente_id TEXT NOT NULL,
  cantidad_formatos INTEGER NOT NULL DEFAULT 0,
  UNIQUE(sucursal, ingrediente_id)
);

-- 7. Función RPC: calcular_alertas (devuelve JSON con el análisis completo)
CREATE OR REPLACE FUNCTION pizza.calcular_alertas()
RETURNS JSONB AS $$
DECLARE
  resultado JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'sucursal', o.sucursal,
      'ingrediente_id', o.ingrediente_id,
      'nombre', i.nombre,
      'proveedor', i.proveedor,
      'formato', i.formato_compra,
      'unidad_base_por_formato', i.unidad_base_por_formato,
      'unidad_base', i.unidad_base,
      'consumo_proyectado', COALESCE(sub.proyectado, 0),
      'stock_actual', COALESCE(inv.stock_actual_unidad_base, 0),
      'orden_cantidad', o.cantidad_formatos
    )
  )
  FROM pizza.ordenes o
  JOIN pizza.ingredientes i ON i.id = o.ingrediente_id
  LEFT JOIN pizza.inventario inv ON inv.sucursal = o.sucursal AND inv.ingrediente_id = o.ingrediente_id
  LEFT JOIN LATERAL (
    SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY ch.consumo_unidad_base) AS proyectado
    FROM pizza.consumo_historico ch
    WHERE ch.sucursal = o.sucursal AND ch.ingrediente_id = o.ingrediente_id
  ) sub ON true
  INTO resultado;

  RETURN COALESCE(resultado, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql STABLE;

-- 8. Permisos (sin RLS para prototipo)
GRANT USAGE ON SCHEMA pizza TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA pizza TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA pizza TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA pizza TO anon, authenticated, service_role;
