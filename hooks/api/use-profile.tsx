'use client'

import useSWR from 'swr'
import { Tables } from '@/types/supabase'

interface FetchData {
  data: Tables<'profiles'> | null
  error: Error | null
}

export function useProfile(userId: string | null) {
  const fetchUrl = userId ? `/api/v1/profile/${userId}` : null
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
