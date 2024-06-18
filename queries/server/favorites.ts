import { fetcher, setQueryString } from '@/lib/utils'
import { PostsAPI } from '@/types/api'

export async function getFavoritePostsAPI(
  userId: string | null,
  params?: {
    page?: number
    perPage?: number
    postType?: string
    status?: string
    q?: string
    orderBy?: string
    order?: string
    limit?: number
  }
) {
  const query = setQueryString({ userId, ...params })
  const url = query ? `/api/v1/favorite/list?${query}` : null

  if (!url) return { posts: null, count: null }

  const { data: posts, count, error } = await fetcher<PostsAPI>(url)

  return error ? { posts: null, count: null } : { posts, count }
}
