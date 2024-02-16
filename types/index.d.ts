import { LinkProps } from 'next/link'
import { LucideIconNameProp } from '@/lib/lucide-icon'

export interface MobileNavItemProps {
  id: number
  href: LinkProps['href']
  title: string
}

export interface SiteConfig {
  name: string
  title: string
  symbol: LucideIconNameProp
  description: string
  mobileNavItems: MobileNavItemProps[]
}
