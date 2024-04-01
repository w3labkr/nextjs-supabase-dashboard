'use client'

import useSWR from 'swr'
import { Tables } from '@/types/supabase'

type FetchData =
  | { data: Tables<'appearances'>; error: null }
  | { data: null; error: Error }

export function useAppearance(id: string | null) {
  const url = id ? `/api/v1/appearance/${id}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<FetchData, Error>(url)

  return {
    appearance: response?.data ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
