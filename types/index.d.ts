import httpStatusCode from '@/public/locales/en/httpstatuscode.json'
import { LucideIconName } from '@/lib/lucide-icon'

export interface MobileNavItemProps {
  id: number
  href: string
  title: string
  translate?: 'yes' | 'no' | undefined
}

export interface SiteConfig {
  name: string
  title: string
  symbol: LucideIconName
  description: string
  mobileNavItems: MobileNavItemProps[]
}

export type HttpStatusCode = keyof typeof httpStatusCode
