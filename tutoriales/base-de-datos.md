# Base de Datos — Supabase

## Schema

El proyecto usa **Supabase** con un schema custom llamado `pizza`. Alternativamente, se puede usar el schema `public` (default).

### Tablas

```sql
-- 5 tablas en schema pizza (o public)
pizza.ingredientes        -- Catálogo: 22 ingredientes
pizza.sucursales          -- 4 sucursales
pizza.consumo_historico   -- 6 semanas × 4 sucursales × 22 ingredientes = 528 registros
pizza.inventario          -- Stock actual por sucursal/ingrediente
pizza.ordenes             -- Órdenes de compra de la semana
```

### Schema custom vs default

**Schema custom (`pizza`):**
- Ventaja: datos aislados del resto de proyectos en el mismo Supabase
- Requiere: exponer el schema en Supabase Dashboard → Settings → API → Exposed Schemas
- El cliente JS debe configurarse: `db: { schema: "pizza" }`

**Schema default (`public`):**
- Ventaja: funciona sin configuración adicional
- Desventaja: mezcla tablas con otros proyectos
- El cliente JS usa: `db: { schema: "public" }` (o simplemente no especificar)

Para cambiar de un schema a otro, solo hay que editar 3 archivos:
- `src/utils/supabase/client.ts`
- `src/utils/supabase/server.ts`
- `src/utils/supabase/middleware.ts`

### Migraciones

```bash
# 1. Conectar al proyecto
cd pizza
supabase link --project-ref hlsjbvwnqcwrzfuyocja

# 2. Aplicar migración (crea tablas)
supabase db push

# 3. Sembrar datos
supabase db query --linked --file supabase/seed.sql
```

### RLS (Row Level Security)

Para desarrollo/prototipo: **RLS desactivado**.
```sql
ALTER TABLE pizza.ordenes DISABLE ROW LEVEL SECURITY;
```

Para producción: **RLS activado con políticas**.
```sql
ALTER TABLE pizza.ordenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lectura_publica" ON pizza.ordenes FOR SELECT USING (true);
CREATE POLICY "escritura_autenticada" ON pizza.ordenes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Variables de entorno

```bash
# .env.local (desarrollo)
NEXT_PUBLIC_SUPABASE_URL=https://hlsjbvwnqcwrzfuyocja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_nAA_kpohr-VyV_llbRjO4A_5ErNtDzD
```

Estas mismas variables se configuran en Vercel para producción.

### Conexiones desde el código

El data layer usa el cliente Supabase configurado en `src/utils/supabase/client.ts`:

```typescript
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(url, key, { db: { schema: "pizza" } });
```

Los servicios (`src/services/`) importan este cliente y hacen queries tipadas:

```typescript
const { data, error } = await supabase.from("ordenes").select("*");
```

### Replicar en otro proyecto

1. Copiar `src/services/`, `src/lib/`, `src/hooks/useDashboard.ts`
2. Crear las tablas con `supabase/migrations/`
3. Configurar `src/utils/supabase/client.ts` con tus credenciales
4. Si usás schema `public`, cambiar `schema: "pizza"` → `schema: "public"`
5. Sembrar datos con `supabase/seed.sql`
