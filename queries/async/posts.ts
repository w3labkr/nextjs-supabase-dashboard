import { createClient } from '@/lib/supabase/server'
import { fetcher, setQueryString } from '@/lib/utils'
import { PostAPI, PostsAPI } from '@/types/api'
import { Post } from '@/types/database'

export async function getPostAPI(
  id: number | null,
  params?: { uid?: string; slug?: string }
) {
  const query = setQueryString({ id, ...params })
  const url = query ? `/api/v1/post?${query}` : null

  if (!url) return { post: null }

  const { data } = await fetcher<PostAPI>(url)

  return { post: data }
}

export async function getPostsAPI(
  uid: string | null,
  params?: { page?: number; perPage?: number; status?: string; limit?: number }
) {
  const query = setQueryString({ uid, ...params })
  const url = query ? `/api/v1/post/list?${query}` : null

  if (!url) return { posts: null, count: null }

  const { data, count } = await fetcher<PostsAPI>(url)

  return { posts: data, count }
}

export async function getAdjacentPostAPI(
  id: number | null,
  params: { uid: string | null; type?: string; status?: string }
) {
  let previousPost: Post | null = null
  let nextPost: Post | null = null

  if (!id) return { previousPost, nextPost }
  if (!params?.uid) return { previousPost, nextPost }

  const supabase = createClient()
  const { data: adjacent } = await supabase
    .rpc('get_adjacent_post_id', {
      pid: id,
      uid: params?.uid,
      post_type: params?.type ?? 'post',
      post_status: params?.status ?? 'publish',
    })
    .limit(1)
    .single()

  if (adjacent?.previous_id) {
    const result = await fetcher<PostAPI>(
      `/api/v1/post?id=${adjacent?.previous_id}`
    )
    previousPost = result?.data
  }

  if (adjacent?.next_id) {
    const result = await fetcher<PostAPI>(
      `/api/v1/post?id=${adjacent?.next_id}`
    )
    nextPost = result?.data
  }

  return { previousPost, nextPost }
}
