// ============================================
// (public)/layout.tsx — Layout del sitio público
// ============================================
// Este layout envuelve todas las páginas públicas con Navbar + Footer.
// Hace fetch server-side de los datos de navegación.

import { cookies } from "next/headers";
import { Navbar } from "@/components/organisms/NavBar";
import { Footer } from "@/components/organisms/FooterSection";
import { getNavbarData } from "@/services/navbar.data.service";
import { getFooterData } from "@/services/footer.data.service";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const currentLang = cookieStore.get("lang")?.value || "es";

  const [navbarData, footerData] = await Promise.all([
    getNavbarData(currentLang),
    getFooterData(currentLang),
  ]);

  return (
    <>
      <Navbar initialData={navbarData} lang={currentLang} />
      {children}
      <Footer data={footerData} />
    </>
  );
}
