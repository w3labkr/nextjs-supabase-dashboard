'use client'

import * as React from 'react'

export interface EmailItemContextProps {
  isVerified: boolean
  isPrimary: boolean
  email: string | null
  email_confirmed_at: string | null
}

export const EmailItemContext = React.createContext<EmailItemContextProps>({
  isVerified: false,
  isPrimary: false,
  email: null,
  email_confirmed_at: null,
})

export function EmailItemProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: EmailItemContextProps
}) {
  return (
    <EmailItemContext.Provider value={value}>
      {children}
    </EmailItemContext.Provider>
  )
}
