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

import { getMeta } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { usePostViewsAPI } from '@/queries/client/posts'
import { Post } from '@/types/database'
import { siteConfig } from '@/config/site'

interface WidgetPostViewsProps extends React.HTMLAttributes<HTMLDivElement> {}

const WidgetPostViews = (props: WidgetPostViewsProps) => {
  const { t } = useTranslation()

  const { user } = useAuth()
  const { posts } = usePostViewsAPI(user?.id ?? null, {
    // page: 1,
    // perPage: 10,
    postType: 'post',
    status: 'publish',
    // q: '',
    order: 'desc',
    limit: 10,
  })

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{t('Widget.post_views')} Top 10</CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-[20px] text-left">#</th>
              <th className="text-left">{t('Widget.post')}</th>
              <th className="w-[60px] text-right">{t('Widget.views')}</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(posts) && posts?.length > 0 ? (
              posts?.map((post: Post) => (
                <ListItem key={post?.id} post={post} />
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
  post: Post
}

const ListItem = ({ post, ...props }: ListItemProps) => {
  const views = getMeta(post?.meta, 'views', '0')

  return (
    <tr {...props}>
      <td>{post?.num}</td>
      <td>
        <Link
          href={`/dashboard/posts/edit?id=${post?.id}`}
          scroll={!siteConfig?.fixedHeader}
          className="line-clamp-1 font-serif hover:underline"
        >
          {post?.title}
        </Link>
      </td>
      <td className="text-right">{views?.toLocaleString()}</td>
    </tr>
  )
}

const EmptyItem = () => {
  const { t } = useTranslation()

  return (
    <tr>
      <td colSpan={3}>{t('Widget.empty_post')}</td>
    </tr>
  )
}

export { WidgetPostViews }
