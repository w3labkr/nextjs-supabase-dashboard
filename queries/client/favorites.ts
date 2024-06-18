'use client'

import useSWR from 'swr'
import { setQueryString } from '@/lib/utils'
import { FavoriteAPI, PostsAPI } from '@/types/api'

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

export function useFavoritePostsAPI(
  userId: string | null,
  params?: {
    page?: number
    perPage?: number
    postType?: string
    status?: string
    q?: string
    orderBy?: string
    order?: string
    limit?: number
  }
) {
  const query = setQueryString({ userId, ...params })
  const url = query ? `/api/v1/favorite/list?${query}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    PostsAPI,
    Error
  >(url)

  return {
    posts: data?.data ?? null,
    count: data?.count ?? null,
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
