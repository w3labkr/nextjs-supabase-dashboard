/**
 * Generating Types
 *
 * @description
 * Api Docs > Introduction > Generating Types
 *
 * @link https://supabase.com/docs/guides/api/rest/generating-types
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analyses: {
        Row: {
          created_at: string
          id: number
          ip: unknown | null
          post_id: number
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          ip?: unknown | null
          post_id: number
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          ip?: unknown | null
          post_id?: number
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'analyses_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'analyses_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      emails: {
        Row: {
          created_at: string
          email: string
          email_confirmed_at: string | null
          id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          email_confirmed_at?: string | null
          id?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          email_confirmed_at?: string | null
          id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'emails_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: number
          is_favorite: number
          post_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_favorite?: number
          post_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_favorite?: number
          post_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'favorites_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'favorites_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          marketing_emails: boolean
          security_emails: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          marketing_emails?: boolean
          security_emails?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          marketing_emails?: boolean
          security_emails?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      postmeta: {
        Row: {
          id: number
          meta_key: string | null
          meta_value: string | null
          post_id: number
        }
        Insert: {
          id?: number
          meta_key?: string | null
          meta_value?: string | null
          post_id: number
        }
        Update: {
          id?: number
          meta_key?: string | null
          meta_value?: string | null
          post_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'postmeta_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
        ]
      }
      posts: {
        Row: {
          banned_until: string | null
          content: string | null
          created_at: string
          deleted_at: string | null
          excerpt: string | null
          id: number
          is_ban: boolean
          password: string | null
          published_at: string | null
          slug: string | null
          status: string
          thumbnail_url: string | null
          title: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          banned_until?: string | null
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          id?: number
          is_ban?: boolean
          password?: string | null
          published_at?: string | null
          slug?: string | null
          status?: string
          thumbnail_url?: string | null
          title?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          banned_until?: string | null
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          id?: number
          is_ban?: boolean
          password?: string | null
          published_at?: string | null
          slug?: string | null
          status?: string
          thumbnail_url?: string | null
          title?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'posts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          username: string
          website: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
          username: string
          website?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          username?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      role_permissions: {
        Row: {
          id: number
          permission: string
          role: string
        }
        Insert: {
          id?: number
          permission: string
          role: string
        }
        Update: {
          id?: number
          permission?: string
          role?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          created_at: string
          id: number
          plan: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          plan?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          plan?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_plans_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: number
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_roles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      usermeta: {
        Row: {
          id: number
          meta_key: string | null
          meta_value: string | null
          user_id: string
        }
        Insert: {
          id?: number
          meta_key?: string | null
          meta_value?: string | null
          user_id: string
        }
        Update: {
          id?: number
          meta_key?: string | null
          meta_value?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'usermeta_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          banned_until: string | null
          created_at: string
          deleted_at: string | null
          has_set_password: boolean
          id: string
          is_ban: boolean
          updated_at: string
          username_changed_at: string | null
        }
        Insert: {
          banned_until?: string | null
          created_at?: string
          deleted_at?: string | null
          has_set_password?: boolean
          id: string
          is_ban?: boolean
          updated_at?: string
          username_changed_at?: string | null
        }
        Update: {
          banned_until?: string | null
          created_at?: string
          deleted_at?: string | null
          has_set_password?: boolean
          id?: string
          is_ban?: boolean
          updated_at?: string
          username_changed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      votes: {
        Row: {
          created_at: string
          id: number
          is_dislike: number
          is_like: number
          post_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_dislike?: number
          is_like?: number
          post_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_dislike?: number
          is_like?: number
          post_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'votes_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'votes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_users_to_public_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      count_posts: {
        Args: {
          uid: string
          post_type?: string
        }
        Returns: {
          status: string
          count: number
        }[]
      }
      create_new_posts: {
        Args: {
          user_email: string
        }
        Returns: undefined
      }
      create_new_user: {
        Args: {
          email: string
          password: string
        }
        Returns: string
      }
      generate_username: {
        Args: {
          email: string
        }
        Returns: string
      }
      get_adjacent_post_id: {
        Args: {
          pid: number
          uid: string
          post_type?: string
          post_status?: string
        }
        Returns: {
          previous_id: number
          next_id: number
        }[]
      }
      get_user: {
        Args: {
          uid: string
        }
        Returns: {
          id: string
          created_at: string
          updated_at: string
          deleted_at: string
          username_changed_at: string
          has_set_password: boolean
          is_ban: boolean
          banned_until: string
          role: string
          plan: string
        }[]
      }
      get_vote: {
        Args: {
          pid: number
        }
        Returns: {
          id: number
          like_count: number
          dislike_count: number
        }[]
      }
      set_is_dislike: {
        Args: {
          uid: string
          pid: number
          isdislike: number
        }
        Returns: undefined
      }
      set_is_like: {
        Args: {
          uid: string
          pid: number
          islike: number
        }
        Returns: undefined
      }
      set_view_count: {
        Args: {
          pid: number
        }
        Returns: undefined
      }
      verify_user_password: {
        Args: {
          uid: string
          password: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
