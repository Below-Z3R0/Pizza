// ============================================
// content.service.ts
// ============================================
// Wrapper genérico para la RPC get_translation_by_key.
// Usado por todos los servicios de datos (navbar, footer, secciones).
// ============================================

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Obtiene el contenido de un bloque de traducción desde Supabase.
 *
 * @param supabase - Cliente Supabase (server o browser)
 * @param section  - Key del content_block (ej: 'home_hero_section')
 * @param language - Código de idioma ('es' | 'en')
 * @returns El JSON del contenido parseado
 * @throws Si hay error de BD
 */
export const getContent = async (
  supabase: SupabaseClient,
  section: string,
  language: string = "es"
) => {
  const { data, error } = await supabase.rpc("get_translation_by_key", {
    block_key: section,
    lang: language,
  });

  if (error) {
    console.error(`Error de BD en ${section}:`, error.message);
    throw error;
  }

  return data;
};
