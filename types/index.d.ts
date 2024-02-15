import { LinkProps } from 'next/link'
import { LucideIconProps } from '@/lib/lucide-icon'

export interface MobileNavItemProps {
  id: number
  href: LinkProps['href']
  title: string
}

export interface SiteConfig {
  name: string
  title: string
  symbol: LucideIconProps['name']
  description: string
  mobileNavItems: MobileNavItemProps[]
}
