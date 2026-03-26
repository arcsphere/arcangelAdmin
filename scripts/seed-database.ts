/**
 * ARC 1 Admin — Database Seed Script
 *
 * Pushes all mock data from src/data/mock/admin-v3.ts into Supabase.
 * Run ONCE after creating the Supabase project and running the SQL migration.
 *
 * USAGE:
 *   1. Make sure .env.local exists with your Supabase credentials
 *   2. Run: npx tsx scripts/seed-database.ts
 *
 * Safe to re-run — uses upsert (INSERT ... ON CONFLICT DO UPDATE).
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Use service_role key for seed (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey);

// ─── Seed Data ───────────────────────────────────────────────────

const FEATURES = [
  { id: 'feat_now_window', title: 'The NOW Window', type: 'feature', domain: 'now', key: 'now_window_v3', configurable_props: { version: '3.0', default_timer: 25 }, is_active: true, status: 'published' },
  { id: 'feat_superpower', title: 'Superpower', type: 'widget', domain: 'shell', key: 'superpower_core', configurable_props: { strength: 1.0 }, is_active: true, status: 'published' },
  { id: 'feat_gym', title: 'The Gym', type: 'tool', domain: 'game', key: 'gym_connector', configurable_props: { modules: ['presence', 'focus'] }, is_active: true, status: 'published' },
];

const CHARACTERS = [
  {
    id: 'char_v1_void',
    title: 'The Primordial Dot',
    description: 'Initial state of ArcAngelOne. A single pulsating point of light.',
    body_config: { mesh: 'dot', scale: 1.0, glow: 0.5 },
    mind_config: { logic_type: 'state_machine', behavior_trees: 'v1_initial', emotional_palettes: ['neutral'], dialogue_resonance: { voice_id: 'angel_alpha', pitch_variance: 0.1, personality_bias: 'neutral' } },
    emotion_palette: ['#FFFFFF', '#A0A0A0'],
    discovery_palette: ['#818CF8'],
    activities_palette: ['#444444'],
    skills_palette: ['#222222'],
    wisdom_palette: ['#FFFFFF'],
    is_active: true,
    status: 'published',
  },
  {
    id: 'char_v1_identity',
    title: 'Integrated Persona',
    description: 'Level 3+ identity variant with morphing capabilities.',
    body_config: { mesh: 'fluid_orb', scale: 1.2, glow: 0.8 },
    mind_config: { logic_type: 'llm_hybrid', behavior_trees: 'v2_integrated', emotional_palettes: ['joy', 'focus', 'deep_calm'], dialogue_resonance: { voice_id: 'angel_beta', pitch_variance: 0.25, personality_bias: 'empathetic' } },
    emotion_palette: ['#818CF8', '#4ADE80', '#FBBF24'],
    discovery_palette: ['#818CF8', '#38BDF8'],
    activities_palette: ['#818CF8'],
    skills_palette: ['#4ADE80'],
    wisdom_palette: ['#FFFFFF', '#818CF8'],
    is_active: true,
    status: 'published',
  },
];

const NOW_CONFIGS = [
  {
    id: 'now_lite_v1',
    title: 'Lite Minimalism',
    mode: 'lite',
    timer_presets: [15, 25],
    features: { notes_enabled: false, tasks_enabled: true, progress_enabled: false, now_later_divider: false, audio_player: false, mindshare_enabled: false },
    layout_config: {},
    persistence_rules: {},
    is_active: true,
    status: 'published',
  },
  {
    id: 'now_focus_v1',
    title: 'Deep Work Protocol',
    mode: 'focus',
    timer_presets: [25, 45, 60],
    features: { notes_enabled: true, tasks_enabled: true, progress_enabled: true, now_later_divider: true, audio_player: false, mindshare_enabled: false },
    layout_config: {},
    persistence_rules: {},
    is_active: true,
    status: 'published',
  },
];

const THEMES = [
  {
    id: 'theme_void_standard',
    title: 'Void Standard',
    description: 'Deep dark base theme. The default ARC 1 experience.',
    shell_theme: 'void',
    now_theme: 'void',
    character_theme: 'void',
    motion_profile: 'fluid',
    palette_values: { accent: '#818CF8', background: '#050508', text: '#FFFFFF' },
    is_active: true,
    status: 'published',
  },
  {
    id: 'theme_deep_shadows',
    title: 'Deep Shadows',
    description: 'High-contrast variant with deeper blacks and cool purples.',
    shell_theme: 'deep_shadow',
    now_theme: 'deep_shadow',
    character_theme: 'void',
    motion_profile: 'slow',
    palette_values: { accent: '#A78BFA', background: '#020204', text: '#F4F4F5' },
    is_active: true,
    status: 'published',
  },
];

const LEVELS = [
  {
    level_number: -3,
    title: 'The Void',
    description: 'Initial state. The dot appears. Absolute silence.',
    character_config_id: 'char_v1_void',
    now_config_id: 'now_lite_v1',
    theme_config_id: 'theme_void_standard',
    enabled_game_ids: [],
    enabled_feature_ids: ['feat_now_window'],
    character_capabilities: [],
    now_capabilities: [],
    streak_target: 3,
    focus_units_required: 0,
    freeze_limit: 0,
    archangel_activities: ['observing'],
    intelligence_features: [],
    ceremony_config: { unlock_animation: 'none', soundscape_id: '', broadcast_message: '' },
    status: 'published',
  },
  {
    level_number: 3,
    title: 'Identity',
    description: 'The user begins to integrate. Character morphing unlocked.',
    character_config_id: 'char_v1_identity',
    now_config_id: 'now_focus_v1',
    theme_config_id: 'theme_void_standard',
    enabled_game_ids: ['game_box_breathing'],
    enabled_feature_ids: ['feat_now_window', 'feat_superpower'],
    character_capabilities: ['voice', 'eye_blink', 'morphing'],
    now_capabilities: ['timer_extend', 'chained_sessions'],
    streak_target: 14,
    focus_units_required: 1000,
    freeze_limit: 2,
    archangel_activities: ['talking', 'suggesting'],
    intelligence_features: ['basic_resonance'],
    ceremony_config: { unlock_animation: 'pulse_expand', soundscape_id: 'ascend_01', broadcast_message: 'Identity achieved.' },
    status: 'published',
  },
];

// Economy defaults
const ECONOMY_DEFAULTS = {
  id: 1,
  xp_label: 'XP',
  ap_label: 'AP',
  global_streak_target: 7,
  global_max_freezes: 3,
  freeze_currency: 'credits',
  streak_freeze_cost: 0,
  unit_multiplier: 1.0,
  event_rewards: {
    session_complete: { ap: 10, xp: 5 },
    streak_day: { ap: 25, xp: 10 },
    level_up: { ap: 100, xp: 50 },
    game_complete: { ap: 15, xp: 8 },
  },
};

// ─── Seed Runner ─────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Starting ARC 1 Admin database seed...\n');

  const operations = [
    { table: 'feature_configs',    data: FEATURES,     label: 'Features' },
    { table: 'arcangel_configs',   data: CHARACTERS,   label: 'ArcAngel Configs' },
    { table: 'now_window_configs', data: NOW_CONFIGS,  label: 'NOW Window Configs' },
    { table: 'theme_configs',      data: THEMES,       label: 'Themes' },
    { table: 'level_configs',      data: LEVELS,       label: 'Level Configs' },
  ];

  for (const op of operations) {
    const { error } = await supabase
      .from(op.table)
      .upsert(op.data, { onConflict: op.table === 'level_configs' ? 'level_number' : 'id' });

    if (error) {
      console.error(`❌ Failed to seed ${op.label}:`, error.message);
    } else {
      console.log(`✅ ${op.label} seeded (${op.data.length} records)`);
    }
  }

  // Seed economy config (single row, upsert by id=1)
  const { error: econError } = await supabase
    .from('economy_config')
    .upsert(ECONOMY_DEFAULTS, { onConflict: 'id' });

  if (econError) {
    console.error('❌ Failed to seed Economy Config:', econError.message);
  } else {
    console.log('✅ Economy Config seeded (1 record)');
  }

  console.log('\n🎉 Seed complete! Open your Supabase dashboard to verify.');
}

seed().catch(console.error);
