// ================================================================
// StatCard — KPI con icono + texto (estado original)
// ================================================================
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: "default" | "danger" | "warning" | "success";
}

const borders: Record<string, string> = {
  default: "",
  danger: "border-l-red-400 dark:border-l-red-500",
  warning: "border-l-amber-400 dark:border-l-amber-500",
  success: "border-l-emerald-400 dark:border-l-emerald-500",
};

const textColors: Record<string, string> = {
  default: "text-main",
  danger: "text-red-600 dark:text-red-400",
  warning: "text-amber-600 dark:text-amber-400",
  success: "text-emerald-600 dark:text-emerald-400",
};

export function StatCard({ title, value, subtitle, icon: Icon, variant = "default" }: StatCardProps) {
  return (
    <Card className={`border-l-4 ${borders[variant]}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${textColors[variant]}`}>{value}</p>
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
          {Icon && <Icon className={`size-8 opacity-30 ${textColors[variant]}`} />}
        </div>
      </CardContent>
    </Card>
  );
}
