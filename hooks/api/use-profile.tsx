'use client'

import useSWR from 'swr'
import { Tables } from '@/types/supabase'

interface FetchData {
  data: Tables<'profiles'> | null
  error: Error | null
}

export function useProfile(id: string | null) {
  const fetchUrl = id ? `/api/v1/profile/${id}` : null
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
