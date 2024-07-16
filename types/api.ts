import { User as AuthUser, AuthError, Pagination } from '@supabase/supabase-js'
import {
  Email,
  Notification,
  Post,
  CountPosts,
  Favorite,
  Tag,
  Vote,
  User,
  Statistic,
  PostRank,
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
  | { data: Tag[] | null; error: null }
  | { data: null; error: Error }

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
