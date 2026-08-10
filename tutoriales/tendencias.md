# Comparativa Semanal (Tendencias S1-S6)

## Cómo funciona

El gráfico de tendencias muestra el consumo histórico de 6 ingredientes clave a lo largo de las 6 semanas para cada sucursal. Se activa con el badge "Tendencias S1-S6" en la barra de navegación del dashboard.

### Arquitectura

```
Usuario hace clic en "Tendencias S1-S6"
  → page.tsx: setMostrarTendencias(true)
  → ComparativaSemanal.tsx (useEffect → getTendencias())
    → tendencias.service.ts: SELECT * FROM pizza.consumo_historico
      → Agrupa por sucursal → semana → ingrediente
      → formatearParaGrafico() → datos para Recharts
    → TrendLineChart.tsx (Recharts LineChart)
      → 6 líneas de colores, una por ingrediente
```

### Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/services/tendencias.service.ts` | `getTendencias()` — consulta Supabase, agrupa datos |
| `src/components/molecules/ComparativaSemanal.tsx` | Componente contenedor: selector de sucursal + chart |
| `src/components/molecules/TrendLineChart.tsx` | Gráfico de líneas Recharts (carga dinámica) |
| `src/app/page.tsx` | Toggle badge + renderizado condicional |

### Datos que se muestran

Los 6 ingredientes clave seleccionados para el gráfico:

```typescript
const INGREDIENTES_CLAVE = [
  "harina",        // Harina 00 — el insumo base
  "mozzarella",    // Mozzarella — el más consumido
  "pepperoni",     // Pepperoni — alta variabilidad
  "salsa_pelatti", // Salsa pelatti — consistente
  "cebolla",       // Cebolla blanca — perecedero
  "aceite_oliva",  // Aceite de oliva — estable
];
```

Para cambiar los ingredientes mostrados, editar el array en `ComparativaSemanal.tsx`.

### Cómo agregar más ingredientes al gráfico

1. Editar `ComparativaSemanal.tsx`:
```typescript
const INGREDIENTES_CLAVE = [
  "harina", "mozzarella", "pepperoni",
  "salsa_pelatti", "cebolla", "aceite_oliva",
  "hongos", "pina", "jamon",  // ← agregar aquí
];
```

2. Los colores se asignan automáticamente (rotación de 6 colores en `TrendLineChart.tsx`).

### Formato de datos

El servicio `getTendencias()` devuelve:

```typescript
[
  {
    sucursal: "Brisas del Golf",
    semanas: [
      {
        semana: "S1",
        ingredientes: [
          { ingrediente_id: "harina", nombre: "Harina 00", consumo: 294 },
          { ingrediente_id: "mozzarella", nombre: "Mozzarella", consumo: 196 },
          // ...
        ]
      },
      // S2, S3, S4, S5, S6...
    ]
  },
  // Costa del Este, Marbella, Via Argentina...
]
```

`formatearParaGrafico()` convierte esto al formato que espera Recharts:

```typescript
[
  { semana: "S1", harina: 294, mozzarella: 196, pepperoni: 38, ... },
  { semana: "S2", harina: 297, mozzarella: 200, pepperoni: 37, ... },
  // ...
]
```

### Carga dinámica (SSR)

El gráfico usa `dynamic(() => import(...), { ssr: false })` para evitar errores de hidratación con Recharts. Esto significa que:
- En el servidor se renderiza un placeholder "Cargando..."
- En el cliente se monta el gráfico real
- No afecta el SEO (es un dashboard interno)
