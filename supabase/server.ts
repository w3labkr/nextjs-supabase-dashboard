import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createAuthClient } from '@supabase/supabase-js'
import { type Database } from '@/types/supabase'

/**
 * Setting up Server-Side Auth for Next.js
 *
 * @link https://supabase.com/docs/guides/auth/server-side/nextjs
 * @link https://supabase.com/docs/reference/javascript/auth-api
 */
export function createClient() {
  const cookieStore = cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  return supabase
}

/**
 * Setting up Server-Side Auth Admin for Next.js
 *
 * @link https://supabase.com/docs/reference/javascript/admin-api
 */
export function createAdminClient() {
  const supabase = createAuthClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  // Access auth admin api
  const adminAuthClient = supabase.auth.admin

  return adminAuthClient
}
