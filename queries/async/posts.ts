import { createClient } from '@/lib/supabase/server'
import { fetcher, setQueryString } from '@/lib/utils'
import { PostAPI, PostsAPI } from '@/types/api'

export async function setPostViews(id: number) {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('set_post_views', { post_id: id })

  if (data === null) return { views: -1 }

  return { views: data, error }
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

  const { data, error } = await fetcher<PostAPI>(url)

  return { post: data, error }
}

export async function getPostsAPI(
  uid: string | null,
  params?: { page?: number; perPage?: number; status?: string; limit?: string }
) {
  const query = setQueryString({ uid, ...params })
  const url = query ? `/api/v1/post/list?${query}` : null

  if (!url) return { posts: null }

  const { data, count, error } = await fetcher<PostsAPI>(url)

  return { posts: data, count, error }
}
