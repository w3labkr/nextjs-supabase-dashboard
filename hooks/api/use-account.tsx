'use client'

import useSWR from 'swr'
import { Tables } from '@/types/supabase'

type FetchData =
  | { data: Tables<'accounts'>; error: null }
  | { data: null; error: Error }

export function useAccount(id: string | null) {
  const url = id ? `/api/v1/account/${id}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<FetchData, Error>(url)

  return {
    account: response?.data ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
