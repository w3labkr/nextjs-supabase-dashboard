'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { PagingProvider, usePaging } from '@/components/paging/paging-provider'
import { Paging } from '@/components/paging'

import { PostItemProvider } from './components/post-item-provider'
import { EditPostLink } from './components/edit-post-link'
import { ViewPostLink } from './components/view-post-link'
import { TrashPostButton } from './components/trash-post-button'
import { RestorePostButton } from './components/restore-post-button'
import { DeletePostButton } from './components/delete-post-button'

import { Post, CountPosts, PostStatus } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { usePostsAPI, useCountPostsAPI } from '@/hooks/api'

export function PostList() {
  return (
    <PagingProvider>
      <Header />
      <Body />
      <Footer />
    </PagingProvider>
  )
}

function Header() {
  const { user } = useAuth()
  const { data, count } = useCountPostsAPI(user?.id ?? null)

  return (
    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
      <HeadLink status="all" count={count ?? 0} />
      {data?.map((posts: CountPosts) => {
        return (
          <React.Fragment key={posts?.status}>
            {posts?.count > 0 ? (
              <>
                <span>|</span>
                <HeadLink status={posts?.status} count={posts?.count} />
              </>
            ) : null}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function HeadLink({
  status,
  count,
}: {
  status: PostStatus | 'all'
  count: number
}) {
  const { t } = useTranslation()
  const { status: pagingStatus, setStatus } = usePaging()

  return (
    <Button
      variant="link"
      className={cn(
        'h-auto p-0',
        pagingStatus === status ? 'text-foreground' : 'text-muted-foreground'
      )}
      onClick={() => setStatus(status)}
    >
      {t(`PostStatus.${status}`)}({count})
    </Button>
  )
}

function Footer() {
  const { user } = useAuth()
  const { page, perPage, status } = usePaging()
  const { count } = usePostsAPI(user?.id ?? null, {
    page,
    perPage,
    status,
  })

  if (count === null) return null

  return <Paging total={count} />
}

function Body() {
  const { t } = useTranslation()

  const { user } = useAuth()
  const { page, perPage, status } = usePaging()
  const { posts } = usePostsAPI(user?.id ?? null, {
    page,
    perPage,
    status,
  })

  return (
    <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox />
          </TableHead>
          <TableHead className="w-[70px]">{t('TableHead.num')}</TableHead>
          <TableHead>{t('TableHead.title')}</TableHead>
          <TableHead className="w-[100px]">{t('TableHead.author')}</TableHead>
          <TableHead className="w-[200px]">
            {t('TableHead.created_at')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts === null ? (
          <LoadingItem />
        ) : posts?.length > 0 ? (
          posts?.map((post) => <ListItem key={post?.id} post={post} />)
        ) : (
          <EmptyItem />
        )}
      </TableBody>
    </Table>
  )
}

function ListItem({ post }: { post: Post }) {
  const { t } = useTranslation()
  const { status } = usePaging()

  return (
    <PostItemProvider value={{ post }}>
      <TableRow>
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell>{post?.id}</TableCell>
        <TableCell>
          <div>
            {post?.title}
            {post?.status !== 'publish'
              ? ` - ${t(`PostStatus.${post?.status}`)}`
              : null}
          </div>
          <div className="flex items-center space-x-1">
            {status === 'trash' ? <TrashActions /> : <DefaultActions />}
          </div>
        </TableCell>
        <TableCell>{post?.profile?.full_name}</TableCell>
        <TableCell>
          {dayjs(post?.created_at).format('YYYY-MM-DD HH:mm')}
        </TableCell>
      </TableRow>
    </PostItemProvider>
  )
}

function EmptyItem() {
  const { t } = useTranslation()

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell colSpan={6} align="center">
        {t('TableCell.empty_post')}
      </TableCell>
    </TableRow>
  )
}

function LoadingItem() {
  const { t } = useTranslation()

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell colSpan={5} align="center">
        {t('TableCell.is_loading')}
      </TableCell>
    </TableRow>
  )
}

function DefaultActions() {
  return (
    <>
      <EditPostLink
        className="text-blue-700"
        text="PostList.EditPostLink"
        translate="yes"
      />
      <span>|</span>
      <TrashPostButton />
      <span>|</span>
      <ViewPostLink />
    </>
  )
}

function TrashActions() {
  return (
    <>
      <RestorePostButton />
      <span>|</span>
      <DeletePostButton />
      <span>|</span>
      <EditPostLink text="PostList.ViewPostLink" translate="yes" />
    </>
  )
}
