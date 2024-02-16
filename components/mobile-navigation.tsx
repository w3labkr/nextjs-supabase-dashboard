'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation, Trans } from 'react-i18next'

import { LucideIcon } from '@/lib/lucide-icon'
import { cn } from '@/utils/tailwind'

import { MobileNavItemProps } from '@/types'
import { siteConfig } from '@/config/site'

export function MobileNavigation({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="grid w-full max-w-md gap-4" {...props}>
      <div className="flex items-center gap-4">
        <LucideIcon name={siteConfig.symbol} className="size-6" />
        <span>{siteConfig.name}</span>
      </div>
      <nav className="grid">
        <MobileNavItem items={siteConfig.mobileNavItems} />
      </nav>
    </div>
  )
}

function MobileNavItem({ items }: { items: MobileNavItemProps[] }) {
  const { t } = useTranslation()

  return items.map((item) => (
    <Link
      key={item.id}
      className={cn(
        'group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50',
        'dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
      )}
      href={item.href}
    >
      <Trans t={t}>{item.title}</Trans>
    </Link>
  ))
}
