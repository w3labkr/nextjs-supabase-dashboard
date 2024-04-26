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

import { PostItemProvider, usePostItem } from './context/post-item-provider'
import { EditLink } from './components/edit-link'
import { ViewLink } from './components/view-link'
import { TrashButton } from './components/trash-button'
import { RestoreButton } from './components/restore-button'
import { DeleteButton } from './components/delete-button'

import { Post, CountPosts, PostStatus } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { useQueryString } from '@/hooks/use-query-string'
import { usePostsAPI, useCountPostsAPI } from '@/hooks/api'

export function PostList() {
  const searchParams = useSearchParams()

  const page = +(searchParams.get('page') ?? '1')
  const perPage = +(searchParams.get('perPage') ?? '5')
  const pageSize = +(searchParams.get('pageSize') ?? '10')
  const status = searchParams.get('status')

  const value = React.useMemo(() => {
    return {
      page,
      perPage,
      pageSize,
      status,
    }
  }, [page, perPage, pageSize, status])

  return (
    <PagingProvider value={value}>
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
      <HeadLink value={null} label="all" count={count ?? 0} />
      {data?.map((posts: CountPosts) => {
        return (
          <React.Fragment key={posts?.status}>
            <span>|</span>
            <HeadLink
              value={posts?.status}
              label={posts?.status}
              count={posts?.count}
            />
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
  value: PostStatus | null
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
  const { id, created_at, title, status, profile } = post

  return (
    <PostItemProvider value={{ post }}>
      <TableRow>
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell align="center">{id}</TableCell>
        <TableCell>
          <div className="line-clamp-1">
            {title}
            {status !== 'publish' ? ` - ${t(`PostStatus.${status}`)}` : null}
          </div>
          <div className="flex items-center space-x-1">
            {status === 'publish' || status === 'private' ? (
              <DefaultActions />
            ) : status === 'trash' ? (
              <TrashActions />
            ) : (
              <DraftActions />
            )}
          </div>
        </TableCell>
        <TableCell align="center">{profile?.full_name}</TableCell>
        <TableCell align="center">
          {status === 'private' ? (
            <LucideIcon name="LockKeyhole" className="size-4 min-w-4" />
          ) : (
            <LucideIcon name="LockKeyholeOpen" className="size-4 min-w-4" />
          )}
        </TableCell>
        <TableCell align="center">
          {post?.views?.toLocaleString('en-US')}
        </TableCell>
        <TableCell align="center">
          {dayjs(created_at).format('YYYY-MM-DD HH:mm')}
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
