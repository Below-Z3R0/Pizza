// ================================================================
// AlertCard — Una alerta individual renderizada como card
// ================================================================
import { AlertCircle, AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Span } from "@/components/server-components";
import type { Alerta } from "@/lib/tipos";

const config = {
  quiebre: { icon: AlertCircle, variant: "danger" as const, label: "QUIEBRE" },
  sobrecompra: { icon: AlertTriangle, variant: "warning" as const, label: "SOBRECOMPRA" },
  ok: { icon: CheckCircle2, variant: "success" as const, label: "OK" },
  sin_datos: { icon: HelpCircle, variant: "default" as const, label: "SIN DATOS" },
};

export function AlertCard({ alerta }: { alerta: Alerta }) {
  const { icon: Icon, variant, label } = config[alerta.tipo];

  return (
    <Alert variant={variant === "danger" ? "danger" : variant === "warning" ? "warning" : variant === "success" ? "success" : "default"}>
      <div className="flex items-start gap-3">
        <Icon className="size-5 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant={variant === "danger" ? "danger" : variant === "warning" ? "warning" : variant === "success" ? "success" : "outline"}>
              {label}
            </Badge>
            <Span className="text-sm! font-semibold text-main!" txt={alerta.nombre} />
            <Span className="text-xs! text-muted!" txt={`— ${alerta.sucursal}`} />
          </div>
          <AlertDescription>
            <p className="text-sm leading-relaxed">{alerta.mensaje}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted">
              <span>Proyectado: {alerta.consumo_proyectado.toFixed(1)} {alerta.unidad_base}</span>
              <span>Stock: {alerta.stock_actual.toFixed(1)} {alerta.unidad_base}</span>
              <span>Necesita: {alerta.formatos_necesarios} {alerta.formato}</span>
              <span>Pide: {alerta.formatos_pedidos} {alerta.formato}</span>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
