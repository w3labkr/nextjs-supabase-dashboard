'use client'

import * as React from 'react'

import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/supabase/client'

/**
 * Listen to auth events
 *
 * @link https://supabase.com/docs/reference/javascript/auth-onauthstatechange
 */
interface AuthContextProps {
  session: Session | null
  user: User | null
  setSession: React.Dispatch<React.SetStateAction<Session | null>>
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const AuthContext = React.createContext<AuthContextProps | undefined>({
  session: null,
  user: null,
  setSession: () => void 0,
  setUser: () => void 0,
})

const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [session, setSession] = React.useState<Session | null>(null)
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })
    return () => subscription?.unsubscribe()
  }, [])

  const memoValue = React.useMemo(() => {
    return { session, user, setSession, setUser }
  }, [session, user])

  return (
    <AuthContext.Provider value={memoValue}>{children}</AuthContext.Provider>
  )
}

export { AuthContext, type AuthContextProps, AuthProvider }
