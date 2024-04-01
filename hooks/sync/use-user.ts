'use client'

import useSWR from 'swr'
import { User } from '@supabase/supabase-js'
import { Tables } from '@/types/supabase'

type FetchData =
  | {
      data: User & {
        user: Tables<'users'>
        user_role: Tables<'user_roles'>
      }
      error: null
    }
  | { data: null; error: Error }

export function useUser(id: string | null) {
  const url = id ? `/api/v1/user/${id}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<FetchData, Error>(url)

  return {
    user: response?.data ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
