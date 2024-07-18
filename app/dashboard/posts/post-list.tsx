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
import { Checkbox } from '@/components/ui/checkbox'
import { PagingProvider, usePaging, Paging } from '@/components/paging'

import { SearchForm } from './components/search-form'
import { HeadLink } from './components/head-link'
import {
  QuickEdit,
  QuickView,
  QuickTrash,
  QuickRestore,
  QuickDelete,
  QuickPublish,
  QuickPublic,
  QuickPrivate,
  QuickDraft,
} from './components/quick-links'
import {
  BulkActions,
  BulkActionsProvider,
  useBulkActions,
} from './components/bulk-actions'

import { cn, getMetaValue } from '@/lib/utils'
import { Post } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { usePostsAPI, useCountPostsAPI } from '@/queries/client/posts'
import { CheckedState } from '@radix-ui/react-checkbox'

const PostList = () => {
  const searchParams = useSearchParams()
  const postType = (searchParams.get('postType') as string) ?? 'post'
  const status = searchParams.get('status') as string
  const q = searchParams.get('q') as string
  const orderBy = (searchParams.get('orderBy') as string) ?? 'id'
  const order = (searchParams.get('order') as string) ?? 'desc'
  const perPage = +((searchParams.get('perPage') as string) ?? '10')
  const page = +((searchParams.get('page') as string) ?? '1')
  const pageSize = +((searchParams.get('pageSize') as string) ?? '10')

  const { user } = useAuth()
  const { count } = usePostsAPI(user?.id ?? null, {
    postType,
    status,
    q,
    orderBy,
    order,
    perPage,
    page,
  })

  const total = count ?? 0

  return (
    <PagingProvider
      value={{
        postType,
        status,
        q,
        orderBy,
        order,
        perPage,
        page,
        pageSize,
        total,
      }}
    >
      <BulkActionsProvider>
        <Header />
        <Body />
        <Footer />
      </BulkActionsProvider>
    </PagingProvider>
  )
}

const Header = () => {
  return (
    <div className="space-y-6">
      <HeadLinks />
      <div className="flex flex-wrap justify-between gap-2">
        <BulkActions className="w-full sm:w-auto" />
        <SearchForm className="w-full sm:w-auto" />
      </div>
    </div>
  )
}

interface HeadLinksProps extends React.HTMLAttributes<HTMLDivElement> {}

const HeadLinks = ({ className, ...props }: HeadLinksProps) => {
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
    <div
      className={cn(
        'flex flex-wrap items-center space-x-1 text-sm text-muted-foreground',
        className
      )}
      {...props}
    >
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

const Body = () => {
  const { t } = useTranslation()

  const paging = usePaging()
  const { user } = useAuth()
  const { posts } = usePostsAPI(user?.id ?? null, {
    postType: paging?.postType,
    status: paging?.status,
    q: paging?.q,
    orderBy: paging?.orderBy,
    order: paging?.order,
    perPage: paging?.perPage,
    page: paging?.page,
  })

  const { checks, setChecks } = useBulkActions()

  React.useEffect(() => {
    setChecks([])
  }, [paging, setChecks])

  return (
    <Table className="border-t">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={checks?.length > 0 && checks?.length === posts?.length}
              onCheckedChange={(checked: CheckedState) => {
                setChecks(checked && posts ? posts : [])
              }}
            />
          </TableHead>
          <TableHead className="min-w-[70px] text-center">{t('num')}</TableHead>
          <TableHead className="min-w-[250px]">{t('title')}</TableHead>
          <TableHead className="min-w-[100px] text-center">
            {t('author')}
          </TableHead>
          <TableHead className="min-w-[70px] text-center">
            {t('visibility')}
          </TableHead>
          <TableHead className="min-w-[70px] text-center">
            {t('views')}
          </TableHead>
          <TableHead className="min-w-[200px] text-center">
            {t('created_at')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts === null ? (
          <LoadingItem />
        ) : Array.isArray(posts) && posts?.length > 0 ? (
          posts?.map((post: Post) => <ListItem key={post?.id} post={post} />)
        ) : (
          <EmptyItem />
        )}
      </TableBody>
    </Table>
  )
}

const ListItem = ({ post }: { post: Post }) => {
  const { t } = useTranslation()
  const { checks, setChecks } = useBulkActions()

  const visibility = getMetaValue(post?.meta, 'visibility')
  const views = getMetaValue(post?.meta, 'views', '0')

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={checks?.some((x: Post) => x.id === post?.id)}
          onCheckedChange={(checked: CheckedState) => {
            const value = checked
              ? [...checks, post]
              : checks?.filter((x: Post) => x.id !== post?.id)
            setChecks(value)
          }}
        />
      </TableCell>
      <TableCell align="center">{post?.num}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          {dayjs().isBefore(dayjs(post?.created_at).add(1, 'day')) ? (
            <span className="font-bold text-destructive text-2xs dark:text-white">
              NEW
            </span>
          ) : null}
          <div className="line-clamp-1">
            <span>
              {!['publish'].includes(post?.status)
                ? `[${t(`${post?.status}`)}] `
                : null}
            </span>
            <span className="break-all">{post?.title}</span>
          </div>
        </div>
        <QuickLinks post={post} />
      </TableCell>
      <TableCell align="center">{post?.author?.full_name}</TableCell>
      <TableCell align="center">
        {visibility === 'private' ? (
          <LucideIcon name="LockKeyhole" className="size-4 min-w-4" />
        ) : (
          <LucideIcon
            name="LockKeyholeOpen"
            className="size-4 min-w-4 text-muted-foreground"
          />
        )}
      </TableCell>
      <TableCell align="center">{+views?.toLocaleString()}</TableCell>
      <TableCell align="center">
        {dayjs(post?.created_at).format('YYYY-MM-DD HH:mm:ss')}
      </TableCell>
    </TableRow>
  )
}

