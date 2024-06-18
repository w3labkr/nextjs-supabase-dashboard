'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

interface EmptyPostsProps extends React.HTMLAttributes<HTMLDivElement> {
  q?: string
}

const EmptyPosts = ({ q, ...props }: EmptyPostsProps) => {
  const { t } = useTranslation()

  return (
    <div {...props}>
      {q ? t('SearchResults.empty') : t('sentences.no_posts_yet')}
    </div>
  )
}

export { EmptyPosts, type EmptyPostsProps }
