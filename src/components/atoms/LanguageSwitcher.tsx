"use client";

import { usePathname } from "next/navigation";

interface LanguageSwitcherProps {
  currentLang: string;
}

/**
 * Botón para alternar idioma (ES ↔ EN).
 *
 * IMPORTANTE: usa window.location.href (NO router.push) porque
 * necesitamos un reload COMPLETO para que los Server Components
 * se re-inicialicen con el nuevo idioma.
 */
export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLang = currentLang === "es" ? "en" : "es";
    window.location.href = `${pathname}?lang=${nextLang}`;
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="px-3 py-1.5 text-xs font-medium text-body hover:text-main hover:bg-hover rounded-md transition-all duration-200 border border-border-subtle"
      aria-label="Cambiar idioma"
    >
      {currentLang === "es" ? "EN" : "ES"}
    </button>
  );
}
