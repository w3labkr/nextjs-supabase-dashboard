import { LucideIconProps } from '@/lib/lucide-icon'

export interface MobileNavItemProps {
  id: number
  title: string
  href: string
}

export interface SiteConfig {
  name: string
  title: string
  symbol: LucideIconProps['name']
  description: string
  mobileNavItems: MobileNavItemProps[]
}
