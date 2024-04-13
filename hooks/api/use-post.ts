'use client'

import useSWR from 'swr'
import { PostAPI } from '@/types/api'

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
