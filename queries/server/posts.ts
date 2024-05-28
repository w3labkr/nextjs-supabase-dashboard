import { createClient } from '@/supabase/server'
import { fetcher, setQueryString } from '@/lib/utils'
import { PostAPI, PostsAPI } from '@/types/api'
import { Post } from '@/types/database'

export async function getPostAPI(
  id: number | null,
  params?: { userId?: string; slug?: string }
) {
  const query = setQueryString({ id, ...params })
  const url = query ? `/api/v1/post?${query}` : null

  if (!url) return { post: null }

  const { data: post, error } = await fetcher<PostAPI>(url)

  return error ? { post: null } : { post }
}

export async function getPostsAPI(
  userId: string | null,
  params?: {
    page?: number
    perPage?: number
    postType?: string
    status?: string
  }
) {
  const query = setQueryString({ userId, ...params })
  const url = query ? `/api/v1/post/list?${query}` : null

  if (!url) return { posts: null, count: null }

  const { data: posts, count, error } = await fetcher<PostsAPI>(url)

  return error ? { posts: null, count: null } : { posts, count }
}

export async function getAdjacentPostAPI(
  id: number | null,
  params: { userId: string | null; postType?: string; status?: string }
) {
  let previousPost: Post | null = null
  let nextPost: Post | null = null

  if (!id) return { previousPost, nextPost }
  if (!params?.userId) return { previousPost, nextPost }

  const supabase = createClient()
  const { data: adjacent } = await supabase
    .rpc('get_adjacent_post_id', {
      postid: id,
      userid: params?.userId,
      posttype: params?.postType ?? 'post',
      poststatus: params?.status ?? 'publish',
    })
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

export async function getFavoritePostsAPI(
  userId: string | null,
  params?: {
    page?: number
    perPage?: number
    postType?: string
    status?: string
  }
) {
  const query = setQueryString({ userId, ...params })
  const url = query ? `/api/v1/favorite/list?${query}` : null

  if (!url) return { posts: null, count: null }

  const { data: posts, count, error } = await fetcher<PostsAPI>(url)

  return error ? { posts: null, count: null } : { posts, count }
}
