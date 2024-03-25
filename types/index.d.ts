import httpStatusCode from '@/public/locales/en/httpstatuscode.json'
import { LucideIconName } from '@/lib/lucide-icon'

export interface MobileNavItem {
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
}

export interface MobileSiteConfig {
  name: string
  title: string
  symbol: LucideIconName
  description: string
  nav: MobileNavItem[]
}

export type HttpStatusCode = keyof typeof httpStatusCode
