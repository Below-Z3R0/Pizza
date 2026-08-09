# Barrio Pizza — Dashboard de Compras

> Dashboard inteligente para revisar órdenes de compra de insumos. Detecta quiebres de stock, sobrecompras, y permite subir nuevas órdenes vía CSV. Incluye chat con IA para consultas en lenguaje natural.

---

## 🚀 Quick Start

```bash
cd pizza
pnpm install
cp .env.example .env.local   # Configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
pnpm dev                      # http://localhost:3000
```

## 🔗 Links

- **App en vivo (Vercel):** https://pizza-xxx.vercel.app
- **Repo GitHub:** https://github.com/Below-Z3R0/Pizza

---

## ✅ Requisitos del reto

| Requisito | Estado |
|-----------|--------|
| **Proyectar consumo** | ✅ 3 métodos: mediana (default), media móvil, media ponderada |
| **Calcular necesidad real** | ✅ `proyectado - inventario` → `ceil` a formatos |
| **Comparar con orden y alertas** | ✅ Quiebre 🔴 / Sobrecompra 🟡 / OK 🟢 / Sin datos ⚠️ |
| **Dashboard visual** | ✅ KPIs, tabs, tabla con sorting, gráficos de barras y líneas |
| **Manejo de unidades** | ✅ Conversión con `unidad_base_por_formato` |
| **Redondeo de formatos** | ✅ `ceil()`, excedente <1 formato no es sobrecompra |

### 🌟 Opcionales (todos implementados)

| Opcional | Implementación |
|----------|---------------|
| **Método más inteligente** | Mediana (ignora outliers), media móvil, media ponderada. Toggle en el header |
| **Chat con datos** | Botón flotante → MiniMax-M3 analiza los datos y responde preguntas |
| **Detección de órdenes raras** | Comparación inter-sucursal. Si una pide >2x la mediana → alerta de anomalía |
| **Agrupar por proveedor** | Badge "Por proveedor" muestra órdenes agrupadas para envío |
| **Subir CSV desde interfaz** | Botón "Subir CSV" → guarda en BD → refresca dashboard |

---

## 🏗️ Arquitectura

### Patrón: Server Components + Atomic Design

```
page.tsx (Server Component — async, solo fetch + composición)
├── DashboardHeader     (Client — KPIs + filtros vía URL params)
├── DashboardNav        (Client — Badges + vistas)
│   └── SucursalPanel   (Client — Tabs + gráfico + tabla con TanStack)
├── ChatBox             (Client — fetch /api/chat → MiniMax)
├── Modals              (Client — info, sin datos)
└── Upload              (Client — CSV → Supabase → router.refresh)
```

### Flujo: Server → Lógica pura → Componentes

```
data-server.ts (fetch 4 tablas en Promise.all)
  → data.ts (generarAlertas pura)
    → proyeccion.ts (mediana/media/ponderada)
    → necesidad.ts (calcularNecesidad)
    → anomalias.ts (detectarAnomalias)
  → page.tsx (pasa Alertas[] a componentes)
```

---

## 🗄️ Base de Datos (Supabase)

| Tabla | Registros | Descripción |
|-------|-----------|-------------|
| `public.ingredientes` | 22 | Catálogo de insumos |
| `public.sucursales` | 4 | Brisas del Golf, Costa del Este, Marbella, Via Argentina |
| `public.consumo_historico` | 528 | 6 semanas × 4 sucursales × 22 ingredientes |
| `public.inventario` | 88 | Stock actual por sucursal/ingrediente |
| `public.ordenes` | 89 | Órdenes de compra de la semana (incluye `aji_chombo` como edge case) |

---

## 📚 Documentación completa

Ver [DOCUMENTACION-TECNICA.md](./DOCUMENTACION-TECNICA.md) para:
- Estructura completa del proyecto
- Flujo de datos detallado
- Jerarquía de componentes
- Flujo de upload y chatbot
- Métodos de proyección
- Edge cases manejados

---

## 🛠️ Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 + shadcn curado |
| Base de datos | Supabase (PostgreSQL) |
| Gráficos | Recharts |
| Tabla | TanStack Table v8 |
| CSV | PapaParse |
| IA | MiniMax-M3 (chat) |
| Animaciones | Framer Motion |
| Deploy | Vercel |
