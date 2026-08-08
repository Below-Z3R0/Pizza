// ================================================================
// ChatBox — Botón flotante + panel de chat con IA
// ================================================================
"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import type { Alerta } from "@/lib/tipos";

interface ChatBoxProps {
  alertas: Alerta[];
}

export function ChatBox({ alertas }: ChatBoxProps) {
  const [open, setOpen] = useState(false);
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const preguntar = async () => {
    if (!pregunta.trim()) return;
    setLoading(true);
    setError("");
    setRespuesta("");

    const datos = alertas.map((a) => ({
      sucursal: a.sucursal,
      nombre: a.nombre,
      tipo: a.tipo,
      mensaje: a.mensaje,
      proyectado: parseFloat(a.consumo_proyectado.toFixed(1)),
      stock: parseFloat(a.stock_actual.toFixed(1)),
      necesita: a.formatos_necesarios,
      pide: a.formatos_pedidos,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta, datos }),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setRespuesta(json.respuesta);
      }
    } catch {
      setError("No se pudo conectar con el asistente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-accent hover:bg-accent-alt text-white rounded-full shadow-lg transition-all"
        aria-label="Chat"
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </button>

      {/* Panel de chat */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 max-h-96 bg-card border border-border-mid rounded-xl shadow-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border-subtle bg-accent text-white text-sm font-semibold">
            Asistente de Compras
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {respuesta && (
              <div className="bg-accent-soft text-main p-2 rounded-lg">{respuesta}</div>
            )}
            {error && (
              <div className="bg-red-50 text-red-600 p-2 rounded-lg text-xs">{error}</div>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-muted text-xs">
                <Loader2 className="size-3 animate-spin" /> Pensando...
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); preguntar(); }}
            className="p-2 border-t border-border-subtle flex gap-2"
          >
            <input
              ref={inputRef}
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              placeholder="Ej: ¿qué sucursal pide demasiado queso?"
              className="flex-1 text-xs px-2 py-1.5 rounded-md border border-border-mid bg-transparent outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={loading || !pregunta.trim()}
              className="p-1.5 rounded-md bg-accent text-white disabled:opacity-50"
            >
              <Send className="size-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
