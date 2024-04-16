'use client'

import useSWR from 'swr'
import { ProfileAPI } from '@/types/api'

export function useProfile(id?: string | null, params?: { username?: string }) {
  let url: string | null = null

  if (id) url = `/api/v1/profile/${id}`
  if (params?.username) url = `/api/profile/${params?.username}`

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
