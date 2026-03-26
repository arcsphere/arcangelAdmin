import { 
  CharacterConfig, NowConfig, GameConfig, ThemeConfig, 
  FeatureConfig, LevelConfigV3, AdminUserView, AdminSettings 
} from '@/types/admin';

/** MOCK FEATURES */
export const MOCK_FEATURES: FeatureConfig[] = [
  {
    id: 'feat_now_window',
    title: 'The NOW Window',
    type: 'feature',
    domain: 'now',
    key: 'now_window_v3',
    configurable_props: { version: '3.0', default_timer: 25 },
    is_active: true,
    status: 'published',
    updated_at: '2026-03-01T12:00:00Z'
  },
  {
    id: 'feat_superpower',
    title: 'Superpower',
    type: 'widget',
    domain: 'shell',
    key: 'superpower_core',
    configurable_props: { strength: 1.0 },
    is_active: true,
    status: 'published',
    updated_at: '2026-03-15T12:00:00Z'
  },
  {
    id: 'feat_gym',
    title: 'The Gym',
    type: 'tool',
    domain: 'game',
    key: 'gym_connector',
    configurable_props: { modules: ['presence', 'focus'] },
    is_active: true,
    status: 'published',
    updated_at: '2026-03-01T12:00:00Z'
  }
];

/** MOCK CHARACTERS */
export const MOCK_CHARACTERS: CharacterConfig[] = [
  {
    id: 'char_v1_void',
    title: 'The Primordial Dot',
    description: 'Initial state of ArcAngelOne. A single pulsating point of light.',
    body_config: { mesh: 'dot', scale: 1.0, glow: 0.5 },
    mind_config: { 
      logic_type: 'state_machine',
      behavior_trees: 'v1_initial',
      emotional_palettes: ['neutral'],
      dialogue_resonance: {
        voice_id: 'angel_alpha',
        pitch_variance: 0.1,
        personality_bias: 'neutral'
      }
    },
    emotion_palette: ['#FFFFFF', '#A0A0A0'],
    discovery_palette: ['#818CF8'],
    activities_palette: ['#444444'],
    skills_palette: ['#222222'],
    wisdom_palette: ['#FFFFFF'],
    is_active: true,
    status: 'published',
    updated_at: '2026-03-01T12:00:00Z'
  },
  {
    id: 'char_v1_identity',
    title: 'Integrated Persona',
    description: 'Level 3+ identity variant with morphing capabilities.',
    body_config: { mesh: 'fluid_orb', scale: 1.2, glow: 0.8 },
    mind_config: { 
      logic_type: 'llm_hybrid',
      behavior_trees: 'v2_integrated',
      emotional_palettes: ['joy', 'focus', 'deep_calm'],
      dialogue_resonance: {
        voice_id: 'angel_beta',
        pitch_variance: 0.25,
        personality_bias: 'empathetic'
      }
    },
    emotion_palette: ['#818CF8', '#F472B6', '#6BCB77'],
    discovery_palette: ['#FFD700'],
    activities_palette: ['#6366F1'],
    skills_palette: ['#4F46E5'],
    wisdom_palette: ['#E0E7FF'],
    is_active: true,
    status: 'published',
    updated_at: '2026-03-15T12:00:00Z'
  }
];

/** MOCK NOW CONFIGS */
export const MOCK_NOW_CONFIGS: NowConfig[] = [
  {
    id: 'now_lite_v3',
    title: 'Lite Minimalism',
    mode: 'lite',
    timer_presets: [5, 15, 25],
    features: {
      notes_enabled: false,
      tasks_enabled: false,
      progress_enabled: true,
      now_later_divider: false,
      audio_player: true,
      mindshare_enabled: false
    },
    layout_config: { grid: 'centered', spacing: 'spacious' },
    persistence_rules: { sync_interval: 300, local_only: true },
    is_active: true,
    status: 'published',
    updated_at: '2026-03-01T12:00:00Z'
  },
  {
    id: 'now_focus_v3',
    title: 'Deep Work Protocol',
    mode: 'focus',
    timer_presets: [15, 25, 45, 60],
    features: {
      notes_enabled: true,
      tasks_enabled: true,
      progress_enabled: true,
      now_later_divider: true,
      audio_player: true,
      mindshare_enabled: true
    },
    layout_config: { grid: 'split', spacing: 'tight' },
    persistence_rules: { sync_interval: 60, local_only: false },
    is_active: true,
    status: 'published',
    updated_at: '2026-03-01T12:00:00Z'
  }
];

