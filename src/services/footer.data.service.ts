// ============================================
// footer.data.service.ts
// ============================================
// Obtiene los datos del Footer desde Supabase.
// ============================================

import { createClient } from "@/utils/supabase/server";
import { getContent } from "./sections/content.service";

export const getFooterData = async (lang: string = "es") => {
  const supabase = await createClient();
  return getContent(supabase, "footer", lang);
};
