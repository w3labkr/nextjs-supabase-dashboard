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

import { EditLink } from './components/edit-link'
import { ViewLink } from './components/view-link'
import { TrashButton } from './components/trash-button'
import { RestoreButton } from './components/restore-button'
import { DeleteButton } from './components/delete-button'

import { Post, PostStatus } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { useQueryString } from '@/hooks/use-query-string'
import { usePostsAPI, useCountPostsAPI } from '@/queries/client/posts'

const PostList = () => {
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

  const total = count ?? 0

  return (
    <PagingProvider value={{ total, page, perPage, pageSize, status }}>
      <Header />
      <Body />
      <Footer />
    </PagingProvider>
  )
}

const Header = () => {
  const { user } = useAuth()
  const { data, count } = useCountPostsAPI(user?.id ?? null, {
    postType: 'post',
  })

  const status: { [key: string]: number } | undefined = React.useMemo(() => {
    return data?.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.status] = curr.count
      return acc
    }, {})
  }, [data])

  return (
    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
      <HeadLink value={undefined} label="all" count={count ?? 0} />
      <span>|</span>
      <HeadLink value="publish" label="publish" count={status?.publish ?? 0} />
      <span>|</span>
      <HeadLink value="future" label="future" count={status?.future ?? 0} />
      <span>|</span>
      <HeadLink value="draft" label="draft" count={status?.draft ?? 0} />
      {/* <span>|</span> */}
      {/* <HeadLink value="pending" label="pending" count={status?.pending ?? 0} /> */}
      <span>|</span>
      <HeadLink value="private" label="private" count={status?.private ?? 0} />
      <span>|</span>
      <HeadLink value="trash" label="trash" count={status?.trash ?? 0} />
    </div>
  )
}

const HeadLink = ({
  value,
  label,
  count,
}: {
  value?: PostStatus
  label: PostStatus | 'all'
  count: number
}) => {
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

const Footer = () => {
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

const Body = () => {
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

const PostItem = ({ post }: { post: Post }) => {
  const { t } = useTranslation()

  return (
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
            <>
              <EditLink post={post} />
              <span>|</span>
              <TrashButton post={post} />
              <span>|</span>
              <ViewLink post={post} />
            </>
          ) : post?.status === 'trash' ? (
            <>
              <RestoreButton post={post} />
              <span>|</span>
              <DeleteButton post={post} />
            </>
          ) : (
            <>
              <EditLink post={post} />
              <span>|</span>
              <TrashButton post={post} />
            </>
          )}
        </div>
      </TableCell>
      <TableCell align="center">{post?.author?.full_name}</TableCell>
      <TableCell align="center">
        {post?.status === 'private' ? (
          <LucideIcon name="LockKeyhole" className="size-4 min-w-4" />
        ) : (
          <LucideIcon name="LockKeyholeOpen" className="size-4 min-w-4" />
        )}
      </TableCell>
      <TableCell align="center">
        {post?.meta?.view_count?.toLocaleString()}
      </TableCell>
      <TableCell align="center">
        {dayjs(post?.created_at).format('YYYY-MM-DD HH:mm')}
      </TableCell>
    </TableRow>
  )
}

const EmptyItem = () => {
  const { t } = useTranslation()

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell colSpan={6} align="center">
        {t('Table.empty_post')}
      </TableCell>
    </TableRow>
  )
}

const LoadingItem = () => {
  const { t } = useTranslation()

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell colSpan={5} align="center">
        {t('Table.is_loading')}
      </TableCell>
    </TableRow>
  )
}

export { PostList }
