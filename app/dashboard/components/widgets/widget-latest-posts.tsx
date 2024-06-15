'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { getPostUrl } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { usePostsAPI } from '@/queries/client/posts'
import { Post } from '@/types/database'
import { siteConfig } from '@/config/site'

interface WidgetLatestPostsProps extends React.HTMLAttributes<HTMLDivElement> {}

const WidgetLatestPosts = (props: WidgetLatestPostsProps) => {
  const { t } = useTranslation()

  const { user } = useAuth()
  const { posts } = usePostsAPI(user?.id ?? null, {
    page: 1,
    perPage: 5,
    postType: 'post',
    status: 'publish',
    q: '',
  })

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{t('CardTitle.latest_posts')}</CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.isArray(posts) && posts?.length > 0 ? (
            posts?.map((post: Post) => <ListItem key={post?.id} post={post} />)
          ) : (
            <EmptyItem />
          )}
        </div>
      </CardContent>
      {/* <CardFooter></CardFooter> */}
    </Card>
  )
}

interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

const ListItem = (props: ListItemProps) => {
  const { post, ...rest } = props

  return (
    <div className="text-sm leading-4" {...rest}>
      <span>&bull;&nbsp;</span>
      <span className="font-serif hover:underline">
        <Link href={getPostUrl(post) ?? '#'} scroll={!siteConfig?.fixedHeader}>
          {post?.title}
        </Link>
      </span>
    </div>
  )
}

const EmptyItem = () => {
  return <div>No posts yet</div>
}

export { WidgetLatestPosts }
