import { createBrowserClient } from '@supabase/ssr'

/**
 * Setting up Server-Side Auth for Next.js
 *
 * @link https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function isAuthenticate() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  return !(error || !data?.user)
}
