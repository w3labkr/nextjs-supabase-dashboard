'use client'

import useSWR from 'swr'
import { setQueryString } from '@/lib/utils'
import { FavoriteAPI } from '@/types/api'

export function useFavoriteAPI(
  id: number | null,
  params?: { postId?: number; userId?: string }
) {
  const query = setQueryString({ id, ...params })
  const url = query ? `/api/v1/favorite?${query}` : null

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<FavoriteAPI, Error>(url)

  return {
    favorite: response?.data ?? null,
    error: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
