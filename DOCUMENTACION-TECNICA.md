# Documentación Técnica — Barrio Pizza Dashboard

> Documentación completa del proyecto para el video explicativo y referencia futura.

---

## 1. Estructura del proyecto

```
Pizza/
├── src/                               # Carpeta del reto (datos originales)
│   ├── README.md                      # Enunciado original del reto
│   └── datos/                         # CSVs originales (4 archivos)
├── pizza/                             # Proyecto Next.js
│   ├── src/
│   │   ├── app/                       # Next.js App Router
│   │   │   ├── page.tsx               # Server Component — fetch + composición
│   │   │   ├── layout.tsx             # Root layout (fuentes, tema, toasts)
│   │   │   ├── loading.tsx            # Skeleton de carga
│   │   │   ├── error.tsx              # Error boundary
│   │   │   └── api/chat/route.ts      # API route del chatbot (POST /api/chat)
│   │   ├── components/
│   │   │   ├── atoms/                 # Componentes atómicos
│   │   │   │   ├── Title1.tsx, Title2.tsx, Paragraph.tsx, Span.tsx, MiniTitle.tsx
│   │   │   │   ├── ThemeToggle.tsx, ThemeToggleWrapper.tsx
│   │   │   ├── molecules/             # Componentes compuestos
│   │   │   │   ├── StatCard.tsx       # KPI individual
│   │   │   │   ├── AlertCard.tsx      # Alerta individual
│   │   │   │   ├── IngredientesTable.tsx  # Tabla con TanStack Table
│   │   │   │   ├── OrdenChart.tsx     # Gráfico de barras por sucursal
│   │   │   │   ├── TodasChart.tsx     # Gráfico combinado
│   │   │   │   ├── ComparativaSemanal.tsx  # Tendencias S1-S6
│   │   │   │   ├── AnomaliasSection.tsx    # Sección de anomalías
│   │   │   │   ├── ProveedoresList.tsx     # Lista por proveedor
│   │   │   │   ├── ChatBox.tsx        # Chat con IA
│   │   │   │   ├── UploadButton.tsx   # Subida de CSV
│   │   │   │   ├── MethodSelector.tsx # Selector de método de proyección
│   │   │   │   ├── InfoButton.tsx     # Botón de info (diálogo)
│   │   │   │   ├── MetodosInfoDialog.tsx  # Diálogo de métodos
│   │   │   │   └── ArchivosProblematicosModal.tsx  # Modal "Sin datos"
│   │   │   ├── organisms/             # Componentes contenedores
│   │   │   │   ├── DashboardHeader.tsx    # KPIs + filtros
│   │   │   │   ├── DashboardNav.tsx       # Badges + vistas
│   │   │   │   └── SucursalPanel.tsx      # Tabs + gráfico + tabla
│   │   │   ├── ui/                    # shadcn curado (7 componentes)
│   │   │   ├── ui-components.ts       # Barrel de shadcn
│   │   │   ├── client-components.ts   # Barrel Client Components
│   │   │   ├── server-components.ts   # Barrel Server Components
│   │   │   ├── scheletons.ts          # Barrel de skeletons
│   │   │   ├── skeletons/             # DashboardSkeleton
│   │   │   ├── animations/Animations.tsx  # FadeUp, MiniTitleAnimation
│   │   │   └── types.ts               # Tipos centralizados (NO SE USA activamente)
│   │   ├── hooks/                     # Hooks (themeProvider, useTheme)
│   │   ├── services/                  # Capa de acceso a datos
│   │   │   ├── ordenes.data.service.ts    # CRUD de órdenes
│   │   │   ├── tendencias.service.ts      # Datos para gráficos S1-S6
│   │   │   └── upload.service.ts          # Parseo CSV → guardar
│   │   ├── lib/                       # Lógica pura (sin BD)
│   │   │   ├── data.ts                # generarAlertas() pura + agruparPorProveedor
│   │   │   ├── data-server.ts         # Fetch de Supabase → llama a data.ts
│   │   │   ├── proyeccion.ts          # mediana, mediaMovil, mediaPonderada
│   │   │   ├── necesidad.ts           # calcularNecesidad()
│   │   │   ├── anomalias.ts           # detectarAnomalias()
│   │   │   ├── tipos.ts               # Interfaces del dominio
│   │   │   └── supabase.ts            # Cliente Supabase
│   │   └── utils/supabase/            # Clientes SSR
│   │       ├── client.ts              # createBrowserClient
│   │       ├── server.ts              # createServerClient
│   │       └── middleware.ts          # updateSession
│   ├── public/data/                   # CSVs estáticos
│   ├── supabase/migrations/           # Migraciones SQL
│   ├── vercel.json                    # Config de Vercel
│   ├── package.json
│   └── README.md
├── tutoriales/                        # Documentación paso a paso
│   ├── README.md
│   ├── chatbot.md
│   ├── tendencias.md
│   ├── base-de-datos.md
│   └── deploy.md
├── propuesta/PLAN.md                  # Plan de implementación
└── ANALISIS-VISUAL.md                # Análisis UX
```

## 2. Flujo de datos

