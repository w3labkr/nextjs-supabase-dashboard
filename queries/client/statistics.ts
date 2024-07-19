'use client'

import useSWR from 'swr'
import { setQueryString } from '@/lib/utils'
import { type StatisticsAPI } from '@/types/api'

export function useStatisticsAPI(
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
  const url = query ? `/api/v1/statistic/list?${query}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    StatisticsAPI,
    Error
  >(url)

  return {
    statistics: data?.data ?? null,
    count: data?.count ?? null,
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
