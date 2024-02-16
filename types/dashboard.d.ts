import { LucideIconProps } from '@/lib/lucide-icon'

export interface MiniDrawerItemProps {
  id: number
  href: string
  title: string
  iconName?: LucideIconProps['name']
  badge?: number
}

export interface MiniDrawerGroupItemProps {
  id: number
  items: MiniDrawerItemProps[]
  separator?: boolean
}

export interface DrawerItemProps {
  id: number
  href: string
  title: string
  iconName?: LucideIconProps['name']
}

export interface DrawerGroupItemProps {
  id: number
  label: string
  items: DrawerItemProps[]
  separator?: boolean
}

export interface DashboardConfig {
  miniDrawerGroupItems: MiniDrawerGroupItemProps[]
}

export interface MediaConfig {
  drawerGroupItems: DrawerGroupItemProps[]
}

export interface PostsConfig {
  drawerGroupItems: DrawerGroupItemProps[]
}

export interface SettingsConfig {
  drawerGroupItems: DrawerGroupItemProps[]
}
