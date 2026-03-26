/**
 * ARC 1 Admin — Zod Validation Schemas
 *
 * These schemas are the single source of truth for data validation.
 * They mirror src/types/admin.ts and are used by:
 *   1. react-hook-form via @hookform/resolvers/zod (form validation in drawers)
 *   2. Supabase upsert calls (validate before writing to DB)
 *   3. The "Save Draft" button on every entity editor
 *
 * When you add a new field to src/types/admin.ts, add it here too.
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────
// Shared Enums
// ─────────────────────────────────────────────────────────────────

export const ConfigStatusSchema = z.enum([
  'draft',
  'in_review',
  'published',
  'archived',
]);

export const AppTypeSchema = z.enum([
  'react_widget',
  'llm_engine',
  'godot_sim',
]);

export const AccessModeSchema = z.enum([
  'unlocked',
  'hidden',
  'locked',
]);

export const UnauthorizedBehaviorSchema = z.enum([
  'show_lock',
  'redirect',
  'vanish',
]);

// ─────────────────────────────────────────────────────────────────
// 1. ArcAngel (Character) Config
// ─────────────────────────────────────────────────────────────────

export const CharacterConfigSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional().default(''),
  body_config: z.record(z.any()).default({}),
  mind_config: z.object({
    logic_type: z.enum(['state_machine', 'llm_hybrid']),
    behavior_trees: z.string().default(''),
    emotional_palettes: z.array(z.string()).default([]),
    dialogue_resonance: z.object({
      voice_id: z.string(),
      pitch_variance: z.number().min(0).max(2),
      personality_bias: z.string(),
    }).optional(),
  }),
  emotion_palette: z.array(z.string()).default([]),
  discovery_palette: z.array(z.string()).default([]),
  activities_palette: z.array(z.string()).default([]),
  skills_palette: z.array(z.string()).default([]),
  wisdom_palette: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  status: ConfigStatusSchema.default('draft'),
  updated_at: z.string().datetime().optional(),
});

export type CharacterConfigInput = z.infer<typeof CharacterConfigSchema>;

// ─────────────────────────────────────────────────────────────────
// 2. NOW Window Config
// ─────────────────────────────────────────────────────────────────

export const NowConfigSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(100),
  mode: z.enum(['lite', 'focus', 'flow']),
  timer_presets: z.array(z.number().min(1).max(360)).default([15, 25, 45, 60]),
  features: z.object({
    notes_enabled: z.boolean().default(false),
    tasks_enabled: z.boolean().default(true),
    progress_enabled: z.boolean().default(true),
    now_later_divider: z.boolean().default(true),
    audio_player: z.boolean().default(false),
    mindshare_enabled: z.boolean().default(false),
  }),
  layout_config: z.record(z.any()).default({}),
  persistence_rules: z.record(z.any()).default({}),
  is_active: z.boolean().default(true),
  status: ConfigStatusSchema.default('draft'),
  updated_at: z.string().datetime().optional(),
});

export type NowConfigInput = z.infer<typeof NowConfigSchema>;

// ─────────────────────────────────────────────────────────────────
// 3. Game Config (Focus Gym)
// ─────────────────────────────────────────────────────────────────

export const GameConfigSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional().default(''),
  route: z.string().min(1, 'Route is required'),
  app_type: AppTypeSchema,
  access_mode: AccessModeSchema,
  unlock_level: z.number().min(-3).max(13),
  preload_metadata: z.record(z.any()).default({}),
  unauthorized_behavior: UnauthorizedBehaviorSchema,
  category: z.enum([
    'presence',
    'body',
    'emotion',
    'priority',
    'systems',
    'reflection',
    'llm_engine',
  ]),
  is_active: z.boolean().default(true),
  status: ConfigStatusSchema.default('draft'),
  updated_at: z.string().datetime().optional(),
});

export type GameConfigInput = z.infer<typeof GameConfigSchema>;

// ─────────────────────────────────────────────────────────────────
// 4. Theme Config
// ─────────────────────────────────────────────────────────────────

export const ThemeConfigSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional().default(''),
  shell_theme: z.string().default('void'),
  now_theme: z.string().default('void'),
  character_theme: z.string().default('void'),
  motion_profile: z.enum(['sharp', 'fluid', 'slow']).default('fluid'),
  palette_values: z.record(z.string()).default({}),
  is_active: z.boolean().default(true),
  status: ConfigStatusSchema.default('draft'),
  updated_at: z.string().datetime().optional(),
});

export type ThemeConfigInput = z.infer<typeof ThemeConfigSchema>;

// ─────────────────────────────────────────────────────────────────
// 5. Feature Config (Global Features / Widgets)
// ─────────────────────────────────────────────────────────────────

export const FeatureConfigSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(100),
  type: z.enum(['feature', 'widget', 'tool']),
  domain: z.enum(['now', 'character', 'game', 'shell']),
  key: z.string().min(1, 'Key is required').regex(
    /^[a-z0-9_]+$/,
    'Key must be lowercase with underscores only'
  ),
  configurable_props: z.record(z.any()).default({}),
  is_active: z.boolean().default(false),
  status: ConfigStatusSchema.default('draft'),
  updated_at: z.string().datetime().optional(),
});

export type FeatureConfigInput = z.infer<typeof FeatureConfigSchema>;

// ─────────────────────────────────────────────────────────────────
// 6. Level Config (Level Matrix — -3 to 13)
// ─────────────────────────────────────────────────────────────────

export const LevelConfigSchema = z.object({
  level_number: z.number().min(-3).max(13),
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional().default(''),
  character_config_id: z.string().default(''),
  now_config_id: z.string().default(''),
  theme_config_id: z.string().default(''),
  enabled_game_ids: z.array(z.string()).default([]),
  enabled_feature_ids: z.array(z.string()).default([]),
  character_capabilities: z.array(z.string()).default([]),
  now_capabilities: z.array(z.string()).default([]),
  streak_target: z.number().min(1).max(365).default(7),
  focus_units_required: z.number().min(0).default(0),
  freeze_limit: z.number().min(0).max(30).default(3),
  archangel_activities: z.array(z.string()).default([]),
  intelligence_features: z.array(z.string()).default([]),
  ceremony_config: z.object({
    unlock_animation: z.string().default(''),
    soundscape_id: z.string().default(''),
    broadcast_message: z.string().max(280).default(''),
  }).optional(),
  status: ConfigStatusSchema.default('draft'),
  updated_at: z.string().datetime().optional(),
});

export type LevelConfigInput = z.infer<typeof LevelConfigSchema>;

// ─────────────────────────────────────────────────────────────────
// 7. Economy Config (single-row table)
// ─────────────────────────────────────────────────────────────────

export const EconomyConfigSchema = z.object({
  // Currency labels (what the UI shows users)
  xp_label: z.string().default('XP'),
  ap_label: z.string().default('AP'),

  // Streak settings
  global_streak_target: z.number().min(1).max(365).default(7),
  global_max_freezes: z.number().min(0).max(30).default(3),

  // Freeze cost — which currency is spent on streak freezes
  // 'credits' = real money (IAP), 'ap' = earned attention points
  freeze_currency: z.enum(['credits', 'ap']).default('credits'),
  streak_freeze_cost: z.number().min(0).default(0),

  // Global difficulty scalar (1.0 = normal, 0.5 = easier, 2.0 = harder)
  unit_multiplier: z.number().min(0.1).max(10).default(1.0),

  // Event-reward map: { event_type: { ap: number, xp: number } }
  event_rewards: z.record(
    z.object({
      ap: z.number().min(0).default(0),
      xp: z.number().min(0).default(0),
    })
  ).default({}),

  updated_at: z.string().datetime().optional(),
});

export type EconomyConfigInput = z.infer<typeof EconomyConfigSchema>;

// ─────────────────────────────────────────────────────────────────
// 8. App Settings (single-row table)
// ─────────────────────────────────────────────────────────────────

export const AppSettingsSchema = z.object({
  maintenance_mode: z.boolean().default(false),
  system_broadcast: z.string().max(280).nullable().default(null),
  anonymous_name_generation_mode: z.enum(['random', 'sticky']).default('sticky'),
  updated_at: z.string().datetime().optional(),
});

export type AppSettingsInput = z.infer<typeof AppSettingsSchema>;
