# Flujos de Datos

Documentación detallada de todos los flujos del dashboard con diagramas Mermaid.

| Flujo | Descripción |
|-------|-------------|
| Lectura (principal) | Server → Supabase → data.ts → componentes |
| Upload (escritura) | CSV → PapaParse → BD → router.refresh() |
| Chatbot | ChatBox → POST /api/chat → MiniMax |
| Filtro | KPI click → URL params → tabla filtrada |
| Sin datos | Modal → descargar CSV / eliminar de BD |
| Anomalías | detectarAnomalias() → Badge → AnomaliasSection |
| Por proveedor | agruparPorProveedor() → ProveedoresList |
| Tendencias S1-S6 | getTendencias() → Recharts LineChart |
| Cambio de método | URL ?metodo= → re-fetch → nuevas proyecciones |
| Carga inicial | loading.tsx → skeleton → datos |
| Error | error.tsx → reintentar |
| Tema claro/oscuro | ThemeToggle → next-themes → CSS variables |
