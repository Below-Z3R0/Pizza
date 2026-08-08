-- ================================================================
-- setup-database.sql
-- ================================================================
-- Script para configurar la base de datos en Supabase.
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ================================================================

-- ================================================================
-- 1. LANGUAGES
-- ================================================================
CREATE TABLE IF NOT EXISTS languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  create_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE languages IS 'Idiomas disponibles en el sitio';

INSERT INTO languages (code, name, is_default) VALUES
  ('es', 'Español', true),
  ('en', 'English', false)
ON CONFLICT (code) DO NOTHING;

-- ================================================================
-- 2. CONTENT BLOCKS
-- ================================================================
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  owner TEXT NOT NULL DEFAULT 'admin',
  description TEXT,
  create_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE content_blocks IS 'Bloques de contenido traducibles del sitio';
COMMENT ON COLUMN content_blocks.key IS 'Identificador único (ej: navbar, footer, home_hero_section)';

-- ================================================================
-- 3. TRANSLATIONS
-- ================================================================
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID REFERENCES content_blocks(id) ON DELETE CASCADE,
  lang_code TEXT REFERENCES languages(code) ON DELETE CASCADE,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(block_id, lang_code)
);

COMMENT ON TABLE translations IS 'Traducciones de cada content_block por idioma';

CREATE INDEX IF NOT EXISTS idx_translations_lang_block ON translations(lang_code, block_id);

-- ================================================================
-- 4. RPC: get_translation_by_key
-- ================================================================
CREATE OR REPLACE FUNCTION get_translation_by_key(
  block_key TEXT,
  lang TEXT
) RETURNS JSONB AS $$
  SELECT t.content
  FROM translations t
  INNER JOIN content_blocks cb ON cb.id = t.block_id
  WHERE cb.key = block_key AND t.lang_code = lang
  LIMIT 1;
$$ LANGUAGE sql STABLE;

COMMENT ON FUNCTION get_translation_by_key IS 'Obtiene la traducción de un bloque por key + idioma';

-- ================================================================
-- 5. PROFILES
-- ================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username JSONB,
  role TEXT DEFAULT 'client',
  email VARCHAR,
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE profiles IS 'Perfiles de usuario. username es JSONB para strings multilingüe';

-- ================================================================
-- 6. TRIGGER: auto-crear perfil al registrarse
-- ================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    to_jsonb(COALESCE(NEW.raw_user_meta_data->>'display_name', 'Nuevo Usuario')),
    NEW.email,
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================================================
-- 7. RLS: Row Level Security
-- ================================================================
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "public_read_access" ON content_blocks FOR SELECT USING (true);
CREATE POLICY "public_read_access" ON profiles FOR SELECT USING (true);
CREATE POLICY "public_read_access" ON translations FOR SELECT USING (true);

-- ================================================================
-- 8. SEED DATA — Navbar y Footer
-- ================================================================
INSERT INTO content_blocks (key, owner, description) VALUES
  ('navbar', 'admin', 'Barra de navegación principal'),
  ('footer', 'admin', 'Footer del sitio')
ON CONFLICT (key) DO NOTHING;

-- Navbar ES
INSERT INTO translations (block_id, lang_code, content) VALUES
  ((SELECT id FROM content_blocks WHERE key = 'navbar'), 'es',
   '{"links":[{"id":"#inicio","name":"Inicio"},{"id":"#servicios","name":"Servicios"},{"id":"#contacto","name":"Contacto"}],"button":"Empezar"}')
ON CONFLICT (block_id, lang_code) DO NOTHING;

-- Navbar EN
INSERT INTO translations (block_id, lang_code, content) VALUES
  ((SELECT id FROM content_blocks WHERE key = 'navbar'), 'en',
   '{"links":[{"id":"#inicio","name":"Home"},{"id":"#servicios","name":"Services"},{"id":"#contacto","name":"Contact"}],"button":"Get Started"}')
ON CONFLICT (block_id, lang_code) DO NOTHING;

-- Footer ES
INSERT INTO translations (block_id, lang_code, content) VALUES
  ((SELECT id FROM content_blocks WHERE key = 'footer'), 'es',
   '{"description":"Next.js template with Atomic Design, Supabase, auth, and i18n.","eslogan":"Construido con las mejores prácticas para proyectos modernos.","legal":"© 2026 Next.js Template. MIT License.","email":"hello@template.com","links":[{"id":"#inicio","name":"Inicio"},{"id":"#servicios","name":"Servicios"},{"id":"#contacto","name":"Contacto"}]}')
ON CONFLICT (block_id, lang_code) DO NOTHING;

-- Footer EN
INSERT INTO translations (block_id, lang_code, content) VALUES
  ((SELECT id FROM content_blocks WHERE key = 'footer'), 'en',
   '{"description":"Next.js template with Atomic Design, Supabase, auth, and i18n.","eslogan":"Built with best practices for modern projects.","legal":"© 2026 Next.js Template. MIT License.","email":"hello@template.com","links":[{"id":"#inicio","name":"Home"},{"id":"#servicios","name":"Services"},{"id":"#contacto","name":"Contact"}]}')
ON CONFLICT (block_id, lang_code) DO NOTHING;
