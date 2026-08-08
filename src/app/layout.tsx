import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Background } from "@/components/Background";
import { ThemeProvider } from "@/hooks/themeProvider";

/* ================================================================
   FUENTES
   ================================================================ */
export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  fallback: ["Inter", "Aptos", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/* ================================================================
   METADATA — Personalizar por proyecto
   ================================================================ */
export const metadata: Metadata = {
  title: "Next.js Template",
  description: "Next.js template with Atomic Design, Supabase, i18n, auth.",
};

/* ================================================================
   ROOT LAYOUT
   ================================================================ */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorantGaramond.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="box-border flex flex-col mx-auto my-0 min-h-full font-sans antialiased text-main relative bg-transparent">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Background />
          {children}
          <Toaster richColors position="top-center" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
