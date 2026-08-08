// ================================================================
// ProveedoresList — Lista agrupada por proveedor
// ================================================================
import { FadeUp } from "@/components/animations/Animations";
import type { Alerta } from "@/lib/tipos";

interface ProveedoresListProps {
  grupos: Record<string, Alerta[]>;
}

export function ProveedoresList({ grupos }: ProveedoresListProps) {
  const entradas = Object.entries(grupos);
  if (entradas.length === 0) return null;

  return (
    <div className="space-y-6">
      {entradas.map(([prov, items]) => (
        <FadeUp key={prov}>
          <div className="bg-card border border-border-mid rounded-xl p-4">
            <h3 className="text-lg font-semibold text-main mb-3">{prov} ({items.length} items)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {items.map((a, i) => (
                <div key={i} className="text-sm flex justify-between py-1 border-b border-border-subtle last:border-0">
                  <span>{a.nombre}</span>
                  <span className="text-muted">{a.formatos_necesarios} {a.formato}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
