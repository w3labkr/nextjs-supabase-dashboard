import { Tables } from '@/types/supabase'

export type Meta = Array<Record<string, any>>

export type Role = 'guest' | 'user' | 'admin' | 'superadmin'

export type Plan = 'free' | 'basic' | 'standard' | 'premium'

export type UserRole = Tables<'user_roles'>

export type UserPlan = Tables<'user_plans'>

export type UserMeta = Tables<'user_metas'>

export type User = Tables<'users'> & {
  role?: string
  plan?: string
  meta?: UserMeta[]
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

export type PostMeta = Tables<'post_metas'>

export type Author = Tables<'users'>

export type Post = Tables<'posts'> & {
  author?: Author | null
  meta?: PostMeta[]
}

export type CountPosts = {
  status: PostStatus
  count: number
}

export type Favorite = Tables<'favorites'>

export type Vote = Tables<'votes'>

export type Analysis = Tables<'analyses'>
