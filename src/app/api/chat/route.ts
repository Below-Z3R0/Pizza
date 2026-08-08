// ================================================================
// app/api/chat/route.ts — API Route para el chat con IA
// POST { pregunta: string, datos: AlertaResumen[] }
// ================================================================
import { NextResponse } from "next/server";

const AI_URL = "https://api.minimax.chat/v1/chat/completions";

interface AlertaResumen {
  sucursal: string;
  nombre: string;
  tipo: string;
  mensaje: string;
  proyectado: number;
  stock: number;
  necesita: number;
  pide: number;
}

export async function POST(request: Request) {
  const { pregunta, datos } = (await request.json()) as {
    pregunta: string;
    datos: AlertaResumen[];
  };

  if (!pregunta?.trim()) {
    return NextResponse.json({ error: "La pregunta no puede estar vacía" }, { status: 400 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key no configurada en el servidor" }, { status: 500 });
  }

  const contexto = datos
    .map((d) =>
      `${d.sucursal} | ${d.nombre} | ${d.tipo} | Proy:${d.proyectado} | Stock:${d.stock} | Necesita:${d.necesita} | Pide:${d.pide}`
    )
    .join("\n");

  const systemPrompt = `Sos un asistente de compras para Barrio Pizza, una cadena de pizzerías en Panamá.
Respondé preguntas sobre las órdenes de compra usando SOLO los datos que te doy.
Si te preguntan algo que no está en los datos, decilo claramente.
Respondé en español, en 2-4 oraciones, directo al punto.

DATOS DE ÓRDENES (sucursal | ingrediente | estado | proyectado | stock | necesita | pide):
${contexto}`;

  try {
    const res = await fetch(AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "abab6.5s-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: pregunta },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Error del modelo: ${err}` }, { status: 500 });
    }

    const json = await res.json();
    return NextResponse.json({
      respuesta: json.choices?.[0]?.message?.content ?? "No pude generar una respuesta.",
    });
  } catch (e) {
    return NextResponse.json(
      return NextResponse.json({ error: `Error al conectar con MiniMax: ${e instanceof Error ? e.message : "Desconocido"}` },
      { status: 500 }
    );
  }
}
