'use client'

import * as React from 'react'

export interface EmailItemContextProps {
  isVerified: boolean
  isPrimary: boolean
  email: string | null
  email_confirmed_at: string | null
}

export const EmailItemContext = React.createContext<
  EmailItemContextProps | undefined
>(undefined)

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

export function useEmailItem() {
  const context = React.useContext<EmailItemContextProps | undefined>(
    EmailItemContext
  )

  if (context === undefined) {
    throw new Error('useEmailItem must be used within EmailItemProvider')
  }

  return context
}
