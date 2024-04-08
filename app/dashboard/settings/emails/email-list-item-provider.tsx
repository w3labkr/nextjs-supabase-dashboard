'use client'

import * as React from 'react'

export interface EmailListItemContextProps {
  isVerified: boolean
  isPrimary: boolean
  email: string | null
  email_confirmed_at: string | null
}

export const EmailListItemContext =
  React.createContext<EmailListItemContextProps>({
    isVerified: false,
    isPrimary: false,
    email: null,
    email_confirmed_at: null,
  })

export function EmailListItemProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: EmailListItemContextProps
}) {
  return (
    <EmailListItemContext.Provider value={value}>
      {children}
    </EmailListItemContext.Provider>
  )
}
