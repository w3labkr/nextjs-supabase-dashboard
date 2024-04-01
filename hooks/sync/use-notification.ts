'use client'

import useSWR from 'swr'
import { Tables } from '@/types/supabase'

type FetchData =
  | { data: Tables<'notifications'>; error: null }
  | { data: null; error: Error }

export function useNotification(id: string | null) {
  const url = id ? `/api/v1/notification/${id}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<FetchData, Error>(url)

  return {
    notification: response?.data ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
