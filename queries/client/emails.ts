'use client'

import useSWR from 'swr'
import { type EmailsAPI } from '@/types/api'

export function useEmailsAPI(userId: string | null) {
  const url = userId ? `/api/v1/email/list?userId=${userId}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    EmailsAPI,
    Error
  >(url)

  return {
    emails: data?.data ?? null,
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
