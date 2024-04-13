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
      emails: {
        Row: {
          created_at: string | null
          email: string
          email_confirmed_at: string | null
          id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          email_confirmed_at?: string | null
          id?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          email_confirmed_at?: string | null
          id?: number
          updated_at?: string | null
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
      notifications: {
        Row: {
          created_at: string | null
          id: number
          marketing_emails: boolean | null
          security_emails: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          marketing_emails?: boolean | null
          security_emails?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          marketing_emails?: boolean | null
          security_emails?: boolean | null
          updated_at?: string | null
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
      posts: {
        Row: {
          content: Json | null
          created_at: string | null
          deleted_at: string | null
          excerpt: string | null
          id: number
          password: string | null
          status: Database['public']['Enums']['post_status'] | null
          thumbnail: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          view: number | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          id?: number
          password?: string | null
          status?: Database['public']['Enums']['post_status'] | null
          thumbnail?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          view?: number | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          id?: number
          password?: string | null
          status?: Database['public']['Enums']['post_status'] | null
          thumbnail?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          view?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'posts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          id: number
          name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: number
          permission: Database['public']['Enums']['user_permission']
          role: Database['public']['Enums']['user_role']
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          permission: Database['public']['Enums']['user_permission']
          role: Database['public']['Enums']['user_role']
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          permission?: Database['public']['Enums']['user_permission']
          role?: Database['public']['Enums']['user_role']
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: number
          role: Database['public']['Enums']['user_role']
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          role?: Database['public']['Enums']['user_role']
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          role?: Database['public']['Enums']['user_role']
          updated_at?: string | null
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
      users: {
        Row: {
          banned_until: string | null
          created_at: string | null
          deleted_at: string | null
          has_set_password: boolean | null
          id: string
          is_ban: boolean | null
          updated_at: string | null
          username: string
        }
        Insert: {
          banned_until?: string | null
          created_at?: string | null
          deleted_at?: string | null
          has_set_password?: boolean | null
          id: string
          is_ban?: boolean | null
          updated_at?: string | null
          username: string
        }
        Update: {
          banned_until?: string | null
          created_at?: string | null
          deleted_at?: string | null
          has_set_password?: boolean | null
          id?: string
          is_ban?: boolean | null
          updated_at?: string | null
          username?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_posts: {
        Args: {
          uid: string
        }
        Returns: {
          status: Database['public']['Enums']['post_status']
          count: number
        }[]
      }
      generate_username: {
        Args: {
          email: string
        }
        Returns: string
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
          username: string
          has_set_password: boolean
          is_ban: boolean
          banned_until: string
          role: Database['public']['Enums']['user_role']
        }[]
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
      post_status:
        | 'publish'
        | 'future'
        | 'draft'
        | 'pending'
        | 'private'
        | 'trash'
      user_permission: 'posts.delete'
      user_role: 'guest' | 'user' | 'admin' | 'superadmin'
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
