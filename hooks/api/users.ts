'use client'

import useSWR from 'swr'
import { UserAPI, UsersAPI } from '@/types/api'

export function useUser(id: string | null) {
  const url = id ? `/api/v1/user/${id}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<UserAPI, Error>(url)

  return {
    user: response?.data ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}

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
