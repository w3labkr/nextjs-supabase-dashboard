'use client'

import useSWR from 'swr'
import { CountPostsAPI } from '@/types/api'

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
