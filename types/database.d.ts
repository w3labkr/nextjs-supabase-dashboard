import { Tables } from '@/types/supabase'
import { User as AuthUser } from '@supabase/supabase-js'

export type UserRole = 'guest' | 'user' | 'admin' | 'superadmin'

export type UserPlan = 'free' | 'basic' | 'standard' | 'premium'

export type User = AuthUser & {
  user: Tables<'users'> & { role: string; plan: string }
  profile: Tables<'profiles'>
}

export type Email = Tables<'emails'>

export type Notification = Tables<'notifications'>

export type Profile = Tables<'profiles'>

export type PostStatus =
  | 'publish'
  | 'future'
  | 'draft'
  | 'pending'
  | 'private'
  | 'trash'

export type PostType = 'post' | 'page' | 'revision'

export type Post = Tables<'posts'> & {
  profile: Tables<'profiles'>
}

export type CountPosts = {
  status: PostStatus
  count: number
}
