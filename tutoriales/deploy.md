# Deploy en Vercel

## Requisitos

1. Repo en GitHub conectado
2. Vercel account (gratis)
3. Variables de entorno configuradas

## Paso a paso

### 1. Conectar repo

1. Ir a [vercel.com](https://vercel.com) → Add New → Project
2. Seleccionar el repo `Below-Z3R0/Pizza`
3. Vercel detecta automáticamente Next.js

### 2. Configurar variables de entorno

En Vercel Dashboard → Settings → Environment Variables, agregar:

```
NEXT_PUBLIC_SUPABASE_URL        = https://hlsjbvwnqcwrzfuyocja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = sb_publishable_nAA_kpohr-VyV_llbRjO4A_5ErNtDzD
MINIMAX_API_KEY                 = sk-cp-xxxxxxxxxxxxx
```

Las primeras dos son permanentes. La tercera (`MINIMAX_API_KEY`) es temporal para la revisión.

### 3. Deploy

Vercel hace `pnpm install` → `pnpm build` → deploy automático.

### 4. Verificar

Abrir la URL de Vercel (ej: `https://pizza-xxx.vercel.app`) y verificar que:
- El dashboard carga con datos (89 items analizados)
- El gráfico de tendencias funciona
- El upload de CSV funciona
- El chatbot responde (mientras la key esté activa)

## Errores comunes

### "Your project's URL and API key are required"
**Causa**: Las variables de entorno no están configuradas en Vercel.
**Solución**: Agregar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en Settings → Environment Variables.

### "pnpm-lock.yaml is broken"
**Causa**: El lockfile se corrompió.
**Solución**: 
```bash
rm pnpm-lock.yaml
pnpm install
git add pnpm-lock.yaml
git commit -m "fix: regenerate lockfile"
git push
```

### "Command 'pnpm install' exited with 1"
**Causa**: Vercel está usando npm en vez de pnpm.
**Solución**: El archivo `vercel.json` ya está configurado para forzar pnpm:
```json
{
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm build",
  "framework": "nextjs"
}
```

### Error 401 en el chat
**Causa**: La API key de MiniMax es inválida o expiró.
**Solución**: Verificar que `MINIMAX_API_KEY` esté configurada en Vercel y sea válida. Si se quiere desactivar temporalmente, borrar la variable de entorno en Vercel.

## Desactivar el chatbot temporalmente

Para la revisión de los jefes, la API key de MiniMax se configura en Vercel. Cuando termine la revisión:

1. Ir a Vercel → Settings → Environment Variables
2. Borrar `MINIMAX_API_KEY`
3. Redeploy

El dashboard seguirá funcionando normalmente, solo el chat mostrará "No se pudo conectar con el asistente".

Para una solución más limpia, quitar el componente `<ChatBox>` del `page.tsx` antes del deploy final.

## Dominio personalizado (opcional)

1. En Vercel → Settings → Domains
2. Agregar dominio (ej: `dashboard.barriopizza.com`)
3. Configurar DNS (CNAME a `cname.vercel-dns.com`)
