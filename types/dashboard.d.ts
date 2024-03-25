import { LucideIconName } from '@/lib/lucide-icon'

export interface DashboardMiniNavSubItem {
  id: number
  href: string
  title: string
  iconName?: LucideIconName | undefined
  translate?: 'yes' | 'no' | undefined
  disabled?: boolean | undefined
  badge?: number | undefined
}

export interface DashboardMiniNavItem {
  id: number
  items: DashboardMiniNavSubItem[]
  separator?: boolean | undefined
}

export interface DashboardNavSubItem {
  id: number
  href: string
  title: string
  iconName?: LucideIconName | undefined
  translate?: 'yes' | 'no' | undefined
  disabled?: boolean | undefined
}

export interface DashboardNavItem {
  id: number
  label: string
  items: DashboardNavSubItem[]
  separator?: boolean | undefined
  translate?: 'yes' | 'no' | undefined
}

export interface DashboardConfig {
  nav: DashboardMiniNavItem[]
}

export interface MediaConfig {
  nav: DashboardNavItem[]
}

export interface PostsConfig {
  nav: DashboardNavItem[]
}

export interface SettingsConfig {
  nav: DashboardNavItem[]
}

export interface AdminConfig {
  nav: DashboardNavItem[]
}
