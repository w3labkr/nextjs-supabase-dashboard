'use client'

import useSWR from 'swr'
import { Tables } from '@/types/supabase'

type FetchData =
  | { data: Tables<'accounts'>; error: null }
  | { data: null; error: Error }

export type Account = Tables<'accounts'>

export function useAccount(id: string | null) {
  const fetchUrl = id ? `/api/v1/account/${id}` : null
  const {
    data: api,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<FetchData, Error>(fetchUrl)

  return {
    data: api?.data,
    error: error ?? api?.error,
    isLoading,
    isValidating,
    mutate,
  }
}
