'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Tag } from '@/types/database'

interface QuickEditProps {
  tag: Tag
}

const QuickEdit = ({ tag }: QuickEditProps) => {
  const { t } = useTranslation()

  return (
    <Link
      href={`/dashboard/tags/edit?id=${tag?.id}`}
      className="text-xs text-blue-700 hover:underline dark:text-white"
    >
      {t('edit')}
    </Link>
  )
}

export { QuickEdit, type QuickEditProps }
