'use client'

import useSWR from 'swr'
import { useAuth } from '@/hooks/use-auth'
import { setQueryString } from '@/lib/utils'
import { UserAPI, UsersAPI } from '@/types/api'

export function useUserAPI(
  id: string | null = null,
  params?: { username?: string }
) {
  const { session } = useAuth()

  let url: string | null = null

  if (params?.username) {
    url = `/api/v1/user?username=${params?.username}`
  } else if (id) {
    url = `/api/v1/user?id=${id}`
  } else if (session?.user) {
    url = `/api/v1/user?id=${session?.user?.id}`
  }

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    UserAPI,
    Error
  >(url)

  return {
    user: data?.data ?? null,
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}

export function useUsersAPI(
  id: string | null,
  params?: { page?: number; perPage?: number }
) {
  const { session } = useAuth()
  const query = setQueryString({ ...params })

  let url: string | null = null

  if (id) {
    url = `/api/v1/user/list?id=${id}`
  } else if (session?.user) {
    url = `/api/v1/user/list?id=${session?.user?.id}`
  }

  if (url && query) url = url + '&' + query

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    UsersAPI,
    Error
  >(url)

  return {
    users: data?.data?.users ?? [],
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
