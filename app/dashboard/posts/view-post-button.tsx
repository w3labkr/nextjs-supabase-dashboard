'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { Post } from '@/types/database'

export function ViewPostButton({ post }: { post: Post }) {
  const { t } = useTranslation()

  return <span className="text-xs">{t('PostList.ViewPostButton')}</span>
}
