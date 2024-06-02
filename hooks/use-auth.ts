'use client'

import * as React from 'react'
import { AuthContext, AuthContextProps } from '@/context/auth-provider'

const useAuth = () => {
  const context = React.useContext<AuthContextProps | undefined>(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export { useAuth }
