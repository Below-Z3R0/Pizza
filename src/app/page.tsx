// ================================================================
// page.tsx — Server Component (fetching + composición pura)
// Patrón CentenoAdvisory: cero estado, cero hooks, solo composición
// ================================================================
import { generarAlertas, detectarAnomalias } from "@/lib/data-server";
import { DashboardShell } from "@/components/organisms/DashboardShell";

export default async function DashboardPage() {
  const alertas = await generarAlertas();
  const anomalas = detectarAnomalias(alertas);

  return <DashboardShell alertas={alertas} anomalas={anomalas} />;
}
