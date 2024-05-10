'use client'

import useSWR from 'swr'
import { NotificationAPI } from '@/types/api'

export function useNotificationAPI(uid: string | null) {
  const url = uid ? `/api/v1/notification?uid=${uid}` : null
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
