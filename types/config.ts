import { LucideIconName } from '@/lib/lucide-icon'

export interface SiteConfig {
  name: string
  title: string
  symbol: LucideIconName
  description: string
}

export interface DashboardMiniNavSubItem {
  id: number
  href: string
  title: string
  iconName?: LucideIconName
  translate?: 'yes' | 'no'
  disabled?: boolean
  badge?: number
  roles?: string[]
}

export interface DashboardMiniNavItem {
  id: number
  items: DashboardMiniNavSubItem[]
  separator?: boolean
  roles?: string[]
}

export interface DashboardNavSubItem {
  id: number
  href: string
  title: string
  iconName?: LucideIconName
  translate?: 'yes' | 'no'
  disabled?: boolean
  roles?: string[]
}

export interface DashboardNavItem {
  id: number
  label: string
  items: DashboardNavSubItem[]
  translate?: 'yes' | 'no'
  separator?: boolean
  roles?: string[]
}

export interface DashboardConfig {
  nav: DashboardMiniNavItem[]
}

export interface DashboardPageConfig {
  nav: DashboardNavItem[]
}

export interface MiddlewareAccessDenied {
  from: string
  to: string
  authenticated: boolean
}
