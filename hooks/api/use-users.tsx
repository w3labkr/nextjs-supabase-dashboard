'use client'

import useSWR from 'swr'
import { User, Pagination, AuthError } from '@supabase/supabase-js'

type FetchData =
  | { data: { users: User[]; aud: string } & Pagination; error: null }
  | { data: { users: [] }; error: AuthError }

export function useUsers(page: number, perPage: number) {
  const url =
    page && perPage ? `/api/v1/users?page=${page}&perPage=${perPage}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<FetchData, Error>(url)

  return {
    users: response?.data?.users ?? [],
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
