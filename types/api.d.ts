import {
  Session,
  User,
  WeakPassword,
  Provider,
  Pagination,
  AuthError,
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
  error: PostgrestError | null
}

export interface SignInWithPasswordUserMetadata {
  email: string | null
  email_verified: boolean | null
  phone_verified: boolean | null
  sub: string | null
}

export interface SignInWithGoogleUserMetadata {
  avatar_url: string | null
  email: string | null
  email_verified: boolean | null
  full_name: string | null
  iss: string | null
  name: string | null
  phone_verified: boolean | null
  picture: string | null
  provider_id: string | null
  sub: string | null
}

export type AdminListUsers = {
  data: {
    users: User[] | []
    aud?: string | undefined
  } & Pagination
  error: AuthError | null
}
