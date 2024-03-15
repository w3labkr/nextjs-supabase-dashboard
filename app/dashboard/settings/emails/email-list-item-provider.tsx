'use client'

import * as React from 'react'

export interface EmailListItemProviderProps {
  isVerified: boolean
  isPrimary: boolean
}

export const EmailListItemContext =
  React.createContext<EmailListItemProviderProps>({
    isVerified: false,
    isPrimary: false,
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
