# Barrio Pizza — Dashboard de Compras

> Dashboard inteligente para revisar órdenes de compra de insumos de 4 sucursales. Proyecta consumo, detecta quiebres de stock y sobrecompras, y permite subir nuevas órdenes vía CSV.

---

## Quick Start

```bash
# 1. Clonar
git clone <repo-url> pizza
cd pizza

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase:
#   NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-publishable-key>

# 4. Crear tablas en Supabase
# Ejecutar supabase/migrations/20260808000000_pizza_schema.sql en el SQL Editor

# 5. Sembrar datos de prueba
pnpm run seed

# 6. Dev
pnpm dev
```

---

## Arquitectura

### Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx              # Root: fuentes, ThemeProvider, Background, Toaster
│   ├── globals.css             # Design tokens + light/dark themes
│   ├── page.tsx                # Dashboard (solo composición de organismos)
│   ├── loading.tsx             # Skeleton de carga
│   └── error.tsx               # Error boundary
├── components/
│   ├── ui/                     # shadcn curado (Badge, Card, Tabs, Alert, Table, Dialog, Input)
│   ├── atoms/                  # Tipografía (Title1, Title2, Paragraph, Span, MiniTitle)
│   ├── molecules/              # AlertCard, StatCard, IngredientesTable, OrdenChart, etc.
│   ├── organisms/              # DashboardShell, DashboardHeader, SucursalPanel
│   ├── animations/             # FadeUp, MiniTitleAnimation
│   ├── types.ts                # Tipos compartidos
│   ├── server-components.ts    # Barrel: Server Components
│   └── client-components.ts    # Barrel: Client Components
├── hooks/
│   ├── useDashboard.ts         # Hook central (estado + fetching + upload)
│   ├── themeProvider.tsx        # Next-themes wrapper
│   └── useTheme.tsx            # Hook de tema light/dark
├── services/                   # Capa de acceso a datos
│   ├── ingredientes.data.service.ts   # getIngredientes()
│   ├── historico.data.service.ts      # getHistorico()
│   ├── inventario.data.service.ts     # getInventario()
│   ├── ordenes.data.service.ts        # getOrdenes() + guardarOrdenes() + eliminarOrdenesPorIngrediente()
│   ├── upload.service.ts              # procesarCSV() — parseo y guardado
│   └── orquestador.service.ts         # getDatosCompletos() → Promise.all
├── lib/                        # Lógica pura (sin dependencias de BD)
│   ├── data.ts                 # generarAlertas() + agruparPorProveedor()
│   ├── proyeccion.ts           # mediana(), mediaMovil(), mediaPonderada()
│   ├── necesidad.ts            # calcularNecesidad()
│   ├── anomalias.ts            # detectarAnomalias()
│   ├── formatear.ts            # formatearAlerta() — mensajes
│   └── tipos.ts                # Interfaces del dominio
├── utils/
│   └── supabase/
│       ├── client.ts           # createBrowserClient (CSR)
│       ├── server.ts           # createServerClient (RSC)
│       └── middleware.ts       # updateSession
├── middleware.ts               # Middleware de Next.js (sesiones)
└── supabase/
    └── migrations/             # Migraciones SQL
```

### Flujo de datos

```
┌─────────────┐     ┌──────────────────┐     ┌────────────┐
│  Supabase   │ ←── │    services/     │ ←── │  lib/      │
│  (BD)       │     │  (data.service)  │     │  (lógica)  │
└─────────────┘     └──────────────────┘     └────────────┘
                           │                        │
                    orquestador.service.ts    data.ts
                    Promise.all([...])        generarAlertas()
                           │                        │
                           ▼                        ▼
                    ┌──────────────┐        ┌──────────────┐
                    │ useDashboard │ ────── │   page.tsx   │
                    │   (hook)     │        │ (composición) │
                    └──────────────┘        └──────────────┘
