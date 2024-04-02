import { createClient } from '@/lib/supabase/server'
import { generateUserRole } from '@/lib/utils'

export async function authorize(id: string) {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return error || !user
    ? { user: null }
    : { user: user?.id === id ? user : null }
}

export async function getUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { user: null }

  const result = await supabase
    .from('users')
    .select(
      `username, has_set_password, is_ban, banned_until, deleted_at,
       user_roles(role)`
    )
    .eq('id', user?.id)
    .limit(1)
    .single()

  if (result?.error) return { user: null }

  const { user_roles, ...users } = result.data

  const data = {
    ...user,
    user: users,
    user_role: generateUserRole(user_roles[0]?.role),
  }

  return { user: data }
}
