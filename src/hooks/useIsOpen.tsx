"use client";

import { useEffect, useState } from "react";

/**
 * Hook de toggle con persistencia en localStorage.
 *
 * @param key         Clave de localStorage (default: 'isOpen')
 * @param defaultValue Estado inicial antes de leer localStorage
 */
export function useIsOpen(key: string = "isOpen", defaultValue: boolean = false) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultValue);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        setIsOpen(saved === "true");
      }
    } catch (error) {
      console.warn(`Error leyendo localStorage en clave "${key}":`, error);
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, String(isOpen));
  }, [isOpen, key]);

  const Toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, Toggle };
}
