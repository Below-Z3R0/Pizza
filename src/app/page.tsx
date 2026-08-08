// ================================================================
// page.tsx — Server Component (fetching server-side)
// ================================================================
import { generarAlertas, detectarAnomalias } from "@/lib/data";
import { DashboardClient } from "@/components/organisms/DashboardClient";

export default async function DashboardPage() {
  const alertas = await generarAlertas();
  const anomalas = detectarAnomalias(alertas);

  return <DashboardClient alertasIniciales={alertas} anomalasIniciales={anomalas} />;
}
