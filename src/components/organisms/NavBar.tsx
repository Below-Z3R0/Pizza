// ============================================
// NavBar — Client Component
// ============================================
// Navbar principal del sitio público. Recibe datos del server
// vía initialData. Si es null, muestra skeleton.

"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { LanguageSwitcher } from "@/components/atoms/LanguageSwitcher";
import { useIsOpen } from "@/hooks/useIsOpen";
import { type NavBarProps } from "@/components/types";

export function Navbar({ initialData, lang }: NavBarProps & { lang: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!initialData) {
    return (
      <header className="fixed top-0 w-full z-50 py-4 backdrop-blur-xl bg-page/80 border-b border-border-subtle content-container animate-pulse">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 py-3 backdrop-blur-xl bg-page/80 border-b border-border-subtle content-container">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo / Home */}
        <a href="/" className="text-main font-bold text-lg hover:opacity-80 transition-opacity">
          {process.env.NEXT_PUBLIC_SITE_NAME || "Template"}
        </a>

        {/* Nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {initialData.links.map((link) => (
            <a
              key={link.id}
              href={link.id}
              className="px-3 py-2 font-sans text-[13px] font-medium text-body hover:text-main hover:bg-hover rounded-md transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="relative flex items-center gap-2">
          {mounted && <ThemeToggle />}
          <LanguageSwitcher currentLang={lang} />

          <a
            href="/login"
            className="hidden sm:inline-flex items-center px-4 py-2 bg-accent hover:bg-accent-alt text-white text-[12px] font-medium rounded-md transition-all duration-200 shadow-sm"
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    </header>
  );
}
