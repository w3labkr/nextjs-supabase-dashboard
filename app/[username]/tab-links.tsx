'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { LucideIcon } from '@/lib/lucide-icon'
import { getFavoritesUrl } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { User } from '@/types/database'

const RecentLink = ({ user }: { user: User }) => {
  const { t } = useTranslation()

  return (
    <Link
      href="#"
      scroll={!siteConfig?.fixedHeader}
      className="flex items-center"
    >
      <LucideIcon name="History" size={16} className="mr-1" />
      {t('posts')}
    </Link>
  )
}

const FavoritesLink = ({ user }: { user: User }) => {
  const { t } = useTranslation()

  return (
    <Link
      href={getFavoritesUrl(user) ?? '#'}
      scroll={!siteConfig?.fixedHeader}
      className="flex items-center text-muted-foreground"
    >
      <LucideIcon name="Heart" fill="transparent" size={16} className="mr-1" />
      {t('favorites')}
    </Link>
  )
}

export { RecentLink, FavoritesLink }
