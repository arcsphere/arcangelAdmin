-- ─────────────────────────────────────────────────────────────────
-- ARC 1 Admin Panel — Initial Database Schema
-- Migration 001: All core config tables
--
-- HOW TO RUN:
-- 1. Go to your Supabase project dashboard
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Paste this entire file and click "Run"
-- ─────────────────────────────────────────────────────────────────

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────
-- 1. arcangel_configs  (ArcAngel / Character entity)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS arcangel_configs (
  id                  TEXT PRIMARY KEY,
  title               TEXT NOT NULL,
  description         TEXT DEFAULT '',
  body_config         JSONB DEFAULT '{}',
  mind_config         JSONB DEFAULT '{}',
  emotion_palette     TEXT[] DEFAULT '{}',
  discovery_palette   TEXT[] DEFAULT '{}',
  activities_palette  TEXT[] DEFAULT '{}',
  skills_palette      TEXT[] DEFAULT '{}',
  wisdom_palette      TEXT[] DEFAULT '{}',
  is_active           BOOLEAN DEFAULT true,
  status              TEXT DEFAULT 'draft' CHECK (status IN ('draft','in_review','published','archived')),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 2. now_window_configs  (NOW Window / Session templates)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS now_window_configs (
  id                  TEXT PRIMARY KEY,
  title               TEXT NOT NULL,
  mode                TEXT NOT NULL CHECK (mode IN ('lite','focus','flow')),
  timer_presets       INTEGER[] DEFAULT '{15,25,45,60}',
  features            JSONB DEFAULT '{}',
  layout_config       JSONB DEFAULT '{}',
  persistence_rules   JSONB DEFAULT '{}',
  is_active           BOOLEAN DEFAULT true,
  status              TEXT DEFAULT 'draft' CHECK (status IN ('draft','in_review','published','archived')),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 3. game_configs  (Focus Gym games)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS game_configs (
  id                      TEXT PRIMARY KEY,
  title                   TEXT NOT NULL,
  description             TEXT DEFAULT '',
  route                   TEXT NOT NULL,
  app_type                TEXT DEFAULT 'react_widget' CHECK (app_type IN ('react_widget','llm_engine','godot_sim')),
  access_mode             TEXT DEFAULT 'locked' CHECK (access_mode IN ('unlocked','hidden','locked')),
  unlock_level            INTEGER DEFAULT 0 CHECK (unlock_level BETWEEN -3 AND 13),
  preload_metadata        JSONB DEFAULT '{}',
  unauthorized_behavior   TEXT DEFAULT 'show_lock' CHECK (unauthorized_behavior IN ('show_lock','redirect','vanish')),
  category                TEXT DEFAULT 'presence' CHECK (category IN ('presence','body','emotion','priority','systems','reflection','llm_engine')),
  is_active               BOOLEAN DEFAULT true,
  status                  TEXT DEFAULT 'draft' CHECK (status IN ('draft','in_review','published','archived')),
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 4. theme_configs
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS theme_configs (
  id                TEXT PRIMARY KEY,
  title             TEXT NOT NULL,
  description       TEXT DEFAULT '',
  shell_theme       TEXT DEFAULT 'void',
  now_theme         TEXT DEFAULT 'void',
  character_theme   TEXT DEFAULT 'void',
  motion_profile    TEXT DEFAULT 'fluid' CHECK (motion_profile IN ('sharp','fluid','slow')),
  palette_values    JSONB DEFAULT '{}',
  is_active         BOOLEAN DEFAULT true,
  status            TEXT DEFAULT 'draft' CHECK (status IN ('draft','in_review','published','archived')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 5. feature_configs  (Global Features / Widgets)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feature_configs (
  id                  TEXT PRIMARY KEY,
  title               TEXT NOT NULL,
  type                TEXT DEFAULT 'feature' CHECK (type IN ('feature','widget','tool')),
  domain              TEXT DEFAULT 'now' CHECK (domain IN ('now','character','game','shell')),
  key                 TEXT UNIQUE NOT NULL,
  configurable_props  JSONB DEFAULT '{}',
  is_active           BOOLEAN DEFAULT false,
  status              TEXT DEFAULT 'draft' CHECK (status IN ('draft','in_review','published','archived')),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 6. level_configs  (Level Matrix — -3 to 13, 17 levels)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS level_configs (
  level_number            INTEGER PRIMARY KEY CHECK (level_number BETWEEN -3 AND 13),
  title                   TEXT NOT NULL,
  description             TEXT DEFAULT '',
  character_config_id     TEXT REFERENCES arcangel_configs(id) ON DELETE SET NULL,
  now_config_id           TEXT REFERENCES now_window_configs(id) ON DELETE SET NULL,
  theme_config_id         TEXT REFERENCES theme_configs(id) ON DELETE SET NULL,
  enabled_game_ids        TEXT[] DEFAULT '{}',
  enabled_feature_ids     TEXT[] DEFAULT '{}',
  character_capabilities  TEXT[] DEFAULT '{}',
  now_capabilities        TEXT[] DEFAULT '{}',
  streak_target           INTEGER DEFAULT 7 CHECK (streak_target > 0),
  focus_units_required    INTEGER DEFAULT 0 CHECK (focus_units_required >= 0),
  freeze_limit            INTEGER DEFAULT 3 CHECK (freeze_limit >= 0),
  archangel_activities    TEXT[] DEFAULT '{}',
  intelligence_features   TEXT[] DEFAULT '{}',
  ceremony_config         JSONB DEFAULT '{}',
  status                  TEXT DEFAULT 'draft' CHECK (status IN ('draft','in_review','published','archived')),
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 7. config_versions  (Immutable publish snapshots — for rollback)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS config_versions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type     TEXT NOT NULL,         -- 'arcangel' | 'now_window' | 'game' | 'theme' | 'feature' | 'level'
  entity_id       TEXT NOT NULL,         -- The ID of the entity this snapshot belongs to
  version         INTEGER NOT NULL,
  snapshot        JSONB NOT NULL,        -- Full JSON copy of the entity at time of publish
  published_by    TEXT NOT NULL,         -- Admin email
  published_at    TIMESTAMPTZ DEFAULT NOW(),
  rollback_of     UUID REFERENCES config_versions(id) ON DELETE SET NULL  -- Set if this was a rollback action
);

-- Index for fast version history lookups
CREATE INDEX IF NOT EXISTS idx_config_versions_entity ON config_versions(entity_type, entity_id, version DESC);

-- ─────────────────────────────────────────────────────────────────
-- 8. economy_config  (Single-row table)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS economy_config (
  id                      INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- Enforce single row
  xp_label                TEXT DEFAULT 'XP',
  ap_label                TEXT DEFAULT 'AP',
  global_streak_target    INTEGER DEFAULT 7 CHECK (global_streak_target > 0),
  global_max_freezes      INTEGER DEFAULT 3 CHECK (global_max_freezes >= 0),
  freeze_currency         TEXT DEFAULT 'credits' CHECK (freeze_currency IN ('credits','ap')),
  streak_freeze_cost      INTEGER DEFAULT 0 CHECK (streak_freeze_cost >= 0),
  unit_multiplier         NUMERIC(4,2) DEFAULT 1.0 CHECK (unit_multiplier > 0),
  event_rewards           JSONB DEFAULT '{}',
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the single economy row
INSERT INTO economy_config (id) VALUES (1) ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- 9. app_settings  (Single-row table)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS app_settings (
  id                              INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  maintenance_mode                BOOLEAN DEFAULT false,
  system_broadcast                TEXT,
  anonymous_name_generation_mode  TEXT DEFAULT 'sticky' CHECK (anonymous_name_generation_mode IN ('random','sticky')),
  updated_at                      TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the single settings row
INSERT INTO app_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- 10. audit_logs
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id        TEXT NOT NULL,
  admin_name      TEXT NOT NULL,
  entity_type     TEXT NOT NULL,
  entity_id       TEXT NOT NULL,
  action          TEXT NOT NULL CHECK (action IN ('create','update','publish','archive','delete','rollback')),
  change_summary  TEXT NOT NULL,
  previous_value  JSONB,
  new_value       JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index for dashboard recent activity feed
CREATE INDEX IF NOT EXISTS idx_audit_logs_recent ON audit_logs(created_at DESC);

-- ─────────────────────────────────────────────────────────────────
-- 11. updated_at auto-update trigger (applies to all config tables)
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_arcangel_updated_at    BEFORE UPDATE ON arcangel_configs    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_now_window_updated_at  BEFORE UPDATE ON now_window_configs  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_game_updated_at        BEFORE UPDATE ON game_configs        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_theme_updated_at       BEFORE UPDATE ON theme_configs       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_feature_updated_at     BEFORE UPDATE ON feature_configs     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_level_updated_at       BEFORE UPDATE ON level_configs       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_economy_updated_at     BEFORE UPDATE ON economy_config      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_settings_updated_at   BEFORE UPDATE ON app_settings        FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- 12. Row Level Security (Admin-only access)
-- ─────────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE arcangel_configs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE now_window_configs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_configs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_configs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_configs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_configs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_versions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE economy_config      ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs          ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated admin users
-- (The middleware enforces the email whitelist — Supabase auth just checks they are logged in)
CREATE POLICY "admin_all_arcangel"   ON arcangel_configs    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_now"        ON now_window_configs  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_games"      ON game_configs        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_themes"     ON theme_configs       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_features"   ON feature_configs     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_levels"     ON level_configs       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_versions"   ON config_versions     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_economy"    ON economy_config      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_settings"   ON app_settings        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_audit"      ON audit_logs          FOR ALL TO authenticated USING (true) WITH CHECK (true);
