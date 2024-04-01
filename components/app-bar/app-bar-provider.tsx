'use client'

import * as React from 'react'

import { useAuth } from '@/hooks/use-auth'
import { useUser } from '@/hooks/sync/use-user'
import { UserRole } from '@/types/database'

export interface AppBarProviderProps {
  height: string
  role: UserRole | undefined
}

export const AppBarContext = React.createContext<AppBarProviderProps>({
  height: '',
  role: undefined,
})

export function AppBarProvider({ children }: { children: React.ReactNode }) {
  const { user: _user } = useAuth()
  const { user } = useUser(_user?.id ?? null)

  const value = React.useMemo(
    () => ({
      height: 'h-[50px]',
      role: user?.user_role?.role,
    }),
    [user?.user_role?.role]
  )

  return (
    <AppBarContext.Provider value={value}>{children}</AppBarContext.Provider>
  )
}
