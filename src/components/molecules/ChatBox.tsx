// ================================================================
// ChatBox — Chat flotante con burbujas + razonamiento colapsable
// ================================================================
"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles, Brain, ChevronDown, ChevronRight, Pizza } from "lucide-react";
import { Card } from "@/components/ui-components";
import type { Alerta } from "@/lib/tipos";

interface Mensaje {
  rol: "user" | "assistant";
  texto: string;
  razonamiento?: string;
}

interface ChatBoxProps {
  alertas: Alerta[];
}

export function ChatBox({ alertas }: ChatBoxProps) {
  const [open, setOpen] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [razonamientoAbierto, setRazonamientoAbierto] = useState<Record<number, boolean>>({});

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [mensajes]);

  const enviar = async () => {
    const texto = input.trim();
    if (!texto) return;

    setMensajes((prev) => [...prev, { rol: "user", texto }]);
    setInput("");
    setLoading(true);
    setError("");

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
        body: JSON.stringify({ pregunta: texto, datos }),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setMensajes((prev) => [
          ...prev,
          {
            rol: "assistant",
            texto: json.respuesta,
            razonamiento: json.razonamiento || undefined,
          },
        ]);
      }
    } catch {
      setError("No se pudo conectar con el asistente.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRazonamiento = (i: number) => {
    setRazonamientoAbierto((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-accent hover:bg-accent-alt text-white rounded-full shadow-2xl transition-all hover:scale-110 hover:rotate-3"
        aria-label="Chat"
      >
        {open ? <X className="size-5" /> : <Pizza className="size-6" />}
      </button>

      {open && (
        <Card className="fixed bottom-20 right-6 z-50 w-[400px] h-[540px] flex flex-col shadow-2xl overflow-hidden">
          <div className="shrink-0 px-4 py-3 border-b border-border-subtle bg-accent text-white flex items-center gap-2">
            <Sparkles className="size-4" />
            <span className="font-semibold text-sm">Asistente de Compras</span>
            <span className="ml-auto text-[10px] opacity-70">MiniMax</span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {mensajes.length === 0 && !loading && (
              <div className="text-center text-muted text-sm mt-8">
                <MessageCircle className="size-8 mx-auto mb-2 opacity-30" />
                <p>Preguntame sobre las órdenes de compra.</p>
                <p className="text-xs mt-1">Ej: ¿qué sucursal está pidiendo de más?</p>
              </div>
            )}

            {mensajes.map((m, i) => (
              <div key={i} className={`flex ${m.rol === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[90%] space-y-1.5">
                  {/* Razonamiento colapsable (solo assistant) */}
                  {m.razonamiento && (
                    <button
                      onClick={() => toggleRazonamiento(i)}
                      className="flex items-center gap-1.5 text-[11px] text-muted hover:text-accent transition-colors w-full"
                    >
                      {razonamientoAbierto[i] ? (
                        <ChevronDown className="size-3" />
                      ) : (
                        <ChevronRight className="size-3" />
                      )}
                      <Brain className="size-3" />
                      Razonamiento
                    </button>
                  )}
                  {m.razonamiento && razonamientoAbierto[i] && (
                    <div className="bg-surface/50 border border-border-subtle rounded-lg px-3 py-2 text-[11px] text-muted leading-relaxed whitespace-pre-wrap">
                      {m.razonamiento}
                    </div>
                  )}

                  {/* Mensaje principal */}
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.rol === "user"
                        ? "bg-accent text-white rounded-br-md ml-auto"
                        : "bg-surface text-main rounded-bl-md border border-border-subtle"
                    }`}
                  >
                    {m.texto}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface text-main px-3.5 py-2.5 rounded-2xl rounded-bl-md border border-border-subtle flex items-center gap-2">
                  <Loader2 className="size-3.5 animate-spin" />
                  <span className="text-xs text-muted">Analizando datos...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center text-red-500 text-xs bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); enviar(); }}
            className="shrink-0 px-3 py-2.5 border-t border-border-subtle flex gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Preguntá sobre las órdenes..."
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-border-mid bg-transparent placeholder:text-muted outline-none focus:border-accent transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="shrink-0 p-2.5 rounded-xl bg-accent text-white disabled:opacity-40 hover:bg-accent-alt transition-colors"
            >
              <Send className="size-4" />
            </button>
          </form>
        </Card>
      )}
    </>
  );
}
