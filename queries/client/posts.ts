'use client'

import useSWR from 'swr'
import { setQueryString } from '@/lib/utils'
import {
  type PostAPI,
  type PostsAPI,
  type CountPostsAPI,
  type PostRankAPI,
} from '@/types/api'

export function usePostAPI(
  id: number | null,
  params?: { userId?: string; slug?: string }
) {
  const query = setQueryString({ id, ...params })
  const url = query ? `/api/v1/post?${query}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    PostAPI,
    Error
  >(url)

  return {
    post: data?.data ?? null,
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}

export function usePostsAPI(
  userId: string | null,
  params?: {
    postType?: string
    status?: string
    isFavorite?: number
    tag?: string
    q?: string
    orderBy?: string
    order?: string
    perPage?: number
    page?: number
    limit?: number
  }
) {
  const query = setQueryString({ userId, ...params })
  const url = query ? `/api/v1/post/list?${query}` : null

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

export function useCountPostsAPI(
  userId: string | null,
  params?: { postType?: string; q?: string }
) {
  const query = setQueryString({ userId, ...params })
  const url = query ? `/api/v1/post/count?${query}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    CountPostsAPI,
    Error
  >(url)

  return {
    data: data?.data ?? null,
    count: data?.count ?? null,
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}

export function usePostRank(
  userId: string | null,
  params?: {
    q?: string
    orderBy?: string
    order?: string
    perPage?: number
    page?: number
  }
) {
  const query = setQueryString({ userId, ...params })
  const url = query ? `/api/v1/post/rank?${query}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    PostRankAPI,
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
