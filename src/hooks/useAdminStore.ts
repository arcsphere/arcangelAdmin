import { create } from 'zustand';
import {
  CharacterConfig, NowConfig, GameConfig, ThemeConfig,
  FeatureConfig, LevelConfigV3, AdminUserView, AdminSettings,
  EconomyConfig, AuditLogEntry, EntityType
} from '@/types/admin';
import {
  fetchCharacters, fetchNowConfigs, fetchGames, fetchThemes,
  fetchFeatures, fetchLevels, fetchUsers, fetchSettings,
  fetchAuditLogs, upsertEntity, deleteEntity as dbDeleteEntity,
  upsertSettings, insertAuditLog, updateUserLevel,
  softDeleteUser, hardDeleteUser,
  fetchEconomyConfig, upsertEconomyConfig,
} from '@/lib/supabase/db';

interface AdminStoreV3 {
  // --- Data Tables ---
  characters: CharacterConfig[];
  nowConfigs: NowConfig[];
  games: GameConfig[];
  themes: ThemeConfig[];
  features: FeatureConfig[];
  levels: LevelConfigV3[];
  users: AdminUserView[];
  settings: AdminSettings;
  economyConfig: EconomyConfig;
  auditLogs: AuditLogEntry[];

  // --- Loading State ---
  isLoading: boolean;
  error: string | null;

  // --- UI State ---
  isSidebarCollapsed: boolean;
  searchQuery: string;
  approvalQueue: string[];

  // --- Actions ---
  loadAll: () => Promise<void>;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;

  // CRUD Actions
  addEntity: (type: EntityType, data: any) => Promise<void>;
  updateEntity: (type: EntityType, id: string | number, data: any) => Promise<void>;
  deleteEntity: (type: EntityType, id: string | number) => Promise<void>;
  publishEntity: (type: EntityType, id: string | number) => Promise<void>;

  // User Actions
  forceUserLevel: (userId: string, level: number) => Promise<void>;
  deleteUser: (userId: string, hard?: boolean) => Promise<void>;
  updateSettings: (data: Partial<AdminSettings>) => Promise<void>;
  updateEconomyConfig: (data: Partial<EconomyConfig>) => Promise<void>;

  // Logging
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'created_at'>) => Promise<void>;
}

const DEFAULT_SETTINGS: AdminSettings = {
  maintenance_mode: false,
  system_broadcast: null,
  anonymous_name_generation_mode: 'sticky',
};

const DEFAULT_ECONOMY: EconomyConfig = {
  xp_label: 'XP',
  ap_label: 'AP',
  global_streak_target: 7,
  global_max_freezes: 3,
  freeze_currency: 'credits',
  streak_freeze_cost: 50,
  unit_multiplier: 1,
  event_rewards: {},
};

