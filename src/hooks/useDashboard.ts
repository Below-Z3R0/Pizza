// ================================================================
// useDashboard — Hook central
// ================================================================
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { generarAlertas, detectarAnomalias, agruparPorProveedor, type Alerta, type MetodoProyeccion } from "@/lib/data";
import { eliminarOrdenesPorIngrediente, guardarOrdenes } from "@/services/ordenes.data.service";
import { procesarCSV } from "@/services/upload.service";
import type { TipoAlerta } from "@/lib/tipos";

const SUCURSALES = ["Brisas del Golf", "Costa del Este", "Marbella", "Via Argentina"];

export function useDashboard() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [anomalas, setAnomalas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sucursalActiva, setSucursalActiva] = useState<string>("Todas");
  const [metodo, setMetodo] = useState<MetodoProyeccion>("mediana");
  const [filtroTipo, setFiltroTipo] = useState<TipoAlerta | null>(null);

  const cargarDatos = useCallback(async (metodoActual?: MetodoProyeccion) => {
    setLoading(true);
    setError(null);
    try {
      const res = await generarAlertas(metodoActual ?? metodo);
      setAlertas(res);
      setAnomalas(detectarAnomalias(res));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, [metodo]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const cambiarMetodo = (m: MetodoProyeccion) => { setMetodo(m); cargarDatos(m); };

  const procesarUpload = async (file: File): Promise<string> => {
    const { rows, warnings } = await procesarCSV(file);
    await cargarDatos();
    const extra = warnings > 0 ? ` (${warnings} advertencias)` : "";
    return `${rows} órdenes cargadas${extra}`;
  };

  const eliminarSinDatos = async () => {
    const ids = alertas.filter((a) => a.tipo === "sin_datos").map((a) => a.ingrediente_id);
    if (ids.length > 0) {
      await eliminarOrdenesPorIngrediente(ids);
      await cargarDatos();
    }
  };

  const filtradas = useMemo(() => {
    let result = alertas;
    if (sucursalActiva !== "Todas") result = result.filter((a) => a.sucursal === sucursalActiva);
    if (filtroTipo) result = result.filter((a) => a.tipo === filtroTipo);
    return result;
  }, [alertas, sucursalActiva, filtroTipo]);

  const stats = useMemo(() => ({
    quiebres: alertas.filter((a) => a.tipo === "quiebre").length,
    sobrecompras: alertas.filter((a) => a.tipo === "sobrecompra").length,
    ok: alertas.filter((a) => a.tipo === "ok").length,
    sinDatos: alertas.filter((a) => a.tipo === "sin_datos").length,
    total: alertas.length,
  }), [alertas]);

  const criticas = useMemo(() => {
    if (filtroTipo) return filtradas;
    return filtradas.filter((a) => a.tipo === "quiebre" || a.tipo === "sobrecompra");
  }, [filtradas, filtroTipo]);

  const sinDatosList = useMemo(() => alertas.filter((a) => a.tipo === "sin_datos"), [alertas]);
  const porProveedor = useMemo(() => agruparPorProveedor(alertas), [alertas]);

  return {
    alertas, anomalas, loading, error,
    sucursalActiva, setSucursalActiva,
    metodo, cambiarMetodo,
    filtroTipo, setFiltroTipo,
    filtradas, stats, criticas, sinDatosList, porProveedor,
    eliminarSinDatos, procesarUpload,
    SUCURSALES,
  };
}