interface QuickLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

const QuickLinks = ({ post, ...props }: QuickLinksProps) => {
  switch (post?.status) {
    case 'publish':
      return (
        <div className="space-x-1" {...props}>
          <QuickEdit post={post} />
          <span>|</span>
          <QuickDraft post={post} />
          <span>|</span>
          <QuickPrivate post={post} />
          <span>|</span>
          <QuickTrash post={post} />
          <span>|</span>
          <QuickView post={post} />
        </div>
      )
    case 'private':
      return (
        <div className="space-x-1" {...props}>
          <QuickEdit post={post} />
          <span>|</span>
          <QuickDraft post={post} />
          <span>|</span>
          <QuickPublic post={post} />
          <span>|</span>
          <QuickTrash post={post} />
          <span>|</span>
          <QuickView post={post} />
        </div>
      )
    case 'future':
      return (
        <div className="space-x-1" {...props}>
          <QuickEdit post={post} />
          <span>|</span>
          <QuickDraft post={post} />
          <span>|</span>
          <QuickPublish post={post} />
          <span>|</span>
          <QuickTrash post={post} />
        </div>
      )
    case 'draft':
      return (
        <div className="space-x-1" {...props}>
          <QuickEdit post={post} />
          <span>|</span>
          <QuickPublish post={post} />
          <span>|</span>
          <QuickTrash post={post} />
        </div>
      )
    case 'trash':
      return (
        <div className="space-x-1" {...props}>
          <QuickRestore post={post} />
          <span>|</span>
          <QuickDelete post={post} />
        </div>
      )
    case 'pending':
      return (
        <div className="space-x-1" {...props}>
          <QuickTrash post={post} />
        </div>
      )
  }
}

const EmptyItem = () => {
  const { t } = useTranslation()

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell colSpan={6} align="center">
        {t('no_posts_yet')}
      </TableCell>
    </TableRow>
  )
}

const LoadingItem = () => {
  const { t } = useTranslation()

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell colSpan={5} align="center">
        {t('is_loading')}
      </TableCell>
    </TableRow>
  )
}

const Footer = () => {
  const paging = usePaging()
  const { user } = useAuth()
  const { posts } = usePostsAPI(user?.id ?? null, {
    postType: paging?.postType,
    status: paging?.status,
    q: paging?.q,
    orderBy: paging?.orderBy,
    order: paging?.order,
    perPage: paging?.perPage,
    page: paging?.page,
  })

  if (!posts) return null

  return <Paging />
}

export { PostList }
