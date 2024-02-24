import { AuthError, PostgrestError } from '@supabase/supabase-js'
import { SignInWithPassword } from './supabase'

export interface AuthApiError extends AuthError {
  i18n?: string | undefined
}

export interface PostgrestApiError extends PostgrestError {
  i18n?: string | undefined
}

export interface AuthApi {
  error: AuthApiError | null
}

export interface PostgrestApi {
  error: PostgrestApiError | null
}

export interface AuthPostgrestApi {
  error: AuthApiError | PostgrestApiError | null
}

export interface SignInApi extends Omit<SignInWithPassword, 'error'> {
  error: AuthApiError | null
}
