'use client'

import useSWR from 'swr'
import { createQueryString } from '@/lib/utils'
import { PostAPI, PostsAPI, CountPostsAPI } from '@/types/api'

export function usePost(id: string | null) {
  const url = id ? `/api/v1/post/${id}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<PostAPI, Error>(url)

  return {
    post: response?.data ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}

export function usePosts(
  uid: string | null,
  params: { page: number; perPage: number; status: string }
) {
  const queryString = createQueryString(params)
  const url = uid ? `/api/v1/posts/${uid}?${queryString}` : null

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<PostsAPI, Error>(url)

  return {
    posts: response?.data ?? null,
    total: response?.count ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}

export function useCountPosts(uid: string | null) {
  const url = uid ? `/api/v1/posts/${uid}/count` : null

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<CountPostsAPI, Error>(url)

  return {
    data: response?.data ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
