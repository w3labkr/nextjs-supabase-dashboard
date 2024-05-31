import { Tables } from '@/types/supabase'

export type Meta = {
  [key: string]: string | null
}

export type UserRole = 'guest' | 'user' | 'admin' | 'superadmin'

export type UserPlan = 'free' | 'basic' | 'standard' | 'premium'

export type UserMeta = Tables<'user_metas'>

export type User = Tables<'users'> & {
  role: string
  plan: string
  meta: Meta
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

export type Post = Tables<'posts'> & {
  user: Tables<'users'>
  meta: Meta
}

export type CountPosts = {
  status: PostStatus
  count: number
}

export type Favorite = Tables<'favorites'>

export type Vote = Tables<'votes'>

export type Analysis = Tables<'analyses'>
