'use client'

import useSWR from 'swr'
import { PostsAPI } from '@/types/api'

export function usePosts(
  uid: string | null,
  page: number = 1,
  perPage: number = 50
) {
  const url = uid
    ? `/api/v1/posts/${uid}?page=${page}&perPage=${perPage}`
    : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<PostsAPI, Error>(url)

  return {
    posts: response?.data ?? null,
    total: response?.total ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
