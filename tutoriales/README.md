# Tutoriales — Barrio Pizza Dashboard

Documentación interna para replicar, mantener y extender el proyecto.

---

## Índice

| Tutorial | Descripción |
|----------|-------------|
| [chatbot.md](./chatbot.md) | Cómo funciona el chat con IA, setup, y cómo desactivarlo |
| [tendencias.md](./tendencias.md) | Cómo funciona la comparativa semanal S1-S6 |
| [base-de-datos.md](./base-de-datos.md) | Setup de Supabase, migraciones, seed, schema custom |
| [deploy.md](./deploy.md) | Deploy en Vercel, variables de entorno, solución de errores |

---

## Arquitectura del proyecto

```
Pizza/                          ← raíz del proyecto (documentación, IA)
├── tutoriales/                 ← esta carpeta
│   ├── README.md
│   ├── chatbot.md
│   ├── tendencias.md
│   ├── base-de-datos.md
│   └── deploy.md
├── src/                        ← código fuente del reto (datos, README)
│   ├── README.md               ← enunciado del reto
│   └── datos/                  ← CSVs originales
└── pizza/                      ← proyecto Next.js
    ├── src/
    │   ├── app/
    │   │   ├── api/chat/       ← API route del chatbot
    │   │   ├── page.tsx         ← dashboard
    │   │   ├── loading.tsx      ← skeleton
    │   │   └── error.tsx        ← error boundary
    │   ├── components/          ← UI (atoms, molecules, organisms, ui)
    │   ├── hooks/               ← useDashboard
    │   ├── services/            ← capa de datos (Supabase)
    │   ├── lib/                 ← lógica pura
    │   └── utils/supabase/      ← clientes Supabase
    ├── supabase/migrations/     ← SQL de creación de tablas
    ├── vercel.json
    └── README.md
```

## Servicios implementados

```typescript
// Capa de datos — cada archivo una responsabilidad
services/
├── ingredientes.data.service.ts   // getIngredientes()
├── historico.data.service.ts      // getHistorico()
├── inventario.data.service.ts     // getInventario()
├── ordenes.data.service.ts        // getOrdenes() + guardarOrdenes() + eliminarOrdenesPorIngrediente()
├── tendencias.service.ts          // getTendencias() — datos semanales para gráficos
├── upload.service.ts              // procesarCSV() — parseo y guardado
└── orquestador.service.ts         // getDatosCompletos() → Promise.all
```

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Componentes | Atomic Design (atoms → molecules → organisms) + shadcn curado |
| Base de datos | Supabase (PostgreSQL) |
| Gráficos | Recharts |
| Tablas | TanStack Table v8 |
| CSV | PapaParse |
| IA | MiniMax API (modelo M3) |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Toasts | Sonner |
| Package manager | pnpm |
