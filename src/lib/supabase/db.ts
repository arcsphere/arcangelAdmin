/**
 * Typed CRUD helpers for all admin entities.
 * All functions use the adminSupabase client (service role → bypasses RLS).
 */
import { adminSupabase as sb } from './admin';

// ── Characters (arcangel_configs) ────────────────────────────
export async function fetchCharacters() {
  const { data, error } = await sb.from('arcangel_configs').select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function upsertCharacter(record: any) {
  const { error } = await sb.from('arcangel_configs').upsert(record, { onConflict: 'id' });
  if (error) throw error;
}
export async function deleteCharacter(id: string) {
  const { error } = await sb.from('arcangel_configs').delete().eq('id', id);
  if (error) throw error;
}

// ── NOW Window Configs (now_window_configs) ───────────────────
export async function fetchNowConfigs() {
  const { data, error } = await sb.from('now_window_configs').select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function upsertNowConfig(record: any) {
  const { error } = await sb.from('now_window_configs').upsert(record, { onConflict: 'id' });
  if (error) throw error;
}
export async function deleteNowConfig(id: string) {
  const { error } = await sb.from('now_window_configs').delete().eq('id', id);
  if (error) throw error;
}

// ── Games (game_configs) ──────────────────────────────────────
export async function fetchGames() {
  const { data, error } = await sb.from('game_configs').select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function upsertGame(record: any) {
  const { error } = await sb.from('game_configs').upsert(record, { onConflict: 'id' });
  if (error) throw error;
}
export async function deleteGame(id: string) {
  const { error } = await sb.from('game_configs').delete().eq('id', id);
  if (error) throw error;
}

// ── Themes (theme_configs) ────────────────────────────────────
export async function fetchThemes() {
  const { data, error } = await sb.from('theme_configs').select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function upsertTheme(record: any) {
  const { error } = await sb.from('theme_configs').upsert(record, { onConflict: 'id' });
  if (error) throw error;
}
export async function deleteTheme(id: string) {
  const { error } = await sb.from('theme_configs').delete().eq('id', id);
  if (error) throw error;
}

// ── Features (feature_configs) ────────────────────────────────
export async function fetchFeatures() {
  const { data, error } = await sb.from('feature_configs').select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function upsertFeature(record: any) {
  const { error } = await sb.from('feature_configs').upsert(record, { onConflict: 'id' });
  if (error) throw error;
}
export async function deleteFeature(id: string) {
  const { error } = await sb.from('feature_configs').delete().eq('id', id);
  if (error) throw error;
}

// ── Levels (level_configs) ────────────────────────────────────
export async function fetchLevels() {
  const { data, error } = await sb.from('level_configs').select('*').order('level_number', { ascending: true });
  if (error) throw error;
  return data ?? [];
}
export async function upsertLevel(record: any) {
  const { error } = await sb.from('level_configs').upsert(record, { onConflict: 'level_number' });
  if (error) throw error;
}
export async function deleteLevel(levelNumber: number) {
  const { error } = await sb.from('level_configs').delete().eq('level_number', levelNumber);
  if (error) throw error;
}

// ── Users / Profiles (profiles) — read-only ──────────────────
export async function fetchUsers() {
  const { data, error } = await sb.from('profiles').select('*');
  if (error) throw error;
  return data ?? [];
}
export async function updateUserLevel(userId: string, level: number) {
  const { error } = await sb.from('profiles').update({ level }).eq('id', userId);
  if (error) throw error;
}
export async function softDeleteUser(userId: string) {
  // profiles has no status column — soft delete clears display name to anonymize the record
  const { error } = await sb.from('profiles').update({ display_name: null, anonymous_name: null }).eq('id', userId);
  if (error) throw error;
}
export async function hardDeleteUser(userId: string) {
  const { error } = await sb.from('profiles').delete().eq('id', userId);
  if (error) throw error;
}

// ── Settings (app_settings) — single row, id = 1 ─────────────
export async function fetchSettings() {
  const { data, error } = await sb.from('app_settings').select('*').eq('id', 1).single();
  if (error) throw error;
  return data;
}
export async function upsertSettings(record: any) {
  const { error } = await sb.from('app_settings').upsert({ ...record, id: 1 }, { onConflict: 'id' });
  if (error) throw error;
}

// ── Audit Logs (audit_logs) — insert only ────────────────────
export async function fetchAuditLogs() {
  const { data, error } = await sb.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  return data ?? [];
}
export async function insertAuditLog(record: any) {
  const { error } = await sb.from('audit_logs').insert(record);
  if (error) throw error;
}

// ── Generic table resolver ────────────────────────────────────
export function getSupabaseTable(type: string): string {
  const map: Record<string, string> = {
    character:  'arcangel_configs',
    now_config: 'now_window_configs',
    game:       'game_configs',
    theme:      'theme_configs',
    feature:    'feature_configs',
    level:      'level_configs',
  };
  return map[type] ?? type;
}
export async function upsertEntity(type: string, record: any) {
  const table = getSupabaseTable(type);
  const conflictCol = type === 'level' ? 'level_number' : 'id';
  const { error } = await sb.from(table).upsert(record, { onConflict: conflictCol });
  if (error) throw error;
}
export async function deleteEntity(type: string, id: string | number) {
  const table = getSupabaseTable(type);
  const idField = type === 'level' ? 'level_number' : 'id';
  const { error } = await sb.from(table).delete().eq(idField, id);
  if (error) throw error;
}

// ── Economy Config (economy_config) — single row, id = 1 ─────
export async function fetchEconomyConfig() {
  const { data, error } = await sb.from('economy_config').select('*').eq('id', 1).single();
  if (error) throw error;
  return data;
}
export async function upsertEconomyConfig(record: any) {
  const { error } = await sb.from('economy_config').upsert({ ...record, id: 1 }, { onConflict: 'id' });
  if (error) throw error;
}
