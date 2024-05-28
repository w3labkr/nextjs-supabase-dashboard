import { Tables } from '@/types/supabase'

export type UserRole = 'guest' | 'user' | 'admin' | 'superadmin'

export type UserPlan = 'free' | 'basic' | 'standard' | 'premium'

export type User = Tables<'users'> & {
  role: string
  plan: string
  meta: Record<string, string>
}

export type Email = Tables<'emails'>

export type Notification = Tables<'notifications'>

export type PostStatus =
  | 'publish'
  | 'future'
  | 'draft'
  | 'pending'
  | 'private'
  | 'trash'

export type PostType = 'post' | 'page' | 'revision'

export type Post = Tables<'posts'> & {
  user: Tables<'users'>
  meta: Record<string, string>
}

export type CountPosts = {
  status: PostStatus
  count: number
}

export type Favorite = Tables<'favorites'>

export type Vote = Tables<'votes'>

export type Analysis = Tables<'analyses'>
