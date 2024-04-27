import { createClient } from '@/lib/supabase/server'
import { fetcher } from '@/lib/utils'
import { PostAPI } from '@/types/api'

export async function setPostViews(id: number) {
  const supabase = createClient()
  const { data } = await supabase.rpc('set_post_views', { post_id: id })

  if (data === null) return { views: -1 }

  return { views: data }
}

export async function getPostAPI(
  id: string | null,
  params?: { username?: string; slug?: string }
) {
  let url: string | null = null

  if (id) url = `/api/v1/post?id=${id}`
  if (params?.username && params?.slug) {
    url = `/api/v1/post?username=${params?.username}&slug=${params?.slug}`
  }

  if (!url) return { post: null }

  const { data } = await fetcher<PostAPI>(url)

  return { post: data }
}

export async function getPostsAPI(
  id: string | null,
  params?: { username?: string; slug?: string }
) {
  let url: string | null = null

  if (id) url = `/api/v1/post?id=${id}`
  if (params?.username && params?.slug) {
    url = `/api/v1/post?username=${params?.username}&slug=${params?.slug}`
  }

  if (!url) return { post: null }

  const { data } = await fetcher<PostAPI>(url)

  return { post: data }
}
