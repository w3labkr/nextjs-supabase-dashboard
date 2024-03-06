'use client'

import * as React from 'react'
import { AuthContext, AuthContextProps } from '@/lib/supabase/auth-provider'

export function useAuth() {
  const context = React.useContext<AuthContextProps>(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
