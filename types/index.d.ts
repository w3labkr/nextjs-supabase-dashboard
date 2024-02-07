import { LucideIconProps } from '@/lib/lucide-icon'

export type MobileNavItemProps = {
  id: number
  title: string
  href: string
}

export type SiteConfig = {
  name: string
  title: string
  symbol: LucideIconProps['name']
  description: string
  mobileNavItems: MobileNavItemProps[]
}

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
  media: {
    drawerItems: DrawerItemProps[]
  }
  posts: {
    drawerItems: DrawerItemProps[]
  }
  settings: {
    drawerItems: DrawerItemProps[]
  }
}
