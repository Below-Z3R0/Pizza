// ================================================================
// alert.tsx — shadcn Alert curado con tokens del design system
// ================================================================
import type { ReactNode } from "react";

type AlertVariant = "default" | "danger" | "warning" | "success";

const alertStyles: Record<AlertVariant, string> = {
  default: "border-border-mid bg-card text-main",
  danger: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300",
  warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
};

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  className?: string;
}

export function Alert({ children, variant = "default", className = "" }: AlertProps) {
  return (
    <div className={`relative w-full rounded-lg border p-4 ${alertStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}

export function AlertTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>{children}</h5>;
}

export function AlertDescription({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`text-sm ${className}`}>{children}</div>;
}
