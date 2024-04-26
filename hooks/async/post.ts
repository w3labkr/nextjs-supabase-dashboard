import { createClient } from '@/lib/supabase/server'

export async function setPostViews(id: number) {
  const supabase = createClient()
  const result = await supabase.rpc('set_post_views', { post_id: id })

  if (result?.error) return null

  return result?.data
}
