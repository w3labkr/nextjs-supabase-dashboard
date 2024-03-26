import { createClient } from '@/lib/supabase/server'

export async function authenticate() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return {
    isAuthenticated: !(error || !user),
    user,
  }
}

export async function authorize(id: string, role?: string | undefined) {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  const isAuthenticated: boolean = !(error || !user)
  let isAuthorized: boolean = false

  if (isAuthenticated && id) isAuthorized = user?.id === id
  if (isAuthenticated && role) isAuthorized = user?.role === role

  return {
    isAuthorized,
    user,
    role: user?.role,
  }
}
