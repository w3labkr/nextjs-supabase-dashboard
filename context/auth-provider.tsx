// 'use client'

// import * as React from 'react'

// export const AuthContext = React.createContext(null)

// export const AuthProvider = ({ supabase, ...props }) => {
//   const [session, setSession] = React.useState(null)
//   const [user, setUser] = React.useState(null)

//   const value = React.useMemo(() => {
//     return {
//       session,
//       user,
//       signOut: () => supabase.auth.signOut(),
//     }
//   }, [session, user, supabase])

//   return <AuthContext.Provider value={value} {...props} />
// }

// // import { useAuth } from '@/lib/auth';
// // const { user, signOut } = useAuth();
// export const useAuth = () => {
//   const context = React.useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }
