// ================================================================
// StatCard — KPI horizontal: icono grande + número prominente
// ================================================================
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: "default" | "danger" | "warning" | "success";
  active?: boolean;
  onClick?: () => void;
}

const variants: Record<string, { bg: string; icon: string; text: string }> = {
  default: {
    bg: "bg-card",
    icon: "text-muted bg-surface",
    text: "text-main",
  },
  danger: {
    bg: "bg-card",
    icon: "text-red-600 bg-red-100 dark:bg-red-900/40",
    text: "text-red-600 dark:text-red-400",
  },
  warning: {
    bg: "bg-card",
    icon: "text-amber-600 bg-amber-100 dark:bg-amber-900/40",
    text: "text-amber-600 dark:text-amber-400",
  },
  success: {
    bg: "bg-card",
    icon: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40",
    text: "text-emerald-600 dark:text-emerald-400",
  },
};

export function StatCard({ title, value, subtitle, icon: Icon, variant = "default", active, onClick }: StatCardProps) {
  const v = variants[variant];

  return (
    <Card
      onClick={onClick}
      className={`${v.bg} border border-border-subtle transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        active ? "ring-2 ring-accent" : ""
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider">{title}</p>
            <p className={`text-4xl font-bold ${v.text} leading-tight mt-1`}>{value}</p>
            {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
          </div>
          {Icon && (
            <div className={`shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg ${v.icon}`}>
              <Icon className="size-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
