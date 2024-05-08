'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { setQueryString } from '@/lib/utils'
import { PostAPI, PostsAPI, CountPostsAPI } from '@/types/api'

export async function setPostView(id: number) {
  const supabase = createClient()
  const result = await supabase.rpc('set_post_view', { pid: id })

  return result
}

export function usePostAPI(
  id: number | null,
  params?: { uid?: string; slug?: string }
) {
  const query = setQueryString({ id, ...params })
  const url = query ? `/api/v1/post?${query}` : null

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<PostAPI, Error>(url)

  return {
    post: response?.data ?? null,
    error: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}

export function usePostsAPI(
  uid: string | null,
  params?: { page?: number; perPage?: number; status?: string; limit?: number }
) {
  const query = setQueryString({ uid, ...params })
  const url = query ? `/api/v1/post/list?${query}` : null

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<PostsAPI, Error>(url)

  return {
    posts: response?.data ?? null,
    count: response?.count ?? null,
    error: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}

export function useCountPostsAPI(uid: string | null) {
  const url = uid ? `/api/v1/post/count?uid=${uid}` : null

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<CountPostsAPI, Error>(url)

  return {
    data: response?.data ?? null,
    count: response?.count ?? null,
    error: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
