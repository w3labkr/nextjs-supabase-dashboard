import { LucideIconNameProp } from '@/lib/lucide-icon'

export interface MobileNavItemProps {
  id: number
  href: string
  title: string
  translate?: 'yes' | 'no' | undefined
}

export interface SiteConfig {
  name: string
  title: string
  symbol: LucideIconNameProp
  description: string
  mobileNavItems: MobileNavItemProps[]
}
