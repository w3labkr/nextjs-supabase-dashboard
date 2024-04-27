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

  const { data: user } = await supabase
    .rpc('get_user', { uid: session?.id })
    .limit(1)
    .single()

  if (!user) return { user: null, role: null, plan: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', session?.id)
    .limit(1)
    .single()

  if (!profile) return { user: null, role: null, plan: null }

  return {
    user: { ...session, user, profile },
    role: user?.role,
    plan: user?.plan,
  }
}
