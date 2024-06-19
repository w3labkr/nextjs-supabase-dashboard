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
      {q
        ? t('sorry_but_nothing_matched_your_search_terms') +
          t('please_try_again_with_some_different_keywords')
        : t('no_posts_yet')}
    </div>
  )
}

export { EmptyPosts, type EmptyPostsProps }
