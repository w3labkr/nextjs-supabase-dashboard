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

  const result = await supabase
    .from('users')
    .select(`*, user_roles(role)`)
    .eq('id', session?.id)
    .limit(1)
    .single()

  if (result?.error) return { user: null, role: null }

  const { user_roles, ...users } = result.data

  const user: User = {
    ...session,
    user: users,
    user_role: user_roles[0]?.role,
  }

  const role: Role = {
    isGuest: ['guest'].includes(user?.user_role),
    isUser: ['user'].includes(user?.user_role),
    isAdmin: ['admin', 'superadmin'].includes(user?.user_role),
    isSuperAdmin: ['superadmin'].includes(user?.user_role),
  }

  return { user, role }
}
