// ============================================
// (admin)/layout.tsx — Layout del panel admin
// ============================================
// Protege las rutas admin: redirige al login si no hay sesión,
// o al home si el usuario no es admin.

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getNavbarData } from "@/services/navbar.data.service";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: LayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  // Mismo fetching que la NavBar pública
  const navbarData = await getNavbarData("es");

  return (
    <>
      <header className="fixed top-0 w-full z-50 py-3 backdrop-blur-xl bg-page/80 border-b border-border-subtle content-container">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/admin" className="text-sm font-semibold text-main hover:text-accent">
            ← Admin Panel
          </a>
          <a
            href="/"
            target="_blank"
            className="text-xs text-body hover:text-main hover:bg-hover px-3 py-2 rounded-md transition-all"
          >
            Ver sitio público ↗
          </a>
        </div>
      </header>
      {children}
    </>
  );
}
