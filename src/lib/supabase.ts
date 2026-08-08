// ================================================================
// supabase.ts — Cliente Supabase unificado
// Schema: pizza
// ================================================================
import { createClient } from "@/utils/supabase/client";

export const supabase = createClient();
