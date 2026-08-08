"use client";

import { ThemeToggle } from "./ThemeToggle";

export function ThemeToggleWrapper() {
  return (
    <div className="absolute top-0 right-0 z-10">
      <ThemeToggle />
    </div>
  );
}
