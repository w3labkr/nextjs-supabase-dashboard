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
