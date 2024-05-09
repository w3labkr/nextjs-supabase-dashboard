import { createClient } from '@/lib/supabase/server'
import { setMeta } from '@/lib/utils'

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
    .single()

  const { data: meta } = await supabase
    .from('usermeta')
    .select('*')
    .eq('user_id', session?.id)

  if (!user) return { user: null, role: null, plan: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session?.id)
    .single()

  if (!profile) return { user: null, role: null, plan: null }

  const oldUser = { ...user, meta }
  const newUser = setMeta(oldUser)

  return {
    user: { ...session, user: newUser, profile },
    role: user?.role,
    plan: user?.plan,
  }
}
