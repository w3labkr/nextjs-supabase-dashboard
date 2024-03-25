import { LucideIconName } from '@/lib/lucide-icon'

export interface MiniDrawerItemProps {
  id: number
  href: string
  title: string
  iconName?: LucideIconName | undefined
  translate?: 'yes' | 'no' | undefined
  disabled?: boolean | undefined
  badge?: number | undefined
}

export interface MiniDrawerGroupProps {
  id: number
  items: MiniDrawerItemProps[]
  separator?: boolean | undefined
}

export interface DrawerItemProps {
  id: number
  href: string
  title: string
  iconName?: LucideIconName | undefined
  translate?: 'yes' | 'no' | undefined
  disabled?: boolean | undefined
}

export interface DrawerGroupProps {
  id: number
  label: string
  items: DrawerItemProps[]
  separator?: boolean | undefined
  translate?: 'yes' | 'no' | undefined
}

export interface DashboardConfig {
  groups: MiniDrawerGroupProps[]
}

export interface MediaConfig {
  groups: DrawerGroupProps[]
}

export interface PostsConfig {
  groups: DrawerGroupProps[]
}

export interface SettingsConfig {
  groups: DrawerGroupProps[]
}

export interface AdminConfig {
  groups: DrawerGroupProps[]
}
