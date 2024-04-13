'use client'

import useSWR from 'swr'
import { PostsAPI } from '@/types/api'
import { createQueryString } from '@/lib/utils'

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
