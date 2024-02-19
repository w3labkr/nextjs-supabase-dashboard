'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { cn } from '@/utils/tailwind'
import { MobileNavItemProps } from '@/types'

export interface MobileNavItemsProps {
  items: MobileNavItemProps[]
}

export function MobileNavItems({ items }: MobileNavItemsProps) {
  const { t } = useTranslation()

  return items.map((item) => (
    <Link
      key={item?.id}
      className={cn(
        'group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50',
        'dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
      )}
      href={item?.href}
    >
      {item?.title && item?.translate === 'yes' ? t(item?.title) : item?.title}
    </Link>
  ))
}
