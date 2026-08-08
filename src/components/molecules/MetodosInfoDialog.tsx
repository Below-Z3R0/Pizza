// ================================================================
// MetodosInfoDialog — Diálogo explicativo de métodos de proyección
// ================================================================
import { HelpCircle } from "lucide-react";
import { Dialog } from "@/components/ui";

interface MetodosInfoDialogProps {
  open: boolean;
  onClose: () => void;
}

export function MetodosInfoDialog({ open, onClose }: MetodosInfoDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="relative">
        <button onClick={onClose} className="absolute top-0 right-0 p-1 text-muted hover:text-main">
          <HelpCircle className="size-5" />
        </button>
        <h2 className="text-xl font-bold text-main mb-4">Métodos de proyección</h2>
        <div className="space-y-4 text-sm text-body leading-relaxed">
          <div>
            <h3 className="font-semibold text-main">📊 Mediana</h3>
            <p>Ordena los consumos y toma el valor del medio. <strong>Ignora outliers</strong>. Es el más robusto y el recomendado por defecto.</p>
          </div>
          <div>
            <h3 className="font-semibold text-main">📈 Media móvil (3 semanas)</h3>
            <p>Promedia solo las últimas 3 semanas. Captura tendencias recientes de crecimiento o decrecimiento.</p>
          </div>
          <div>
            <h3 className="font-semibold text-main">⚖️ Media ponderada</h3>
            <p>Da más peso a las semanas recientes (35% a S6, 25% a S5...). Balance entre robustez y sensibilidad a tendencias.</p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
