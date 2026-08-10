---
type: readme
project: pizza
module: flujo-datos
scope: learning
status: completed
created: 2026-08-08
updated: 2026-08-08
tags: [pizza, flujo-datos, server, client, fetch, upload, mermaid]
---

# 🔄 Flujo de Datos — Barrio Pizza

## Flujo principal (lectura)

```mermaid
flowchart TD
    A[Usuario navega a /] --> B[page.tsx<br/>Server Component]
    B -->|await generarAlertas| C[data-server.ts]
    C -->|Promise.all| D1[ingredientes]
    C -->|Promise.all| D2[consumo_historico]
    C -->|Promise.all| D3[inventario]
    C -->|Promise.all| D4[ordenes]
    D1 & D2 & D3 & D4 --> E[data.ts<br/>LÓGICA PURA]
    E --> F[proyeccion.ts<br/>mediana/media/ponderada]
    E --> G[necesidad.ts<br/>calcularNecesidad]
    E --> H[anomalias.ts<br/>detectarAnomalias]
    F & G & H --> I[Alertas[]]
    I --> J[DashboardHeader<br/>KPIs + filtros]
    I --> K[DashboardNav<br/>Badges + vistas]
    I --> L[ChatBox<br/>chat IA]
    J --> M[SucursalPanel]
    K --> M
    M --> N[Gráfico + Tabla]
```

## Flujo de upload (escritura)

```mermaid
flowchart TD
    A[Usuario selecciona CSV] --> B[UploadButton.tsx]
    B -->|PapaParse| C[upload.service.ts]
    C -->|filtrar filas válidas| D[guardarOrdenes]
    D --> E[ordenes.data.service.ts]
    E -->|DELETE| F[(Supabase)]
    E -->|INSERT| F
    B -->|router.refresh| G[page.tsx se re-ejecuta]
    G --> H[Dashboard actualizado]
```

## Flujo del chatbot

```mermaid
flowchart LR
    A[Usuario escribe pregunta] --> B[ChatBox.tsx]
    B -->|POST /api/chat| C[api/chat/route.ts]
    C -->|formatea datos como contexto| D[POST api.minimax.io/v1]
    D -->|MiniMax-M3| E[Respuesta + Razonamiento]
    E --> F[ChatBox: burbuja + acordeón]
```

## Comunicación entre componentes (filtro vía URL)

```mermaid
sequenceDiagram
    participant H as DashboardHeader
    participant U as URL (?filtro=quiebre)
    participant N as DashboardNav

    H->>U: router.push("?filtro=quiebre")
    U-->>N: searchParams.get("filtro")
    N->>N: filtradas = alertas.filter(...)
    N->>N: Renderiza solo quiebres
    H->>U: router.push("/")
    U-->>N: filtro = null
    N->>N: Muestra todas las alertas
```

## Flujo de "Sin datos" (modal)

```mermaid
flowchart TD
    A[KPI Sin datos click] --> B[DashboardHeader]
    B -->|setSinDatosOpen| C[ArchivosProblematicosModal]
    C -->|Descargar| D[Genera CSV desde memoria]
    C -->|Eliminar| E[DELETE FROM ordenes]
    E -->|router.refresh| F[page.tsx re-fetch]
    F --> G[Sin datos desaparecen]
```

## Flujo de anomalías

```mermaid
flowchart LR
    A[anomalias.ts] -->|Agrupa por ingrediente| B[Mediana entre sucursales]
    B -->|Si > 2x mediana| C[Alerta de anomalía]
    C --> D[DashboardNav badge]
    D -->|setView| E[AnomaliasSection]
```

## Flujo de tendencias S1-S6

```mermaid
flowchart TD
    A[Badge Tendencias] --> B[ComparativaSemanal]
    B -->|useEffect| C[tendencias.service.ts]
    C -->|Promise.all| D[(consumo_historico)]
    C -->|Promise.all| E[(ingredientes)]
    D & E --> F[Agrupar: sucursal→semana→ingrediente]
    F --> G[Recharts LineChart<br/>6 líneas, S1-S6]
```

## Flujo de cambio de método

```mermaid
flowchart LR
    A[MethodSelector] -->|router.push ?metodo=ponderada| B[page.tsx]
    B -->|await generarAlertas| C[data.ts usa mediaPonderada]
    C --> D[Nuevas proyecciones]
    D --> E[Dashboard actualizado]
```

## Flujo de carga inicial

```mermaid
sequenceDiagram
    participant N as Next.js
    participant L as loading.tsx
    participant P as page.tsx

    N->>L: Muestra skeleton
    P->>P: await generarAlertas()
    P-->>N: HTML listo
    N->>L: Reemplaza skeleton
    Note over N: Dashboard visible
```
