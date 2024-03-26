'use client'

import useSWR from 'swr'
import { Tables } from '@/types/supabase'

type FetchData =
  | { data: Tables<'emails'>[]; error: null }
  | { data: null; error: Error }

export function useEmails(id: string | null) {
  const url = id ? `/api/v1/emails/${id}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<FetchData, Error>(url)

  return {
    emails: response?.data ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
