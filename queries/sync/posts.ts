'use client'

import useSWR from 'swr'
import { setQueryString } from '@/lib/utils'
import { PostAPI, PostsAPI, CountPostsAPI } from '@/types/api'

export function usePostAPI(id: number | null) {
  const url = id ? `/api/v1/post?id=${id}` : null
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
