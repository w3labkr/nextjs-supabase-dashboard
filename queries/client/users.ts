'use client'

import useSWR from 'swr'
import { setQueryString } from '@/lib/utils'
import { UserAPI, UsersAPI } from '@/types/api'

export function useUserAPI(id: string | null) {
  const url = id ? `/api/v1/user?id=${id}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<UserAPI, Error>(url)

  return {
    user: response?.data ?? null,
    error: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}

export function useUsersAPI(
  id: string | null,
  params?: { page?: number; perPage?: number }
) {
  const query = setQueryString({ id, ...params })
  const url = query ? `/api/v1/user/list?${query}` : null

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<UsersAPI, Error>(url)

  return {
    users: response?.data?.users ?? [],
    error: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
