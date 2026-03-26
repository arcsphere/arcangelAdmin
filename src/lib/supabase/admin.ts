/**
 * Admin Supabase Client
 * Uses the service role key to bypass RLS for admin panel operations.
 * Safe to use here because this panel is protected by Google SSO.
 *
 * Requires NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY in .env.local
 * (copy the value from SUPABASE_SERVICE_ROLE_KEY and add the NEXT_PUBLIC_ prefix)
 */
import { createClient } from '@supabase/supabase-js';

export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
