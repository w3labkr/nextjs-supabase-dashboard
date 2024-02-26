import { createClient } from '@/lib/supabase/server'

export async function authenticate() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  return { isAuth: !(error || !data?.user) }
}
