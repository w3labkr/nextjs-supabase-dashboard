import { AuthError, PostgrestError } from '@supabase/supabase-js'
import { SignInWithPassword } from './supabase'

export interface AuthApi {
  error: AuthError | null
}

export interface PostgrestApi {
  error: PostgrestError | null
}

export interface AuthPostgrestApi {
  error: AuthError | PostgrestError | null
}

export interface SignInApi extends SignInWithPassword {}
