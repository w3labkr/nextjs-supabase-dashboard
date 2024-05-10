'use client'

import useSWR from 'swr'
import { EmailsAPI } from '@/types/api'

export function useEmailsAPI(uid: string | null) {
  const url = uid ? `/api/v1/email/list?uid=${uid}` : null
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
