import { createClient } from '@/lib/supabase/server'

export async function authorize(id: string) {
  const { user, role, plan } = await getUser()

  if (!user) return { user: null, role: null, plan: null }

  return user?.id === id
    ? { user, role, plan }
    : { user: null, role: null, plan: null }
}

export async function getUser() {
  const supabase = createClient()
  const {
    data: { user: session },
  } = await supabase.auth.getUser()

  if (!session) return { user: null, role: null, plan: null }

  const result = await supabase
    .rpc('get_user', { uid: session?.id })
    .limit(1)
    .single()

  if (result?.error) return { user: null, role: null, plan: null }

  const user = { ...session, user: result?.data }
  const user_role = user?.user?.role
  const user_plan = user?.user?.plan

  const role = {
    isGuest: user_role === 'guest',
    isUser: user_role === 'user',
    isAdmin: ['admin', 'superadmin'].includes(user_role),
    isSuperAdmin: user_role === 'superadmin',
  }

  const plan = {
    isFree: user_plan === 'free',
    isBasic: user_plan === 'basic',
    isStandard: user_plan === 'standard',
    isPremium: user_plan === 'premium',
  }

  return { user, role, plan }
}
