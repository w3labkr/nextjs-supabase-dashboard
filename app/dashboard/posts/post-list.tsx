'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
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

import { PagingProvider, usePaging } from '@/components/paging/paging-provider'
import { Paging } from '@/components/paging'

import { PostProvider } from './context/post-provider'
import { EditLink } from './components/edit-link'
import { ViewLink } from './components/view-link'
import { TrashButton } from './components/trash-button'
import { RestoreButton } from './components/restore-button'
import { DeleteButton } from './components/delete-button'

import { Post, CountPosts, PostStatus } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { useQueryString } from '@/hooks/use-query-string'
import { usePostsAPI, useCountPostsAPI } from '@/queries/sync'

export function PostList() {
  const searchParams = useSearchParams()

  const page = +(searchParams.get('page') ?? '1')
  const perPage = +(searchParams.get('perPage') ?? '50')
  const pageSize = +(searchParams.get('pageSize') ?? '10')
  const status = searchParams.get('status') ?? undefined

  const { user } = useAuth()
  const { count } = usePostsAPI(user?.id ?? null, {
    page,
    perPage,
    status,
  })

  return (
    <PagingProvider
      value={{ total: count ?? 0, page, perPage, pageSize, status }}
    >
      <Header />
      <Body />
      <Footer />
    </PagingProvider>
  )
}

function Header() {
  const { user } = useAuth()
  const { data, count: total } = useCountPostsAPI(user?.id ?? null)

  return (
    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
      <HeadLink value={undefined} label="all" count={total ?? 0} />
      {data?.map(({ status, count }: CountPosts) => {
        return (
          <React.Fragment key={status}>
            <span>|</span>
            <HeadLink value={status} label={status} count={count} />
          </React.Fragment>
        )
      })}
    </div>
  )
}

function HeadLink({
  value,
  label,
  count,
}: {
  value?: PostStatus
  label: PostStatus | 'all'
  count: number
}) {
  const { t } = useTranslation()
  const { status } = usePaging()
  const { qs } = useQueryString()
  const pathname = usePathname()

  return (
    <Link
      href={pathname + '?' + qs({ status: value, page: 1 })}
      className={cn(
        'h-auto p-0',
        value === status ? 'text-foreground' : 'text-muted-foreground'
      )}
    >
      {t(`PostStatus.${label}`)}({count})
    </Link>
  )
}

function Footer() {
  const { user } = useAuth()
  const { page, perPage, status } = usePaging()
  const { posts } = usePostsAPI(user?.id ?? null, {
    page,
    perPage,
    status,
  })

  if (!posts) return null

  return <Paging className="mt-16" />
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
          <TableHead className="w-[70px] text-center">
            {t('Table.num')}
          </TableHead>
          <TableHead>{t('Table.title')}</TableHead>
          <TableHead className="w-[120px] text-center">
            {t('Table.author')}
          </TableHead>
          <TableHead className="w-[70px] text-center">
            {t('Table.status')}
          </TableHead>
          <TableHead className="w-[100px] text-center">
            {t('Table.views')}
          </TableHead>
          <TableHead className="w-[170px] text-center">
            {t('Table.created_at')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts === null ? (
          <LoadingItem />
        ) : posts?.length > 0 ? (
          posts?.map((post: Post) => <PostItem key={post?.id} post={post} />)
        ) : (
          <EmptyItem />
        )}
      </TableBody>
    </Table>
  )
}

function PostItem({ post }: { post: Post }) {
  const { t } = useTranslation()

  return (
    <PostProvider value={{ post }}>
      <TableRow>
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell align="center">{post?.id}</TableCell>
        <TableCell>
          <div className="line-clamp-1">
            {post?.title}
            {post?.status !== 'publish'
              ? ` - ${t(`PostStatus.${post?.status}`)}`
              : null}
          </div>
          <div className="flex items-center space-x-1">
            {post?.status === 'publish' || post?.status === 'private' ? (
              <DefaultActions />
            ) : post?.status === 'trash' ? (
              <TrashActions />
            ) : (
              <DraftActions />
            )}
          </div>
        </TableCell>
        <TableCell align="center">{post?.profile?.full_name}</TableCell>
        <TableCell align="center">
          {post?.status === 'private' ? (
            <LucideIcon name="LockKeyhole" className="size-4 min-w-4" />
          ) : (
            <LucideIcon name="LockKeyholeOpen" className="size-4 min-w-4" />
          )}
        </TableCell>
        <TableCell align="center">
          {post?.views?.toLocaleString('en-US')}
        </TableCell>
        <TableCell align="center">
          {dayjs(post?.created_at).format('YYYY-MM-DD HH:mm')}
        </TableCell>
      </TableRow>
    </PostProvider>
  )
}

function EmptyItem() {
  const { t } = useTranslation()

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell colSpan={6} align="center">
        {t('Table.empty_post')}
      </TableCell>
    </TableRow>
  )
}

function LoadingItem() {
  const { t } = useTranslation()

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell colSpan={5} align="center">
        {t('Table.is_loading')}
      </TableCell>
    </TableRow>
  )
}

function DefaultActions() {
  return (
    <>
      <EditLink />
      <span>|</span>
      <TrashButton />
      <span>|</span>
      <ViewLink />
    </>
  )
}

function DraftActions() {
  return (
    <>
      <EditLink />
      <span>|</span>
      <TrashButton />
    </>
  )
}

function TrashActions() {
  return (
    <>
      <RestoreButton />
      <span>|</span>
      <DeleteButton />
    </>
  )
}
