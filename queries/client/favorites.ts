'use client'

import useSWR from 'swr'
import { setQueryString } from '@/lib/utils'
import { type FavoriteAPI } from '@/types/api'

export function useFavoriteAPI(
  id: number | null,
  params?: { postId?: number; userId?: string }
) {
  const query = setQueryString({ id, ...params })
  const url = query ? `/api/v1/favorite?${query}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    FavoriteAPI,
    Error
  >(url)

  return {
    favorite: data?.data ?? null,
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
