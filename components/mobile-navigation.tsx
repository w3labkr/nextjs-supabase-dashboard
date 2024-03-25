'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'

import { siteConfig } from '@/config/site'
import { MobileNavItemProps } from '@/types'

export interface MobileNavigationProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileNavigation({ ...props }: MobileNavigationProps) {
  return (
    <div className="grid w-full max-w-md gap-4" {...props}>
      <div className="flex items-center gap-4">
        <LucideIcon name={siteConfig?.symbol} className="size-6 min-w-6" />
        <span>{siteConfig?.name}</span>
      </div>
      <nav className="grid">
        {siteConfig?.mobileNavItems?.map((item) => (
          <MobileNavItem key={item?.id} item={item} />
        ))}
      </nav>
    </div>
  )
}

export function MobileNavItem({ item }: { item: MobileNavItemProps }) {
  const { t } = useTranslation()

  return (
    <Link
      key={item?.id}
      className={cn(
        'group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50',
        'dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
      )}
      href={item?.href}
    >
      {item?.title && item?.translate === 'yes'
        ? t(`MobileNavigation.${item?.title}`)
        : item?.title}
    </Link>
  )
}