```
┌─────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                │
│  Tablas: public.ingredientes, public.consumo_historico,         │
│          public.inventario, public.ordenes, public.sucursales   │
└────┬───────────────────────────────────────────────────────┬────┘
     │                                                       │
     │  SERVER-SIDE (page.tsx)                              │  CLIENT-SIDE (upload, tendencias)
     │                                                       │
     ▼                                                       ▼
┌──────────────────┐                              ┌──────────────────────┐
│ lib/data-server.ts│                              │ services/            │
│ → fetch 4 tablas  │                              │ → ordenes.data.svc   │
│ → Promise.all     │                              │ → tendencias.svc     │
│ → llama a data.ts │                              │ → upload.svc         │
└────┬──────────────┘                              └──────────────────────┘
     │
     ▼
┌──────────────────┐
│ lib/data.ts       │  ← LÓGICA PURA
│ → generarAlertas()│     Recibe datos, devuelve Alertas[]
│   ├── proyeccion  │     Sin dependencias de BD
│   ├── necesidad   │
│   └── anomalias   │
└────┬──────────────┘
     │
     ▼
┌──────────────────┐
│ page.tsx          │  ← SERVER COMPONENT
│ → await generar   │     Solo fetch + composición
│ → pasa props      │     Cero estado, cero hooks
└────┬──────────────┘
     │
     ▼
┌──────────────────┐
│ DashboardHeader   │  ← CLIENT COMPONENTS
│ DashboardNav      │     Cada uno maneja su estado interno
│ SucursalPanel     │     Comunicación vía URL search params
│ ChatBox, Modals   │
└──────────────────┘
```

## 3. Jerarquía de componentes

```
page.tsx (Server Component)
├── ThemeToggleWrapper     (Client - onClick)
├── MethodSelector         (Client - useRouter)
├── InfoButton             (Client - useState)
├── UploadButton           (Client - upload + router.refresh)
├── DashboardHeader        (Client - filtro vía URL params)
│   └── StatCard[]         (Server - tipografía pura)
├── DashboardNav           (Client - vista vía estado interno)
│   ├── Badge[]            (Client - onClick)
│   ├── AnomaliasSection   (Client - condicional)
│   ├── ProveedoresList    (Server)
│   ├── ComparativaSemanal (Client - useEffect fetch)
│   └── SucursalPanel      (Client)
│       ├── Tabs           (Client)
│       ├── AlertCard[]    (Server)
│       ├── OrdenChart     (Client - Recharts)
│       ├── TodasChart     (Client - Recharts)
│       └── IngredientesTable (Client - TanStack Table)
├── MetodosInfoDialog      (Client - useState)
├── ArchivosProblematicosModal (Client - useState)
└── ChatBox                (Client - fetch /api/chat)
```

## 4. Base de Datos

### Esquema

Proyecto Supabase: NINCy (`hlsjbvwnqcwrzfuyocja`)

| Tabla | Descripción | Columnas |
|-------|-------------|----------|
| `public.ingredientes` | Catálogo: 22 ingredientes | `id`, `nombre`, `proveedor`, `unidad_base`, `formato_compra`, `unidad_base_por_formato`, `es_perecedero` |
| `public.sucursales` | 4 sucursales | `id`, `nombre` |
| `public.consumo_historico` | 528 registros de 6 semanas | `sucursal`, `ingrediente_id`, `semana`, `consumo_unidad_base` |
| `public.inventario` | 88 registros de stock actual | `sucursal`, `ingrediente_id`, `stock_actual_unidad_base` |
| `public.ordenes` | 89 órdenes de compra | `sucursal`, `ingrediente_id`, `cantidad_formatos` |

### RLS: desactivado para prototipo

```sql
ALTER TABLE public.ingredientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes DISABLE ROW LEVEL SECURITY;
-- ...
```

### Clientes Supabase

| Cliente | Archivo | Uso |
|---------|---------|-----|
| Server | `utils/supabase/server.ts` | `data-server.ts` — fetch desde Server Components |
| Browser | `utils/supabase/client.ts` | `lib/supabase.ts` → servicios client-side |
| Middleware | `utils/supabase/middleware.ts` | `middleware.ts` — sesiones |

## 5. Flujo de upload

```
Usuario arrastra/sube CSV
  → UploadButton.tsx: validación de extensión
  → upload.service.ts: PapaParse → filtra filas válidas
  → ordenes.data.service.ts: guardarOrdenes()
    → supabase.from("ordenes").delete().gt("id", 0)  // borrar todo
    → supabase.from("ordenes").insert(rows)            // insertar nuevo
  → router.refresh()                                   // re-fetch server-side
  → page.tsx se re-ejecuta en el servidor
  → Dashboard actualizado
```

## 6. Flujo del chatbot

```
Usuario escribe pregunta
  → ChatBox.tsx: fetch("/api/chat", { pregunta, datos })
  → api/chat/route.ts: formatea 89 alertas como contexto
  → POST https://api.minimax.io/v1/chat/completions
    model: MiniMax-M3
    system: "respondé solo con estos datos, español, 2-4 oraciones"
  ← { respuesta, razonamiento }
  → ChatBox: respuesta en burbuja, razonamiento en acordeón colapsable
```

## 7. Métodos de proyección

| Método | Cálculo | Ventaja |
|--------|---------|---------|
| **Mediana** (default) | Valor central de las 6 semanas | Ignora outliers (ej: pepperoni Marbella S3=150) |
| **Media móvil** | Promedio últimas 3 semanas | Captura tendencias de crecimiento |
| **Media ponderada** | Pesos: 35% S6, 25% S5, 15% S4... | Balance entre robustez y tendencia |

## 8. Edge cases manejados

| Caso | Detección | UI |
|------|-----------|-----|
| Ingrediente no pedido (olvido) | `ordenItem === undefined` | 🔴 Quiebre — mozzarella Brisas del Golf |
| Ingrediente fantasma (aji_chombo) | `!mapaCat.has(id)` | ⚠️ Sin datos — modal con descarga/eliminar |
| Outlier (150 kg pepperoni) | Mediana = 29, ignora el outlier | No distorsiona proyección |
| Dato faltante (valor vacío en CSV) | PapaParse `skipEmptyLines` + filtro | Ignorado silenciosamente |
| Stock cero | `invSuc = 0` | Cálculo normal con `Math.max(0, ...)` |
