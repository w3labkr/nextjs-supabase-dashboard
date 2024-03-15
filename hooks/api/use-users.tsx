'use client'

import useSWR from 'swr'
import { User, Pagination, AuthError } from '@supabase/supabase-js'

type FetchData =
  | { data: { users: User[]; aud: string } & Pagination; error: null }
  | { data: { users: [] }; error: AuthError }

export function useUsers(page: number, perPage: number) {
  const fetchUrl =
    page && perPage ? `/api/v1/users?page=${page}&perPage=${perPage}` : null
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
