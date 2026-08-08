// ================================================================
// StatCard — KPI card con icono, variante de color, clickeable
// ================================================================
import type { LucideIcon } from "lucide-react";
import type { MouseEventHandler } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: "default" | "danger" | "warning" | "success";
  onClick?: MouseEventHandler<HTMLDivElement>;
  active?: boolean;
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

export function StatCard({ title, value, subtitle, icon: Icon, variant = "default", onClick, active }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card border border-border-mid rounded-xl border-l-4 ${borders[variant]} shadow-sm transition-all duration-200 ${
        onClick ? "cursor-pointer hover:shadow-md" : ""
      } ${
        active ? "ring-2 ring-accent scale-[1.02]" : "hover:scale-[1.01]"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${textColors[variant]}`}>{value}</p>
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
          {Icon && <Icon className={`size-8 opacity-30 ${textColors[variant]}`} />}
        </div>
      </div>
    </div>
  );
}
