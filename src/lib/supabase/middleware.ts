import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes the Supabase auth session on every request.
 * Called from middleware.ts at the project root.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Dev bypass: if Supabase is not yet configured, skip auth and
  // allow direct access to the dashboard so you can see the UI.
  // Remove this block once you have filled in .env.local with real values.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const isSupabaseConfigured =
    supabaseUrl.length > 0 && !supabaseUrl.includes('placeholder');

  if (!isSupabaseConfigured) {
    // Redirect root → dashboard in dev bypass mode
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin-v3';
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — do NOT remove this line
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect all /admin-v3/* routes
  if (pathname.startsWith('/admin-v3')) {
    if (!user) {
      // Not logged in → redirect to /login
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      return NextResponse.redirect(loginUrl);
    }

    // Logged in but email not whitelisted → redirect to /unauthorized
    const ADMIN_WHITELIST = [
      process.env.ADMIN_EMAIL_1 ?? 'hrishitababaria08@gmail.com',
    ];

    if (!ADMIN_WHITELIST.includes(user.email ?? '')) {
      const unauthorizedUrl = request.nextUrl.clone();
      unauthorizedUrl.pathname = '/unauthorized';
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // Redirect root / to /admin-v3
  if (pathname === '/') {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/admin-v3';
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}
