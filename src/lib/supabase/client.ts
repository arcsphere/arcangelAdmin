import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase browser client — use this in Client Components ('use client').
 * Creates a new client on each call (SSR-safe, singleton via module scope).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
