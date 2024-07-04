'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { LucideIcon } from '@/lib/lucide-icon'
import { getProfileUrl } from '@/lib/utils'
import { User } from '@/types/database'

const RecentLink = ({ user }: { user: User }) => {
  const { t } = useTranslation()

  return (
    <Link
      href={getProfileUrl(user) ?? '#'}
      className="flex items-center text-muted-foreground"
    >
      <LucideIcon name="History" size={16} className="mr-1" />
      {t('posts')}
    </Link>
  )
}

const FavoritesLink = ({ user }: { user: User }) => {
  const { t } = useTranslation()

  return (
    <Link href="#" className="flex items-center">
      <LucideIcon
        name="Heart"
        fill="#ef4444"
        size={16}
        className="mr-1 text-destructive"
      />
      {t('favorites')}
    </Link>
  )
}

export { RecentLink, FavoritesLink }
