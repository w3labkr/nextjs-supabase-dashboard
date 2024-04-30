'use client'

import * as React from 'react'

export interface EmailContextProps {
  isVerified: boolean
  isPrimary: boolean
  email: string | null
  email_confirmed_at: string | null
}

export const EmailContext = React.createContext<EmailContextProps | undefined>(
  undefined
)

export function EmailProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: EmailContextProps
}) {
  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>
}

export function useEmail() {
  const context = React.useContext<EmailContextProps | undefined>(EmailContext)

  if (context === undefined) {
    throw new Error('useEmail must be used within EmailProvider')
  }

  return context
}
