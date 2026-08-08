"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

/**
 * Hook de theme unificado. Delega el estado a next-themes.
 * Usa el patrón "mounted" para evitar hydration mismatch.
 */
export function useTheme() {
  const { setTheme: setNextTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme: Theme =
    mounted && (resolvedTheme === "dark" || resolvedTheme === "light")
      ? resolvedTheme
      : "dark";

  const setTheme = (newTheme: Theme) => {
    setNextTheme(newTheme);
  };

  return { theme: currentTheme, setTheme };
}
