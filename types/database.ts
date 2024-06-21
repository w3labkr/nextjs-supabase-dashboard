import { Tables } from '@/types/supabase'

export type Meta = Array<Record<string, any>>

export type Role = 'guest' | 'user' | 'admin' | 'superadmin'

export type Plan = 'free' | 'basic' | 'standard' | 'premium'

export type User = Tables<'users'> & {
  meta?: Tables<'usermeta'>[]
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
  num?: number
  author?: Tables<'users'> | null
  meta?: Tables<'postmeta'>[]
}

export type CountPosts = {
  status: PostStatus
  count: number
}

export type Tags = Tables<'tags'> & {
  meta?: Tables<'tagmeta'>[]
}

export type Favorite = Tables<'favorites'>

export type Vote = Tables<'votes'>

export type Analysis = Tables<'analyses'>