```

**Página principal (`page.tsx`):** solo compone organismos. Sin HTML/Tailwind directo. Delega toda la UI a componentes.

**Hook (`useDashboard`):** maneja estado, carga datos vía `generarAlertas()`, expone funciones de filtrado y upload.

**Servicios (`services/`):** capa de acceso a datos. Cada archivo tiene una responsabilidad única. Siguen el patrón de CentenoAdvisory: `Promise.all` en el orquestador para llamadas independientes.

**Librerías de lógica (`lib/`):** funciones puras sin dependencias de BD. Testeables independientemente.

---

## Base de Datos

### Schema

El proyecto usa un schema custom llamado `pizza` en Supabase. Tiene 5 tablas:

| Tabla | Descripción | Columnas clave |
|-------|-------------|----------------|
| `pizza.ingredientes` | Catálogo de 22 ingredientes | `id`, `nombre`, `proveedor`, `unidad_base_por_formato` |
| `pizza.sucursales` | 4 sucursales | `id`, `nombre` |
| `pizza.consumo_historico` | 6 semanas de consumo | `sucursal`, `ingrediente_id`, `semana`, `consumo_unidad_base` |
| `pizza.inventario` | Stock actual | `sucursal`, `ingrediente_id`, `stock_actual_unidad_base` |
| `pizza.ordenes` | Órdenes de compra | `sucursal`, `ingrediente_id`, `cantidad_formatos` |

### Sobre el schema custom (`pizza`)

Normalmente Supabase expone solo el schema `public` en la REST API. Para usar un schema custom como `pizza`, se necesita:

1. **Crear el schema en Supabase**: `CREATE SCHEMA IF NOT EXISTS pizza;`
2. **Exponerlo en la API REST**: Agregar `pizza` en Supabase Dashboard → Settings → API → Exposed Schemas
3. **Configurar el cliente**: `createBrowserClient(url, key, { db: { schema: "pizza" } })`

Si preferís usar el schema por defecto (`public`), solo cambiá `schema: "pizza"` por `schema: "public"` en:
- `src/utils/supabase/client.ts`
- `src/utils/supabase/server.ts`
- `src/utils/supabase/middleware.ts`

El resto del código funciona igual con cualquier schema.

### RLS (Row Level Security)

Para este prototipo, RLS está **desactivado** en todas las tablas. Esto permite que el dashboard funcione sin autenticación. En producción, se debe activar RLS y crear políticas adecuadas.

```sql
-- Desactivar RLS (desarrollo)
ALTER TABLE pizza.ingredientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE pizza.ordenes DISABLE ROW LEVEL SECURITY;
-- etc.

-- Activar RLS (producción)
ALTER TABLE pizza.ingredientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lectura_publica" ON pizza.ingredientes FOR SELECT USING (true);
-- etc.
```

### Migraciones

Las migraciones están en `supabase/migrations/`:

```bash
# Aplicar migraciones a la BD remota
supabase link --project-ref <project-id>
supabase db push
```

### Seed de datos

El script `supabase/seed.sql` contiene los datos del reto original (22 ingredientes, 528 registros de consumo, 88 de inventario, 89 órdenes). Se aplica con:

```bash
supabase db query --linked --file supabase/seed.sql
```

---

## Fetching de Datos

### Flujo completo

1. **`useDashboard`** llama a `generarAlertas()` al montarse
2. **`generarAlertas()`** en `lib/data.ts` llama a `getDatosCompletos()`
3. **`getDatosCompletos()`** en `services/orquestador.service.ts` ejecuta 4 queries en paralelo:
   ```typescript
   const [ingredientes, historico, inventario, ordenes] = await Promise.all([
     getIngredientes(),  // SELECT * FROM pizza.ingredientes
     getHistorico(),     // SELECT * FROM pizza.consumo_historico
     getInventario(),    // SELECT * FROM pizza.inventario
     getOrdenes(),       // SELECT * FROM pizza.ordenes
   ]);
   ```
4. Con los datos en memoria, `generarAlertas()` aplica la lógica de proyección y comparación
5. Los resultados se pasan a los componentes vía props

### Cliente Supabase

El cliente se crea en `src/utils/supabase/client.ts` usando `createBrowserClient` de `@supabase/ssr`:

```typescript
export const createClient = () =>
  createBrowserClient(url, key, { db: { schema: "pizza" } });
