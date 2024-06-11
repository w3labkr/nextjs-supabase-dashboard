'use client'

import useSWR from 'swr'
import { setQueryString } from '@/lib/utils'
import { PostAPI, PostsAPI, CountPostsAPI } from '@/types/api'

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
    page?: number
    perPage?: number
    postType?: string
    status?: string
    q?: string
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

export function useFavoritePostsAPI(
  userId: string | null,
  params?: {
    page?: number
    perPage?: number
    postType?: string
    status?: string
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
