import {
  Session as SupabaseSession,
  User as SupabaseUser,
  WeakPassword,
  AuthError as SupabaseAuthError,
  Provider,
  PostgrestError as SupabasePostgrestError,
} from '@supabase/supabase-js'

export type Session = SupabaseSession

export type User = SupabaseUser

export interface AuthError extends SupabaseAuthError {
  i18n?: string | undefined
}

export interface PostgrestError extends SupabasePostgrestError {
  i18n?: string | undefined
}

export interface SignUp {
  data: {
    user: User
    session: Session
  }
  error: AuthError | null
}

export interface SignInWithPassword {
  data: {
    user: User
    session: Session
    weakPassword?: WeakPassword | undefined
  }
  error: AuthError | null
}

export interface SignOut {
  error: AuthError | null
}

export interface SignInWithOAuth {
  data: {
    provider: Provider
    url: string
  }
  error: AuthError | null
}

export interface UpdateUser {
  data: {
    user: User
  }
  error: AuthError | null
}

export interface ResetPasswordForEmail {
  data: {} | null
  error: AuthError | null
}

export interface DeleteUser {
  data: any
  error: PostgrestError | null
}

export interface DeleteAccount {
  data: any
  error: PostgrestError | null
}
