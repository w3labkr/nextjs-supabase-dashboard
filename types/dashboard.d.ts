import { LucideIconProps } from '@/lib/lucide-icon'

export type MiniDrawerItemProps = {
  id: number
  title: string
  href: string
  icon?: LucideIconProps['name']
  badge?: number
  separator?: boolean
}

export type DrawerItemProps = {
  id: number
  title: string
  href: string
}

export type DashboardConfig = {
  miniDrawer: MiniDrawerItemProps[]
}

export type MediaConfig = {
  drawerItems: DrawerItemProps[]
}

export type PostsConfig = {
  drawerItems: DrawerItemProps[]
}

export type SettingsConfig = {
  drawerItems: DrawerItemProps[]
}
