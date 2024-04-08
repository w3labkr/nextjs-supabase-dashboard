import { createClient } from '@/lib/supabase/server'
import { getUser } from './user'

export async function getPostsByUser() {
  const { user } = await getUser()

  if (!user) return { posts: null }

  const supabase = createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select()
    .eq('user_id', user?.id)

  if (!posts) return { posts: null }

  return { posts }
}
