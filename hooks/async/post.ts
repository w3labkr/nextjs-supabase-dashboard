import { createClient } from '@/lib/supabase/server'

export async function getPostById(id: number) {
  const supabase = createClient()
  const { data: post } = await supabase
    .from('posts')
    .select()
    .eq('id', id)
    .limit(1)
    .single()

  if (!post) return { post: null }

  return { post }
}
