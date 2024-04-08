'use client'

import useSWR from 'swr'
import { EmailsAPI } from '@/types/api'

export function useEmails(uid: string | null) {
  const url = uid ? `/api/v1/emails/${uid}` : null
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<EmailsAPI, Error>(url)

  return {
    emails: response?.data ?? null,
    isError: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
