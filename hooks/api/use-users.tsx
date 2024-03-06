'use client'

import useSWR from 'swr'
import { AdminListUsers } from '@/types/api'

export function useUsers(page: number, perPage: number) {
  const fetchUrl =
    page && perPage ? `/api/v1/users?page=${page}&perPage=${perPage}` : null
  const {
    data: api,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<AdminListUsers, Error>(fetchUrl)

  return {
    data: api?.data,
    error: error ?? api?.error,
    isLoading,
    isValidating,
    mutate,
  }
}
