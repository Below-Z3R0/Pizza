// ============================================
// navbar.data.service.ts
// ============================================
// Obtiene los datos del Navbar desde Supabase.
// ============================================

import { createClient } from "@/utils/supabase/server";
import { getContent } from "./sections/content.service";

export const getNavbarData = async (lang: string = "es") => {
  const supabase = await createClient();
  return getContent(supabase, "navbar", lang);
};
