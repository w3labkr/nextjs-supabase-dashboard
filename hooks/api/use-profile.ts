'use client'

import useSWR from 'swr'
import { ProfileAPI } from '@/types/api'

export function useProfile(uid: string | null) {
  const url = uid ? `/api/v1/profile/${uid}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<ProfileAPI, Error>(url)

  return {
    profile: response?.data ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
