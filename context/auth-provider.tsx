'use client'

import * as React from 'react'

import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

/**
 * Listen to auth events
 *
 * @link https://supabase.com/docs/guides/getting-started/tutorials/with-react
 * @link https://supabase.com/docs/reference/javascript/auth-onauthstatechange
 */
export interface AuthContextProps {
  session: Session | null
  user: User | null
  setSession: React.Dispatch<React.SetStateAction<Session | null>>
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const AuthContext = React.createContext<AuthContextProps>({
  session: null,
  user: null,
  setSession: () => void 0,
  setUser: () => void 0,
})

export interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = React.useState<Session | null>(null)
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const value = React.useMemo(
    () => ({ session, user, setSession, setUser }),
    [session, user, setSession, setUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
