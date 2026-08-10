# Chatbot con IA (MiniMax)

## Cómo funciona

El chat usa el modelo **MiniMax-M3** a través de su API REST. Cuando el usuario escribe una pregunta, el sistema:

1. Toma los datos actuales del dashboard (alertas, proyecciones, stocks)
2. Los formatea como contexto estructurado
3. Envía pregunta + contexto a `POST https://api.minimax.io/v1/chat/completions`
4. Separa el razonamiento (`{strong}...{/strong}`) de la respuesta final
5. Muestra la respuesta en burbujas de chat con el razonamiento en un acordeón colapsable

### Arquitectura

```
Usuario escribe pregunta
  → ChatBox.tsx (componente flotante)
    → POST /api/chat { pregunta, datos }
      → route.ts: formatea datos + llama a MiniMax
        → MiniMax API (api.minimax.io/v1)
      ← { respuesta, razonamiento }
    ← muestra respuesta en burbuja
```

### Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/app/api/chat/route.ts` | API route que recibe la pregunta, consulta MiniMax, devuelve respuesta |
| `src/components/molecules/ChatBox.tsx` | Componente UI: botón flotante, panel de chat, burbujas, historial |
| `src/app/page.tsx` | Importa y renderiza `<ChatBox alertas={filtradas} />` |

### Variables de entorno necesarias

```bash
# .env.local (desarrollo) o Vercel Environment Variables (producción)
MINIMAX_API_KEY=sk-cp-xxxxxxxxxxxxx
```

La key es la misma que usa Hermes (`MINIMAX_API_KEY` en `~/.hermes/.env`).

### Cómo desactivar el chatbot

**Opción 1 — Quitar el componente (sin build)**
```tsx
// En src/app/page.tsx, comentar o borrar esta línea:
<ChatBox alertas={filtradas} />
```

**Opción 2 — Quitar la API route (sin build)**
```bash
# Borrar o renombrar el archivo
mv src/app/api/chat/route.ts src/app/api/chat/route.ts.bak
```

**Opción 3 — Eliminar la variable de entorno**
```bash
# La API route devolverá error 500 "API key no configurada"
# El frontend mostrará "No se pudo conectar con el asistente"
# Pero no se hará ninguna llamada a MiniMax
```

**Opción 4 — Quitar todo (requiere build)**
```bash
# Borrar los archivos y reconstruir
rm src/app/api/chat/route.ts
rm src/components/molecules/ChatBox.tsx
# Quitar la importación y el <ChatBox> de src/app/page.tsx
pnpm build
```

### Modelos alternativos

Si querés cambiar de proveedor, solo modificá `src/app/api/chat/route.ts`:

```typescript
// DeepSeek
const AI_URL = "https://api.deepseek.com/v1/chat/completions";
const apiKey = process.env.DEEPSEEK_API_KEY;
// model: "deepseek-chat"

// OpenAI
const AI_URL = "https://api.openai.com/v1/chat/completions";
const apiKey = process.env.OPENAI_API_KEY;
// model: "gpt-4o-mini"
```

Cualquier proveedor con API compatible con OpenAI funciona con solo cambiar URL y key.

### Costos

MiniMax-M3 es económico (~$0.50 por millón de tokens). Con el uso típico del dashboard (10-20 preguntas por sesión), el costo es insignificante. La key se puede rotar o eliminar cuando termine la revisión de los jefes.

### Debugging

Si el chat no responde:
1. Verificar que `MINIMAX_API_KEY` esté en `.env.local` (desarrollo) o en Vercel Environment Variables (producción)
2. Verificar que la key sea válida: `curl -H "Authorization: Bearer $MINIMAX_API_KEY" https://api.minimax.io/v1/models`
3. Revisar la consola del navegador (F12 → Network → buscar "chat")
