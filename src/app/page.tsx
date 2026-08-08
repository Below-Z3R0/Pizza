import { generarAlertas, detectarAnomalias, type MetodoProyeccion } from "@/lib/data-server";
import { DashboardShell } from "@/components/organisms/DashboardShell";

interface PageProps {
  searchParams: Promise<{ metodo?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const metodo = (params.metodo as MetodoProyeccion) || "mediana";
  const alertas = await generarAlertas(metodo);
  const anomalas = detectarAnomalias(alertas);

  return <DashboardShell alertas={alertas} anomalas={anomalas} metodo={metodo} />;
}
