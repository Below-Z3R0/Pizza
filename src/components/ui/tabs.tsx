// ================================================================
// tabs.tsx — shadcn Tabs curado con tokens del design system
// ================================================================
"use client";

import { useState, type ReactNode } from "react";

interface TabsProps {
  items: { id: string; label: string }[];
  active?: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, active, onChange, className = "" }: TabsProps) {
  const [internal, setInternal] = useState(items[0]?.id ?? "");
  const current = active ?? internal;

  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-surface p-1 text-muted ${className}`}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => { onChange(item.id); setInternal(item.id); }}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-page transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
            current === item.id
              ? "bg-card text-main shadow-sm"
              : "hover:text-main hover:bg-hover"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
