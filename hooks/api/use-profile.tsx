'use client'

import useSWR from 'swr'
import { Tables } from '@/types/supabase'
import { fetcher } from '@/lib/utils'

interface Profile {
  data: Tables<'profiles'> | null
  error: Error | null
}

export function useProfile(userId: string | null) {
  const fetchUrl = userId ? `/api/v1/profile/${userId}` : null
  const {
    data: api,
    error,
    isLoading,
  } = useSWR<Profile, Error>(fetchUrl, fetcher)

  return {
    data: api?.data,
    error: error ?? api?.error,
    isLoading,
  }
}
