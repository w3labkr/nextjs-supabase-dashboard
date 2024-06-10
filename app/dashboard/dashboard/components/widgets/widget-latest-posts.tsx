'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LatestPosts } from '@/components/latest-posts'

import { useAuth } from '@/hooks/use-auth'
import { usePostsAPI } from '@/queries/client/posts'

interface WidgetLatestPostsProps extends React.HTMLAttributes<HTMLDivElement> {}

const WidgetLatestPosts = (props: WidgetLatestPostsProps) => {
  const { className } = props

  const { t } = useTranslation()
  const { user } = useAuth()
  const { posts } = usePostsAPI(user?.id ?? null, {
    page: 1,
    perPage: 5,
    postType: 'post',
    status: 'publish',
  })

  const options = React.useMemo(() => {
    return {
      hideAuthor: true,
      hideDate: true,
      hideExcerpt: true,
      classNameTitle: 'text-sm',
      // classNameExcerpt: 'text-sm',
      // classNameAuthor: 'text-xs',
      // classNameDate: 'text-xs',
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('CardTitle.latest_posts')}</CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent>
        <LatestPosts className={className} posts={posts} options={options} />
      </CardContent>
      {/* <CardFooter></CardFooter> */}
    </Card>
  )
}

export { WidgetLatestPosts }
