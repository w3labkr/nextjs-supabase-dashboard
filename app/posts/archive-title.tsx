'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

interface ArchiveTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  q?: string
}

const ArchiveTitle = ({ q, ...props }: ArchiveTitleProps) => {
  const { t } = useTranslation()

  return (
    <h2 {...props}>{q ? t('SearchResults.title') + q : t('words.posts')}</h2>
  )
}

export { ArchiveTitle, type ArchiveTitleProps }
