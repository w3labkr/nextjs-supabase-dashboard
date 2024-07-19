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

import { usePostRank } from '@/queries/client/posts'
import { type User, type PostRank } from '@/types/database'

interface PostRanksProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User
}

const PostRanks = ({ user, ...props }: PostRanksProps) => {
  const { t } = useTranslation()
  const { posts, isLoading } = usePostRank(user?.id, {
    // q: '',
    orderBy: 'views',
    order: 'desc',
    perPage: 10,
    page: 1,
  })

  if (isLoading) {
    return <Skeleton className="h-60 w-full" />
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{t('post_views_top_%d', { count: 10 })}</CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-[20px] text-left">#</th>
              <th className="text-left">{t('post')}</th>
              <th className="w-[60px] text-right">{t('views')}</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(posts) && posts?.length > 0 ? (
              posts?.map((post: PostRank) => (
                <ListItem key={post?.num} post={post} />
              ))
            ) : (
              <EmptyItem />
            )}
          </tbody>
        </table>
      </CardContent>
      {/* <CardFooter></CardFooter> */}
    </Card>
  )
}

interface ListItemProps extends React.HTMLAttributes<HTMLTableRowElement> {
  post: PostRank
}

const ListItem = ({ post, ...props }: ListItemProps) => {
  return (
    <tr {...props}>
      <td>{post?.num}</td>
      <td>
        <Link
          href={`/dashboard/posts/edit?id=${post?.id}`}
          className="line-clamp-1 font-serif hover:underline"
        >
          {post?.title}
        </Link>
      </td>
      <td className="text-right">{post?.views?.toLocaleString()}</td>
    </tr>
  )
}

const EmptyItem = () => {
  const { t } = useTranslation()

  return (
    <tr>
      <td colSpan={3}>{t('no_posts_yet')}</td>
    </tr>
  )
}

export { PostRanks }
