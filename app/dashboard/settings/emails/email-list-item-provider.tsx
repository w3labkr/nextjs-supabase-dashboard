'use client'

import * as React from 'react'

export interface EmailListItemProviderProps {
  isVerified: boolean
  isPrimary: boolean
  email: string | null
  email_confirmed_at: string | null
  user_id: string | null
}

export const EmailListItemContext =
  React.createContext<EmailListItemProviderProps>({
    isVerified: false,
    isPrimary: false,
    email: null,
    email_confirmed_at: null,
    user_id: null,
  })

export function EmailListItemProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: EmailListItemProviderProps
}) {
  return (
    <EmailListItemContext.Provider value={value}>
      {children}
    </EmailListItemContext.Provider>
  )
}
