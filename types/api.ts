import {
  type User as AuthUser,
  type AuthError,
  type Pagination,
} from '@supabase/supabase-js'
import {
  type Email,
  type Notification,
  type Post,
  type CountPosts,
  type Favorite,
  type Tag,
  type Vote,
  type User,
  type Statistic,
  type PostRank,
} from '@/types/database'

export type UserAPI =
  | { data: User | null; error: null }
  | { data: null; error: Error }

export type UsersAPI =
  | { data: { users: AuthUser[]; aud: string } & Pagination; error: null }
  | { data: { users: [] }; error: AuthError }

export type EmailAPI =
  | { data: Email; error: null }
  | { data: null; error: Error }

export type EmailsAPI =
  | { data: Email[]; error: null }
  | { data: null; error: Error }

export type NotificationAPI =
  | { data: Notification; error: null }
  | { data: null; error: Error }

export type PostAPI =
  | { data: Post | null; error: null }
  | { data: null; error: Error }

export type PostsAPI =
  | { data: Post[]; count: number; error: null }
  | { data: null; count: null; error: Error }

export type CountPostsAPI =
  | { data: CountPosts[]; count: number; error: null }
  | { data: null; count: null; error: Error }

export type PostRankAPI =
  | { data: PostRank[]; count: number; error: null }
  | { data: null; count: null; error: Error }

export type FavoriteAPI =
  | { data: Favorite | null; error: null }
  | { data: null; error: Error }

export type TagAPI =
  | { data: Tag | null; error: null }
  | { data: null; error: Error }

export type TagsAPI =
  | { data: Tag[] | null; count: number; error: null }
  | { data: null; count: null; error: Error }

export type VoteAPI =
  | { data: Vote | null; error: null }
  | { data: null; error: Error }

export type StatisticAPI =
  | { data: Statistic | null; error: null }
  | { data: null; error: Error }

export type StatisticsAPI =
  | { data: Statistic[]; count: number; error: null }
  | { data: null; count: null; error: Error }

export type CronAPI = { data: null; error: null } | { data: null; error: Error }

export type IpAPI = string
