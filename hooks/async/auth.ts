import { createClient } from '@/lib/supabase/server'
import { User, Role } from '@/types/database'

export async function authorize(id: string) {
  const { user, role } = await getUser()

  if (!user) return { user: null, role: null }

  return user?.id === id ? { user, role } : { user: null, role: null }
}

export async function getUser() {
  const supabase = createClient()
  const {
    data: { user: session },
  } = await supabase.auth.getUser()

  if (!session) return { user: null, role: null }

  const result = await supabase.rpc('get_user', { uid: session?.id }).single()

  if (result?.error) return { user: null, role: null }

  const user: User = { ...session, user: result?.data }
  const user_role = user?.user?.role

  const role: Role = {
    isGuest: ['guest'].includes(user_role),
    isUser: ['user'].includes(user_role),
    isAdmin: ['admin', 'superadmin'].includes(user_role),
    isSuperAdmin: ['superadmin'].includes(user_role),
  }

  return { user, role }
}

export async function getProfile(username: string) {
  const supabase = createClient()
  const result = await supabase
    .from('profiles')
    .select()
    .eq('username', username)
    .limit(1)
    .single()

  if (result?.error) return { profile: null }

  return { profile: result?.data }
}
