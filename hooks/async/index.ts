import { createClient } from '@/lib/supabase/server'
import { fetcher } from '@/lib/utils'
import { ProfileAPI, PostAPI } from '@/types/api'

export async function authorize(id: string) {
  const { user, role, plan } = await getUser()

  if (!user) return { user: null, role: null, plan: null }

  return user?.id === id
    ? { user, role, plan }
    : { user: null, role: null, plan: null }
}

export async function getUser() {
  const supabase = createClient()
  const {
    data: { user: session },
  } = await supabase.auth.getUser()

  if (!session) return { user: null, role: null, plan: null }

  const { data: user } = await supabase
    .rpc('get_user', { uid: session?.id })
    .limit(1)
    .single()

  if (!user) return { user: null, role: null, plan: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', session?.id)
    .limit(1)
    .single()

  if (!profile) return { user: null, role: null, plan: null }

  return {
    user: { ...session, user, profile },
    role: user?.role,
    plan: user?.plan,
  }
}

export async function setPostViews(id: number) {
  const supabase = createClient()
  const { data } = await supabase.rpc('set_post_views', { post_id: id })

  if (data === null) return { views: -1 }

  return { views: data }
}

export async function getProfile(
  id: string | null,
  params?: { username?: string }
) {
  let url: string | null = null

  if (id) url = `/api/v1/profile?id=${id}`
  if (params?.username) url = `/api/v1/profile?username=${params?.username}`

  if (!url) return { profile: null }

  const { data } = await fetcher<ProfileAPI>(url)

  return { profile: data }
}

export async function getPost(
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
