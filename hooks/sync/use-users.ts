'use client'

import useSWR from 'swr'
import { UsersAPI } from '@/types/api'

export function useUsers(page: number, perPage: number) {
  const url =
    page && perPage ? `/api/v1/users?page=${page}&perPage=${perPage}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<UsersAPI, Error>(url)

  return {
    users: response?.data?.users ?? [],
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