/** MOCK THEMES */
export const MOCK_THEMES: ThemeConfig[] = [
  {
    id: 'theme_void_standard',
    title: 'Void Standard',
    description: 'The default high-contrast deep space theme.',
    shell_theme: 'void',
    now_theme: 'void',
    character_theme: 'void',
    motion_profile: 'fluid',
    palette_values: { '--bg-primary': '#0C0C0E', '--accent': '#818CF8' },
    is_active: true,
    status: 'published',
    updated_at: '2026-03-01T12:00:00Z'
  },
  {
    id: 'theme_darkness_v3',
    title: 'The Deep Shadows',
    description: 'Season 2 ultra-dark mode.',
    shell_theme: 'darkness',
    now_theme: 'darkness',
    character_theme: 'darkness',
    motion_profile: 'slow',
    palette_values: { '--bg-primary': '#050505', '--accent': '#FFFFFF' },
    is_active: true,
    status: 'published',
    updated_at: '2026-03-01T12:00:00Z'
  }
];

/** MOCK GAMES (SAMPLE OF 50) */
export const MOCK_GAMES: GameConfig[] = [
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    description: 'Regulate your nervous system with 4-square breathing.',
    route: '/gym/box-breathing',
    app_type: 'react_widget',
    access_mode: 'unlocked',
    unlock_level: 0,
    preload_metadata: { assets: ['breath_guide.svg'] },
    unauthorized_behavior: 'show_lock',
    category: 'body',
    is_active: true,
    status: 'published',
    updated_at: '2026-03-01T12:00:00Z'
  },
  {
    id: 'eisenhower-matrix',
    title: 'The Eisenhower Slice',
    description: 'Categorize your current primary task by urgency and importance.',
    route: '/gym/eisenhower',
    app_type: 'llm_engine',
    access_mode: 'locked',
    unlock_level: 8,
    preload_metadata: { framework: 'eisenhower_v1' },
    unauthorized_behavior: 'show_lock',
    category: 'llm_engine',
    is_active: true,
    status: 'published',
    updated_at: '2026-03-10T12:00:00Z'
  }
];

/** MOCK LEVELS (-3 TO 13) */
export const MOCK_LEVELS: LevelConfigV3[] = [
  {
    level_number: -3,
    title: 'The Void',
    description: 'He barely exists. So do you, here.',
    character_config_id: 'char_v1_void',
    now_config_id: 'now_lite_v3',
    theme_config_id: 'theme_void_standard',
    enabled_game_ids: [],
    enabled_feature_ids: ['feat_now_window'],
    character_capabilities: ['pulsate'],
    now_capabilities: ['timer_start'],
    streak_target: 3,
    focus_units_required: 0,
    freeze_limit: 0,
    archangel_activities: ['observing'],
    intelligence_features: [],
    ceremony_config: {
      unlock_animation: 'none',
      soundscape_id: 'silence',
      broadcast_message: 'Emergence.'
    },
    status: 'published',
    updated_at: '2026-03-01T12:00:00Z'
  },
  {
    level_number: 3,
    title: 'Identity',
    description: 'Your ArcAngelOne is not the same as anyone else\'s.',
    character_config_id: 'char_v1_identity',
    now_config_id: 'now_focus_v3',
    theme_config_id: 'theme_void_standard',
    enabled_game_ids: ['box-breathing'],
    enabled_feature_ids: ['feat_now_window', 'feat_superpower'],
    character_capabilities: ['voice', 'morph'],
    now_capabilities: ['timer_extend', 'task_prioritize'],
    streak_target: 14,
    focus_units_required: 1000,
    freeze_limit: 2,
    archangel_activities: ['talking', 'suggesting'],
    intelligence_features: ['basic_resonance'],
    ceremony_config: {
      unlock_animation: 'glow_wave',
      soundscape_id: 'ambient_resonance',
      broadcast_message: 'An identity emerges.'
    },
    status: 'published',
    updated_at: '2026-03-20T12:00:00Z'
  }
];

/** MOCK USERS */
export const MOCK_USERS: AdminUserView[] = [
  {
    user_id: 'u_001',
    display_name: 'Pensive Wolf',
    is_anonymous: true,
    current_level: 2,
    last_active: '2026-03-24T14:30:00Z',
    status: 'online',
    activity_summary: {
      total_focus_minutes: 450,
      total_units_earned: 1200,
      current_streak: 8
    }
  },
  {
    user_id: 'u_002',
    display_name: 'Resilient Crow',
    is_anonymous: true,
    current_level: 10,
    last_active: '2026-03-23T18:45:00Z',
    status: 'offline',
    activity_summary: {
      total_focus_minutes: 2400,
      total_units_earned: 8500,
      current_streak: 42
    }
  }
];

/** MOCK SETTINGS */
export const MOCK_SETTINGS: AdminSettings = {
  streak_freeze_cost: 500,
  unit_multiplier: 1.0,
  maintenance_mode: false,
  system_broadcast: 'Welcome to Arc 1. Season 2 emergence begins soon.',
  anonymous_name_generation_mode: 'sticky'
};
