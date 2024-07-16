'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Tag } from '@/types/database'

interface QuickViewProps {
  tag: Tag
}

const QuickView = ({ tag }: QuickViewProps) => {
  const { t } = useTranslation()

  return (
    <Link
      href={tag?.slug ? `/posts?tag=${tag?.slug}` : '#'}
      className="text-xs text-blue-700 hover:underline dark:text-white"
    >
      {t('view')}
    </Link>
  )
}

export { QuickView, type QuickViewProps }
