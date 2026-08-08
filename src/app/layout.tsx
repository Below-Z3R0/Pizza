import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/hooks/themeProvider";

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

export const metadata: Metadata = {
  title: "Barrio Pizza — Dashboard de Compras",
  description: "Dashboard inteligente para revisar órdenes de compra de insumos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorantGaramond.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="box-border flex flex-col mx-auto my-0 min-h-full font-sans antialiased text-main relative bg-transparent">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
