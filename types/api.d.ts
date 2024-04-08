import { User as AuthUser, AuthError, Pagination } from '@supabase/supabase-js'
import { Email, Notification, Post, Profile, User } from '@/types/database'

export type EmailAPI =
  | { data: Email; error: null }
  | { data: null; error: Error }

export type EmailsAPI =
  | { data: Email[]; error: null }
  | { data: null; error: Error }

export type NotificationAPI =
  | { data: Notification; error: null }
  | { data: null; error: Error }

export type PostAPI = { data: Post; error: null } | { data: null; error: Error }

export type PostsAPI =
  | { data: Post[]; count: number; error: null }
  | { data: null; count: null; error: Error }

export type ProfileAPI =
  | { data: Profile; error: null }
  | { data: null; error: Error }

export type UserAPI = { data: User; error: null } | { data: null; error: Error }

export type UsersAPI =
  | { data: { users: AuthUser[]; aud: string } & Pagination; error: null }
  | { data: { users: [] }; error: AuthError }
