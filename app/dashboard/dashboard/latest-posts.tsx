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
import { Skeleton } from '@/components/ui/skeleton'

import { useAuth } from '@/hooks/use-auth'
import { usePostsAPI } from '@/queries/client/posts'
import { Post } from '@/types/database'

interface LatestPostsProps extends React.HTMLAttributes<HTMLDivElement> {}

const LatestPosts = (props: LatestPostsProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { posts, isLoading } = usePostsAPI(user?.id ?? null, {
    // page: 1,
    // perPage: 5,
    postType: 'post',
    status: 'publish',
    // q: '',
    orderBy: 'id',
    order: 'desc',
    limit: 5,
  })

  if (isLoading) {
    return <Skeleton className="h-60 w-full" />
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{t('latest_posts')}</CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
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

const ListItem = ({ post, ...props }: ListItemProps) => {
  return (
    <div className="leading-4" {...props}>
      <span>&bull;&nbsp;</span>
      <span>
        <Link
          href={`/dashboard/posts/edit?id=${post?.id}`}
          className="font-serif hover:underline"
        >
          {post?.title}
        </Link>
      </span>
    </div>
  )
}

const EmptyItem = () => {
  const { t } = useTranslation()

  return <div>{t('no_posts_yet')}</div>
}

export { LatestPosts }
