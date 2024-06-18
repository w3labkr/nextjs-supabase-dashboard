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

import { cn, getMeta } from '@/lib/utils'
import { Post } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { usePostsAPI, useCountPostsAPI } from '@/queries/client/posts'
import { CheckedState } from '@radix-ui/react-checkbox'

const PostList = () => {
  const searchParams = useSearchParams()
  const page = +((searchParams.get('page') as string) ?? '1')
  const perPage = +((searchParams.get('perPage') as string) ?? '10')
  const pageSize = +((searchParams.get('pageSize') as string) ?? '10')
  const postType = (searchParams.get('postType') as string) ?? 'post'
  const status = searchParams.get('status') as string
  const q = searchParams.get('q') as string
  const orderBy = (searchParams.get('orderBy') as string) ?? 'id'
  const order = (searchParams.get('order') as string) ?? 'desc'

  const { user } = useAuth()
  const { count } = usePostsAPI(user?.id ?? null, {
    page,
    perPage,
    postType,
    status,
    q,
    orderBy,
    order,
  })

  const total = count ?? 0

  return (
    <PagingProvider
      value={{
        total,
        page,
        perPage,
        pageSize,
        postType,
        status,
        q,
        orderBy,
        order,
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
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <BulkActions />
        <SearchForm />
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
        'flex items-center space-x-1 text-sm text-muted-foreground',
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
    page: paging?.page,
    perPage: paging?.perPage,
    postType: paging?.postType,
    status: paging?.status,
    q: paging?.q,
    orderBy: paging?.orderBy,
    order: paging?.order,
  })

  const { checks, setChecks } = useBulkActions()
  const onCheckedChange = (checked: CheckedState) => {
    if (checked && posts) {
      setChecks(posts)
    } else {
      setChecks([])
    }
  }

  React.useEffect(() => {
    setChecks([])
  }, [paging, setChecks])

  return (
    <Table className="border-t">
      {/* <TableCaption></TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={checks?.length > 0 && checks?.length === posts?.length}
              onCheckedChange={onCheckedChange}
            />
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

  const { checks, setChecks } = useBulkActions()
  const onCheckedChange = (checked: CheckedState) => {
    if (checked) {
      setChecks([...checks, post])
    } else {
      setChecks(checks?.filter((r) => r.id !== post?.id))
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={checks?.some((r) => r.id === post?.id)}
          onCheckedChange={onCheckedChange}
        />
      </TableCell>
      <TableCell align="center">{post?.num}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <div className="line-clamp-1">
            <span>
              {!['publish'].includes(post?.status)
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
        {getMeta(post?.meta, 'visibility') === 'private' ? (
          <LucideIcon name="LockKeyhole" className="size-4 min-w-4" />
        ) : (
          <LucideIcon
            name="LockKeyholeOpen"
            className="size-4 min-w-4 text-muted-foreground"
          />
        )}
      </TableCell>
      <TableCell align="center">
        {getMeta(post?.meta, 'views', '0')?.toLocaleString()}
      </TableCell>
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

const Footer = () => {
  const paging = usePaging()
  const { user } = useAuth()
  const { posts } = usePostsAPI(user?.id ?? null, {
    page: paging?.page,
    perPage: paging?.perPage,
    postType: paging?.postType,
    status: paging?.status,
    q: paging?.q,
    orderBy: paging?.orderBy,
    order: paging?.order,
  })

  if (!posts) return null

  return <Paging />
}

export { PostList }
