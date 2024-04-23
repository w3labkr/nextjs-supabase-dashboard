'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { usePostItem } from './post-item-provider'

export function ViewPostLink() {
  const { t } = useTranslation()
  const { post } = usePostItem()

  return <span className="text-xs">{t('PostList.ViewPostLink')}</span>
}
