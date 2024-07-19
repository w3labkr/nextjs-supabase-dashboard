'use client'

import useSWR from 'swr'
import { setQueryString } from '@/lib/utils'
import { type TagAPI, type TagsAPI } from '@/types/api'

export function useTagAPI(
  id: number | null,
  params?: { userId?: string; slug?: string }
) {
  const query = setQueryString({ id, ...params })
  const url = query ? `/api/v1/tag?${query}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    TagAPI,
    Error
  >(url)

  return {
    tag: data?.data ?? null,
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}

export function useTagsAPI(
  userId: string | null,
  params?: {
    q?: string
    orderBy?: string
    order?: string
    perPage?: number
    page?: number
    limit?: number
  }
) {
  const query = setQueryString({ userId, ...params })
  const url = query ? `/api/v1/tag/list?${query}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    TagsAPI,
    Error
  >(url)

  return {
    tags: data?.data ?? null,
    count: data?.count ?? null,
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
