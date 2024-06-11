'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

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
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { PagingProvider, usePaging, Paging } from '@/components/paging'

import { SearchForm } from './components/search-form'
import { HeadLink } from './components/head-link'
import { QuickLinks } from './components/quick-links'
import { BulkActions } from './components/bulk-actions'

import { getMeta } from '@/lib/utils'
import { Post } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { usePostsAPI, useCountPostsAPI } from '@/queries/client/posts'

const PostList = () => {
  const searchParams = useSearchParams()
  const page = +((searchParams.get('page') as string) ?? '1')
  const perPage = +((searchParams.get('perPage') as string) ?? '10')
  const pageSize = +((searchParams.get('pageSize') as string) ?? '10')
  const postType = (searchParams.get('postType') as string) ?? 'post'
  const status = searchParams.get('status') as string
  const q = searchParams.get('q') as string

  const { user } = useAuth()
  const { count } = usePostsAPI(user?.id ?? null, {
    page,
    perPage,
    postType,
    status,
    q,
  })

  const total = count ?? 0

  return (
    <PagingProvider
      value={{ total, page, perPage, pageSize, postType, status, q }}
    >
      <Header />
      <Body />
      <Footer />
    </PagingProvider>
  )
}

const Header = () => {
  return (
    <div className="space-y-6">
      <HeadLinks />
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <BulkActions />
        <SearchForm />
      </div>
    </div>
  )
}

const HeadLinks = () => {
  const paging = usePaging()
  const { user } = useAuth()
  const { data, count } = useCountPostsAPI(user?.id ?? null, {
    postType: paging.postType,
    q: paging?.q,
  })

  const status: Record<string, number> | undefined = React.useMemo(() => {
    return data?.reduce((acc: Record<string, number>, curr) => {
      acc[curr.status] = curr.count
      return acc
    }, {})
  }, [data])

  return (
    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
      <HeadLink status={null} label="all" count={count ?? 0} />
      <span>|</span>
      <HeadLink status="publish" label="publish" count={status?.publish ?? 0} />
      <span>|</span>
      <HeadLink status="future" label="future" count={status?.future ?? 0} />
      <span>|</span>
      <HeadLink status="draft" label="draft" count={status?.draft ?? 0} />
      {/* <span>|</span> */}
      {/* <HeadLink status="pending" label="pending" count={status?.pending ?? 0} /> */}
      <span>|</span>
      <HeadLink status="private" label="private" count={status?.private ?? 0} />
      <span>|</span>
      <HeadLink status="trash" label="trash" count={status?.trash ?? 0} />
    </div>
  )
}

const Footer = () => {
  const paging = usePaging()
  const { user } = useAuth()
  const { posts } = usePostsAPI(user?.id ?? null, {
    page: paging?.page,
    perPage: paging?.perPage,
    postType: paging?.postType,
    status: paging?.status,
    q: paging?.q,
  })

  if (!posts) return null

  return <Paging />
}

const Body = () => {
  const { t } = useTranslation()

  const paging = usePaging()
  const { user } = useAuth()
  const { posts } = usePostsAPI(user?.id ?? null, {
    page: paging?.page,
    perPage: paging?.perPage,
    postType: paging?.postType,
    status: paging?.status,
    q: paging?.q,
  })

  return (
    <Table className="border-t">
      {/* <TableCaption></TableCaption> */}
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
            {t('Table.visibility')}
          </TableHead>
          <TableHead className="w-[100px] text-center">
            {t('Table.views')}
          </TableHead>
          <TableHead className="w-[200px] text-center">
            {t('Table.created_at')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts === null ? (
          <LoadingItem />
        ) : Array.isArray(posts) && posts?.length > 0 ? (
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
  const paging = usePaging()

  return (
    <TableRow>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell align="center">{post?.num}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <div className="line-clamp-1">
            <span>
              {!paging?.status && post?.status !== 'publish'
                ? `[${t(`PostStatus.${post?.status}`)}] `
                : null}
            </span>
            <span className="break-all">{post?.title}</span>
          </div>
          {dayjs().isBefore(dayjs(post?.created_at).add(1, 'day')) ? (
            <Badge variant="destructive" className="px-1.5 text-2xs">
              New
            </Badge>
          ) : null}
        </div>
        <QuickLinks post={post} />
      </TableCell>
      <TableCell align="center">{post?.author?.full_name}</TableCell>
      <TableCell align="center">
        {getMeta(post?.meta, 'visibility', null) === 'private' ? (
          <LucideIcon name="LockKeyhole" className="size-4 min-w-4" />
        ) : (
          <LucideIcon
            name="LockKeyholeOpen"
            className="size-4 min-w-4 text-muted-foreground"
          />
        )}
      </TableCell>
      <TableCell align="center">
        {getMeta(post?.meta, 'view_count', '0')?.toLocaleString()}
      </TableCell>
      <TableCell align="center">
        {dayjs(post?.created_at).format('YYYY-MM-DD HH:mm:ss')}
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
