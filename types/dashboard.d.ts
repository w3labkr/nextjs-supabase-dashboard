import { LucideIconNameProp } from '@/lib/lucide-icon'

export interface MiniDrawerItemProps {
  id: number
  href: string
  title: string
  iconName?: LucideIconNameProp | undefined
  badge?: number | undefined
}

export interface MiniDrawerGroupItemProps {
  id: number
  items: MiniDrawerItemProps[]
  separator?: boolean | undefined
}

export interface DrawerItemProps {
  id: number
  href: string
  title: string
  iconName?: LucideIconNameProp | undefined
  translate?: 'yes' | 'no' | undefined
}

export interface DrawerGroupItemProps {
  id: number
  label: string
  items: DrawerItemProps[]
  separator?: boolean | undefined
  translate?: 'yes' | 'no' | undefined
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
