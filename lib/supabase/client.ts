import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

/**
 * Setting up Server-Side Auth for Next.js
 *
 * @link https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Setting up Server-Side Auth Admin for Next.js
 *
 * @link https://supabase.com/docs/reference/javascript/admin-api
 */
export function createAdminClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!
  )
}
