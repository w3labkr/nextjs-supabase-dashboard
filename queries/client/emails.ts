'use client'

import useSWR from 'swr'
import { EmailsAPI } from '@/types/api'

export function useEmailsAPI(userId: string | null) {
  const url = userId ? `/api/v1/email/list?userId=${userId}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<EmailsAPI, Error>(url)

  return {
    emails: response?.data ?? null,
    error: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
