// ================================================================
// AnomaliasSection — Sección de órdenes atípicas
// ================================================================
import { AlertCard } from "./AlertCard";
import { FadeUp } from "@/components/animations/Animations";
import type { Alerta } from "@/lib/tipos";

interface AnomaliasSectionProps {
  anomalas: Alerta[];
  visible: boolean;
}

export function AnomaliasSection({ anomalas, visible }: AnomaliasSectionProps) {
  if (!visible || anomalas.length === 0) return null;

  return (
    <FadeUp>
      <div className="bg-card border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-3">
          ⚠️ {anomalas.length} órdenes atípicas detectadas
        </h3>
        <p className="text-sm text-body mb-4">
          Estas sucursales pidieron significativamente más que la mediana del resto para el mismo ingrediente.
        </p>
        <div className="space-y-2">
          {anomalas.map((a, i) => (
            <AlertCard key={`anom-${i}`} alerta={a} />
          ))}
        </div>
      </div>
    </FadeUp>
  );
}