```

Esto configura automáticamente los headers `apikey`, `Authorization`, y `Accept-Profile` para que las requests lleguen al schema correcto.

---

## Upload de Archivos

### Flujo

1. Usuario hace clic en "Subir CSV" → selecciona archivo
2. `DashboardShell` captura el evento y llama a `procesarUpload(file)`
3. `procesarUpload()` en `useDashboard` delega en `procesarCSV()` del servicio `upload.service.ts`
4. `procesarCSV()` usa **PapaParse** para parsear el CSV en el navegador
5. Las filas se convierten al formato esperado:
   ```typescript
   { sucursal: string, ingrediente_id: string, cantidad_formatos: number }
   ```
6. `guardarOrdenes()` en `ordenes.data.service.ts`:
   - Borra todas las órdenes existentes: `DELETE FROM pizza.ordenes WHERE id > 0`
   - Inserta las nuevas: `INSERT INTO pizza.ordenes (...)`
7. Se refrescan los datos llamando a `cargarDatos()`
8. El dashboard se actualiza automáticamente con las nuevas alertas

### Formato esperado del CSV

```csv
sucursal,ingrediente_id,cantidad_formatos
Brisas del Golf,harina,10
Costa del Este,mozzarella,14
Marbella,pepperoni,5
```

Si el archivo no tiene el formato correcto, se muestra un toast de error explicativo.

---

## Funcionalidades

| Funcionalidad | Descripción |
|---------------|-------------|
| **3 métodos de proyección** | Mediana (default, ignora outliers), Media móvil (últimas 3 semanas), Media ponderada (más peso a recientes) |
| **KPIs clickeables** | Filtrar alertas por tipo: quiebres, sobrecompras, correctos, sin datos |
| **Gráficos** | Recharts: comparativa por sucursal (Todas) y detalle por sucursal individual |
| **Tabla interactiva** | TanStack Table v8: sorting, filtro por texto, columnas con colores semánticos |
| **Anomalías** | Detección de órdenes atípicas (sucursal que pide >2x la mediana del grupo) |
| **Por proveedor** | Agrupación de órdenes por proveedor para facilitar envíos |
| **Archivos problemáticos** | Modal con ingredientes desconocidos, opción de descargar lista o eliminar |
| **Upload CSV** | PapaParse + react-dropzone (input nativo) → guarda en Supabase |
| **Tema claro/oscuro** | next-themes con tokens CSS personalizables |
| **Loading + Error** | Next.js standard: `loading.tsx` (skeleton) + `error.tsx` (boundary) |

---

## Dependencias

| Paquete | Uso |
|---------|-----|
| `next` 16 | Framework |
| `react` 19 | UI |
| `@supabase/ssr` | Cliente Supabase para Next.js |
| `@supabase/supabase-js` | Cliente Supabase base |
| `tailwindcss` 4 | Estilos |
| `framer-motion` | Animaciones |
| `recharts` | Gráficos |
| `@tanstack/react-table` 8 | Tabla interactiva |
| `papaparse` | Parseo de CSV |
| `next-themes` | Tema claro/oscuro |
| `sonner` | Toasts |
| `lucide-react` | Íconos |

---

## Decisiones Técnicas

| Decisión | Por qué |
|----------|---------|
| Schema `pizza` (custom) | Separar datos del proyecto del resto de apps en el mismo Supabase |
| Sin RLS (prototipo) | Desarrollo rápido, sin auth. En producción se activa |
| `Promise.all` en orquestador | Las 4 queries son independientes, se ejecutan en paralelo |
| Mediana como default | Robusta a outliers (Marbella pepperoni S3=150) |
| PapaParse (no código propio) | Robusto: maneja encoding, escapes, comillas. No reinventar |
| TanStack Table (no tabla vanilla) | Headless, sorting/filtrado sin boilerplate |
| Recharts (no CSS puro) | Declarativo, React-native, tipado |
| shadcn curado en `components/ui/` | Componentes accesibles (Radix), adaptados a tokens del design system |
| Servicios separados por dominio | Cada archivo una responsabilidad, testable independientemente |
| `page.tsx` sin HTML/Tailwind | Solo composición de organismos. Patrón CentenoAdvisory |
| Upload en servicio dedicado | Separación de concerns: UI → hook → servicio → BD |

---

## Replicar en otro proyecto

1. Copiá `src/services/`, `src/lib/`, `src/hooks/useDashboard.ts`
2. Adaptá los nombres de tablas en los servicios
3. Creá las tablas en Supabase con `supabase/migrations/`
4. Configurá `src/utils/supabase/client.ts` con tu URL y key
5. Si usás schema `public` (default), cambiá `schema: "pizza"` → `schema: "public"` en los 3 archivos de `utils/supabase/`
6. El dashboard se compone de organismos genéricos — reusá `DashboardHeader`, `SucursalPanel`, `StatCard`, `AlertCard` en cualquier proyecto de análisis de datos
