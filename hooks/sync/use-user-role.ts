'use client'

import useSWR from 'swr'
import { Tables } from '@/types/supabase'

type FetchData =
  | { data: Tables<'user_roles'>; error: null }
  | { data: null; error: Error }

export function useUserRole(id: string | null) {
  const url = id ? `/api/v1/user_role/${id}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<FetchData, Error>(url)

  return {
    role: response?.data ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
