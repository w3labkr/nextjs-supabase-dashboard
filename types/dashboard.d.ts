import { LucideIconProps } from '@/lib/lucide-icon'

export interface MiniDrawerItemProps {
  id: number
  href: string
  iconName: LucideIconProps['name']
  title?: string
  badge?: number
  separator?: boolean
}

export interface DrawerItemProps {
  id: number
  title: string
  href: string
}

export interface DashboardConfig {
  miniDrawer: MiniDrawerItemProps[]
}

export interface MediaConfig {
  drawerItems: DrawerItemProps[]
}

export interface PostsConfig {
  drawerItems: DrawerItemProps[]
}

export interface SettingsConfig {
  drawerItems: DrawerItemProps[]
}
