import { fetcher } from '@/lib/utils'
import { getAuth } from '@/queries/server/auth'
import { type UserAPI } from '@/types/api'

export async function getUserAPI(
  id: string | null = null,
  params?: { username?: string }
) {
  const { session } = await getAuth()

  let url: string | null = null

  if (params?.username) {
    url = `/api/v1/user?username=${params?.username}`
  } else if (id) {
    url = `/api/v1/user?id=${id}`
  } else if (session?.user) {
    url = `/api/v1/user?id=${session?.user?.id}`
  }

  if (!url) return { user: null }

  const { data: user, error } = await fetcher<UserAPI>(url)

  return error ? { user: null } : { user }
}