export const useAdminStore = create<AdminStoreV3>()((set, get) => ({
  characters: [],
  nowConfigs: [],
  games: [],
  themes: [],
  features: [],
  levels: [],
  users: [],
  settings: DEFAULT_SETTINGS,
  economyConfig: DEFAULT_ECONOMY,
  auditLogs: [],
  isLoading: false,
  error: null,
  isSidebarCollapsed: false,
  searchQuery: '',
  approvalQueue: [],

  // ── Load all data from Supabase ──────────────────────────────
  loadAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [chars, nows, games, themes, features, levels, users, settings, economy, logs] =
        await Promise.all([
          fetchCharacters().catch(() => []),
          fetchNowConfigs().catch(() => []),
          fetchGames().catch(() => []),
          fetchThemes().catch(() => []),
          fetchFeatures().catch(() => []),
          fetchLevels().catch(() => []),
          fetchUsers().catch(() => []),
          fetchSettings().catch(() => DEFAULT_SETTINGS),
          fetchEconomyConfig().catch(() => DEFAULT_ECONOMY),
          fetchAuditLogs().catch(() => []),
        ]);

      set({
        characters: chars as CharacterConfig[],
        nowConfigs: nows as NowConfig[],
        games: games as GameConfig[],
        themes: themes as ThemeConfig[],
        features: features as FeatureConfig[],
        levels: levels as LevelConfigV3[],
        users: users as AdminUserView[],
        settings: (settings as AdminSettings) ?? DEFAULT_SETTINGS,
        economyConfig: (economy as EconomyConfig) ?? DEFAULT_ECONOMY,
        auditLogs: logs as AuditLogEntry[],
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  // ── UI ───────────────────────────────────────────────────────
  toggleSidebar: () => set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // ── Add entity ───────────────────────────────────────────────
  addEntity: async (type, data) => {
    const key = getTableKey(type);
    const newItem = { ...data, updated_at: new Date().toISOString() };

    // Optimistic update
    set(state => ({ [key]: [...(state as any)[key], newItem] }));

    try {
      await upsertEntity(type, newItem);
      await get().addAuditLog({
        admin_id: 'admin_001',
        admin_name: 'Hrishita',
        entity_type: type,
        entity_id: (data.id ?? data.level_number ?? 'new').toString(),
        action: 'create',
        change_summary: `Created new ${type}: ${data.title ?? data.id ?? 'untitled'}`,
      });
    } catch (e: any) {
      // Roll back
      set(state => ({
        [key]: (state as any)[key].filter((item: any) =>
          (item.id ?? item.level_number) !== (data.id ?? data.level_number)
        ),
        error: e.message,
      }));
    }
  },

  // ── Update entity ────────────────────────────────────────────
  updateEntity: async (type, id, data) => {
    const key = getTableKey(type);
    const prevState = (get() as any)[key];

    const updatedTable = prevState.map((item: any) => {
      const itemId = type === 'level' ? item.level_number : item.id;
      if (itemId === id) return { ...item, ...data, updated_at: new Date().toISOString() };
      return item;
    });

    // Optimistic update
    set({ [key]: updatedTable });

    try {
      const updated = updatedTable.find((item: any) =>
        (type === 'level' ? item.level_number : item.id) === id
      );
      await upsertEntity(type, updated);
      await get().addAuditLog({
        admin_id: 'admin_001',
        admin_name: 'Hrishita',
        entity_type: type,
        entity_id: id.toString(),
        action: 'update',
        change_summary: `Updated ${type} ${id}`,
      });
    } catch (e: any) {
      // Roll back
      set({ [key]: prevState, error: e.message });
    }
  },

  // ── Delete entity ────────────────────────────────────────────
  deleteEntity: async (type, id) => {
    const key = getTableKey(type);
    const prevState = (get() as any)[key];

    // Optimistic update
    set(state => ({
      [key]: (state as any)[key].filter((item: any) =>
        (type === 'level' ? item.level_number : item.id) !== id
      ),
    }));

    try {
      await dbDeleteEntity(type, id);
      await get().addAuditLog({
        admin_id: 'admin_001',
        admin_name: 'Hrishita',
        entity_type: type,
        entity_id: id.toString(),
        action: 'delete',
        change_summary: `Deleted ${type} ${id}`,
      });
    } catch (e: any) {
      // Roll back
      set({ [key]: prevState, error: e.message });
    }
  },

  // ── Publish entity ───────────────────────────────────────────
  publishEntity: async (type, id) => {
    const key = getTableKey(type);
    const prevState = (get() as any)[key];

    const updatedTable = prevState.map((item: any) => {
      const itemId = type === 'level' ? item.level_number : item.id;
      if (itemId === id) return { ...item, status: 'published', updated_at: new Date().toISOString() };
      return item;
    });

    // Optimistic update
    set({ [key]: updatedTable });

    try {
      const updated = updatedTable.find((item: any) =>
        (type === 'level' ? item.level_number : item.id) === id
      );
      await upsertEntity(type, updated);
      await get().addAuditLog({
        admin_id: 'admin_001',
        admin_name: 'Hrishita',
        entity_type: type,
        entity_id: id.toString(),
        action: 'publish',
        change_summary: `Published ${type} ${id}`,
      });
    } catch (e: any) {
      set({ [key]: prevState, error: e.message });
    }
  },

  // ── User actions ─────────────────────────────────────────────
  forceUserLevel: async (userId, level) => {
    set(state => ({
      users: state.users.map(u => u.id === userId ? { ...u, level } : u),
    }));
    try {
      await updateUserLevel(userId, level);
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  deleteUser: async (userId, hard = false) => {
    const prev = get().users;
    set(state => ({ users: state.users.filter(u => u.id !== userId) }));
    try {
      if (hard) {
        await hardDeleteUser(userId);
      } else {
        await softDeleteUser(userId);
      }
    } catch (e: any) {
      set({ users: prev, error: e.message });
    }
  },

  // ── Settings ─────────────────────────────────────────────────
  updateSettings: async (data) => {
    const prev = get().settings;
    set(state => ({ settings: { ...state.settings, ...data } }));
    try {
      await upsertSettings({ ...get().settings });
    } catch (e: any) {
      set({ settings: prev, error: e.message });
    }
  },

  // ── Economy Config ───────────────────────────────────────────
  updateEconomyConfig: async (data) => {
    const prev = get().economyConfig;
    set(state => ({ economyConfig: { ...state.economyConfig, ...data } }));
    try {
      await upsertEconomyConfig({ ...get().economyConfig });
    } catch (e: any) {
      set({ economyConfig: prev, error: e.message });
    }
  },

  // ── Audit log ────────────────────────────────────────────────
  addAuditLog: async (entry) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `log_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    set(state => ({
      auditLogs: [newLog, ...state.auditLogs].slice(0, 100),
    }));
    try {
      await insertAuditLog(newLog);
    } catch {
      // Audit log failures are non-fatal — silently ignore
    }
  },
}));

function getTableKey(type: EntityType): string {
  switch (type) {
    case 'character':  return 'characters';
    case 'now_config': return 'nowConfigs';
    case 'game':       return 'games';
    case 'theme':      return 'themes';
    case 'feature':    return 'features';
    case 'level':      return 'levels';
    default:           return '';
  }
}
