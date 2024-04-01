import { LucideIconName } from '@/lib/lucide-icon'
import { UserRole } from '@/types/database'

export interface SiteConfig {
  name: string
  title: string
  symbol: LucideIconName
  description: string
}

export interface MobileNavItem {
  id: number
  href: string
  title: string
  translate?: 'yes' | 'no'
}

export interface MobileSiteConfig {
  name: string
  title: string
  symbol: LucideIconName
  description: string
  nav: MobileNavItem[]
}

export interface DashboardMiniNavSubItem {
  id: number
  href: string
  title: string
  iconName?: LucideIconName
  translate?: 'yes' | 'no'
  disabled?: boolean
  badge?: number
  roles?: UserRole[]
}

export interface DashboardMiniNavItem {
  id: number
  items: DashboardMiniNavSubItem[]
  separator?: boolean
  roles?: UserRole[]
}

export interface DashboardNavSubItem {
  id: number
  href: string
  title: string
  iconName?: LucideIconName
  translate?: 'yes' | 'no'
  disabled?: boolean
  roles?: UserRole[]
}

export interface DashboardNavItem {
  id: number
  label: string
  items: DashboardNavSubItem[]
  translate?: 'yes' | 'no'
  separator?: boolean
  roles?: UserRole[]
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
  isAuthenticated: boolean
}
