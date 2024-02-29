import { createClient } from '@/lib/supabase/server'

export async function authenticate() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return {
    authenticated: !(error || !user),
    role: user?.role,
    user,
  }
}

export async function authorize(role: string) {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return { authorized: user?.role === role }
}
