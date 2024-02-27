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

export interface SignInWithPasswordUserMetadata {
  email: string
  email_verified: boolean
  phone_verified: boolean
  sub: string
}

export interface SignInWithGoogleUserMetadata {
  avatar_url: string
  email: string
  email_verified: boolean
  full_name: string
  iss: string
  name: string
  phone_verified: boolean
  picture: string
  provider_id: string
  sub: string
}
