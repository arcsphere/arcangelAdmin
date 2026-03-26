/**
 * ============================================================
 * ARC 1 Admin Panel v3 — Type Definitions
 * Canonical data structures for the Central Authority.
 * Strictly JSONable and serializable.
 * ============================================================
 */

export type AppType = 'react_widget' | 'llm_engine' | 'godot_sim';
export type AccessMode = 'unlocked' | 'hidden' | 'locked';
export type UnauthorizedBehavior = 'show_lock' | 'redirect' | 'vanish';
export type ConfigStatus = 'draft' | 'in_review' | 'published' | 'archived';
export type EntityType = 'character' | 'now_config' | 'game' | 'theme' | 'feature' | 'level';

/** 1. Character Configuration (ArcAngel) */
export interface CharacterConfig {
  id: string;
  title: string;
  description: string;
  body_config: Record<string, any>;
  mind_config: {
    logic_type: 'state_machine' | 'llm_hybrid';
    behavior_trees: string;
    emotional_palettes: string[];
    dialogue_resonance?: {
      voice_id: string;
      pitch_variance: number;
      personality_bias: string;
    };
  };
  emotion_palette: string[];
  discovery_palette: string[];
  activities_palette: string[];
  skills_palette: string[];
  wisdom_palette: string[];
  is_active: boolean;
  status: ConfigStatus;
  created_at?: string;
  updated_at: string;
}

/** 2. NOW Window Configuration */
export interface NowConfig {
  id: string;
  title: string;
  mode: 'lite' | 'focus' | 'flow';
  timer_presets: number[];
  features: {
    notes_enabled: boolean;
    tasks_enabled: boolean;
    progress_enabled: boolean;
    now_later_divider: boolean;
    audio_player: boolean;
    mindshare_enabled: boolean;
  };
  layout_config: Record<string, any>;
  persistence_rules: Record<string, any>;
  is_active: boolean;
  status: ConfigStatus;
  created_at?: string;
  updated_at: string;
}

/** 3. Game Configuration (Focus Gym) */
export interface GameConfig {
  id: string;
  title: string;
  description: string;
  route: string;
  app_type: AppType;
  access_mode: AccessMode;
  unlock_level: number;
  preload_metadata: Record<string, any>;
  unauthorized_behavior: UnauthorizedBehavior;
  category: 'presence' | 'body' | 'emotion' | 'priority' | 'systems' | 'reflection' | 'llm_engine';
  is_active: boolean;
  status: ConfigStatus;
  created_at?: string;
  updated_at: string;
}

/** 4. Theme Configuration */
export interface ThemeConfig {
  id: string;
  title: string;
  description: string;
  shell_theme: string;
  now_theme: string;
  character_theme: string;
  motion_profile: 'sharp' | 'fluid' | 'slow';
  palette_values: Record<string, string>;
  is_active: boolean;
  status: ConfigStatus;
  created_at?: string;
  updated_at: string;
}

/** 5. Feature/Widget Configuration */
export interface FeatureConfig {
  id: string;
  title: string;
  type: 'feature' | 'widget' | 'tool';
  domain: 'now' | 'character' | 'game' | 'shell';
  key: string;
  configurable_props: Record<string, any>;
  is_active: boolean;
  status: ConfigStatus;
  created_at?: string;
  updated_at: string;
}

/** 6. Level Configuration Matrix */
export interface LevelConfigV3 {
  level_number: number;          // -3 to 13 — primary key in Supabase
  title: string;
  description: string;
  character_config_id: string;
  now_config_id: string;
  theme_config_id: string;
  enabled_game_ids: string[];
  enabled_feature_ids: string[];
  character_capabilities: string[];
  now_capabilities: string[];
  streak_target: number;
  focus_units_required: number;
  freeze_limit: number;
  archangel_activities: string[];
  intelligence_features: string[];
  ceremony_config?: {
    unlock_animation: string;
    soundscape_id: string;
    broadcast_message: string;
  };
  status: ConfigStatus;
  created_at?: string;
  updated_at: string;
}

/** 7. App Settings (app_settings table — single row id=1) */
export interface AdminSettings {
  maintenance_mode: boolean;
  system_broadcast: string | null;
  anonymous_name_generation_mode: 'random' | 'sticky';
  updated_at?: string;
}

/** 8. Economy Config (economy_config table — single row id=1) */
export interface EconomyConfig {
  xp_label: string;
  ap_label: string;
  global_streak_target: number;
  global_max_freezes: number;
  freeze_currency: 'credits' | 'ap';
  streak_freeze_cost: number;
  unit_multiplier: number;
  event_rewards: Record<string, any>;
  updated_at?: string;
}

/** 9. User Profile (profiles table) */
export interface AdminUserView {
  id: string;                    // uuid — primary key in Supabase
  display_name: string | null;
  anonymous_name: string | null;
  is_guest: boolean;             // true = anonymous user
  level: number;
  focus_units: number;
  current_streak: number;
  longest_streak: number;
  streak_freezes_used: number;
  last_active_date: string | null; // date string e.g. '2026-03-25'
  preferences: Record<string, any>;
  onboarding_complete: boolean;
  created_at?: string;
  updated_at?: string;
}

/** 10. Audit Trail Entry (audit_logs table) */
export interface AuditLogEntry {
  id: string;
  admin_id: string;
  admin_name: string;
  entity_type: EntityType;
  entity_id: string;
  action: 'create' | 'update' | 'publish' | 'archive' | 'delete';
  change_summary: string;
  previous_value?: any;
  new_value?: any;
  created_at: string;            // Supabase column is created_at (not timestamp)
}
