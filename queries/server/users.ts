import { fetcher } from '@/lib/utils'
import { UserAPI } from '@/types/api'

export async function getUserAPI(
  id: string | null,
  params?: { username?: string }
) {
  let url: string | null = null

  if (id) {
    url = `/api/v1/user?id=${id}`
  } else if (params?.username) {
    url = `/api/v1/user?username=${params?.username}`
  }

  if (!url) return { user: null }

  const { data: user, error } = await fetcher<UserAPI>(url)

  return error ? { user: null } : { user }
}
