import { Tables, Enums } from '@/types/supabase'
import { User as AuthUser } from '@supabase/supabase-js'

export type PostStatus = Enums<'post_status'>

export type UserRole = Enums<'user_role'>

export type Email = Tables<'emails'>

export type Notification = Tables<'notifications'>

export type Profile = Tables<'profiles'>

export type Post = Tables<'posts'> & {
  user: Tables<'users'>
}

export type CountPosts = {
  status: PostStatus | 'all'
  count: number
}

export type User = AuthUser & {
  user: Tables<'users'> & { role: UserRole }
}

export type Role = {
  isGuest: boolean
  isUser: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
}
