import { fetcher } from '@/lib/utils'
import { ProfileAPI } from '@/types/api'

export async function getProfileAPI(
  id: string | null,
  params?: { username?: string }
) {
  let url: string | null = null

  if (id) url = `/api/v1/profile?id=${id}`
  if (params?.username) url = `/api/v1/profile?username=${params?.username}`

  if (!url) return { profile: null }

  const { data, error } = await fetcher<ProfileAPI>(url)

  return { profile: data, error }
}
