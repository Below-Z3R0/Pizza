// ============================================
// app/(public)/auth/route/page.tsx
// ============================================
// Página post-login: si el usuario es admin, redirige al admin.
// Si no, redirige al home. Si no hay sesión, redirige al login.

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AuthRoutePage() {
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

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  redirect("/");
}
