import { createClient } from '@/supabase/server'

export async function getAuth() {
  const supabase = createClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  return error || !session
    ? { session: null, user: null }
    : { session, user: session?.user }
}

export async function authenticate() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return error || !user
    ? { authenticated: false, user: null }
    : { authenticated: true, user }
}

export async function authorize(id: string) {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return { authorized: false, user: null }

  return user?.id === id
    ? { authorized: true, user }
    : { authorized: false, user: null }
}
