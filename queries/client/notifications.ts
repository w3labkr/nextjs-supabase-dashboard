'use client'

import useSWR from 'swr'
import { type NotificationAPI } from '@/types/api'

export function useNotificationAPI(userId: string | null) {
  const url = userId ? `/api/v1/notification?userId=${userId}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    NotificationAPI,
    Error
  >(url)

  return {
    notification: data?.data ?? null,
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
