'use client'

import useSWR from 'swr'
import { NotificationAPI } from '@/types/api'

export function useNotificationAPI(userId: string | null) {
  const url = userId ? `/api/v1/notification?userId=${userId}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<NotificationAPI, Error>(url)

  return {
    notification: response?.data ?? null,
    error: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
