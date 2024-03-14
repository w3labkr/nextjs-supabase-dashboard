'use client'

import useSWR from 'swr'
import { Tables } from '@/types/supabase'

type FetchData =
  | { data: Tables<'emails'>[]; error: null }
  | { data: null; error: Error }

export type Account = Tables<'emails'>

export function useEmails(id: string | null) {
  const fetchUrl = id ? `/api/v1/emails/${id}` : null
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
