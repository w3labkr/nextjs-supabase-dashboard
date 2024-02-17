'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { cn } from '@/utils/tailwind'
import { LucideIcon } from '@/lib/lucide-icon'

import { DrawerItemProps } from '@/types/dashboard'

export interface DrawerItemsProps {
  items: DrawerItemProps[]
  pathname: string
}

export function DrawerItems({ items, pathname }: DrawerItemsProps) {
  const { t } = useTranslation()

  return items.map((item) => (
    <Link
      key={item.id}
      href={item.href}
      className={cn(
        'relative flex rounded px-2 py-1 text-sm text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
        pathname.startsWith(item.href) ? 'bg-gray-100 text-gray-900' : ''
      )}
    >
      {item.iconName && (
        <LucideIcon
          name={item.iconName}
          className="mr-2 mt-0.5 size-4 min-w-4"
        />
      )}
      {item.title && item.translate === 'yes' ? t(item.title) : item.title}
    </Link>
  ))
}
