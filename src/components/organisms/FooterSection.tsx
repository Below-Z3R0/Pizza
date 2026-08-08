// ============================================
// Footer — Server Component
// ============================================
// Footer del sitio público. Si data es null, muestra skeleton.

import { Paragraph } from "@/components/server-components";
import type { FooterProps } from "@/components/types";

export function Footer({ data }: FooterProps) {
  if (!data) {
    return (
      <footer className="w-full py-10 border-t border-border-subtle bg-card/50 animate-pulse">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-14 w-32 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full py-10 border-t border-border-subtle bg-card/50 backdrop-blur-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-start">
          {/* Description */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-main font-bold text-xl mb-2">
              {process.env.NEXT_PUBLIC_SITE_NAME || "Template"}
            </span>
            <Paragraph
              className="text-xs text-muted leading-relaxed text-center md:text-left"
              txt={data.description}
            />
          </div>

          {/* Eslogan */}
          <div className="self-center flex justify-center">
            <Paragraph
              className="font-sans text-sm font-medium text-body leading-relaxed text-center"
              txt={data.eslogan}
            />
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-end gap-2">
            {data.links.map((link, i) => (
              <a
                key={i}
                href={link.id}
                className="text-sm font-medium text-body hover:text-accent transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-border-subtle gap-4">
          <span className="text-xs font-medium text-muted">{data.legal}</span>
          <span className="text-xs text-accent font-semibold">{data.email}</span>
        </div>
      </div>
    </footer>
  );
}
