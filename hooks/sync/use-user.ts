'use client'

import useSWR from 'swr'
import { UserAPI } from '@/types/api'

export function useUser(id: string | null) {
  const url = id ? `/api/v1/user/${id}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<UserAPI, Error>(url)

  return {
    user: response?.data ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
