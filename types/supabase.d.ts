import {
  Session,
  User,
  WeakPassword,
  AuthError,
  Provider,
  PostgrestError,
} from '@supabase/supabase-js'

export interface SignUp {
  data: { user: User; session: Session }
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

export interface SignInWithOAuth {
  data: { provider: Provider; url: string }
  error: AuthError | null
}

export interface SignOut {
  error: AuthError | null
}

export interface UpdateUser {
  data: { user: User }
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
