// ================================================================
// badge.tsx — shadcn Badge curado con tokens del design system
// ================================================================
import type { ReactNode, MouseEventHandler } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "danger" | "warning" | "success" | "outline";
  className?: string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
}

const variants: Record<string, string> = {
  default: "bg-accent-soft text-accent border-accent/20",
  danger: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  warning: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  success: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  outline: "bg-transparent text-muted border-border-mid",
};

export function Badge({ children, variant = "default", className = "", onClick }: BadgeProps) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${onClick ? "cursor-pointer hover:opacity-80" : ""} ${className}`}
    >
      {children}
    </span>
  );
}
