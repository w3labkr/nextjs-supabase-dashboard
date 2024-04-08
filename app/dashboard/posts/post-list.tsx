'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { cn, fetcher } from '@/lib/utils'
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
import { Paginate } from '@/components/paginate'

import { PostListProvider } from './post-list-provider'
import { AddNewPost } from './add-new-post'
import { EditPost } from './edit-post'
import { TrashPost } from './trash-post'
import { ViewPost } from './view-post'

import { Post } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { usePosts } from '@/hooks/sync/use-posts'

export function PostList() {
  const { user } = useAuth()

  const [page, setPage] = React.useState<number>(1)
  const [perPage, setPerPage] = React.useState<number>(50)
  const { posts, total } = usePosts(user?.id ?? null, page, perPage)

  if (!posts) return null
  if (!posts?.length) return <EmptyPostItem />

  return (
    <PostListProvider value={{ page, perPage }}>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.map((post) => <PostItem key={post?.id} post={post} />)}
        </TableBody>
      </Table>
      <Paginate
        page={page}
        perPage={perPage}
        setPage={setPage}
        total={total ?? 0}
      />
    </PostListProvider>
  )
}

function PostItem({ post }: { post: Post }) {
  return (
    <TableRow>
      <TableCell className="w-[50px]">
        <Checkbox />
      </TableCell>
      <TableCell>
        <div>{post?.title}</div>
        <div>
          <EditPost post={post} /> | <TrashPost post={post} /> |{' '}
          <ViewPost post={post} />
        </div>
      </TableCell>
      <TableCell className="w-[100px]">{post?.user?.username}</TableCell>
      <TableCell className="w-[200px]">
        {dayjs(post?.updated_at).format('YYYY-MM-DD HH:mm')}
      </TableCell>
    </TableRow>
  )
}

function EmptyPostItem() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <LucideIcon name="StickyNote" className="size-10 min-w-10" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">
          {t('EmptyPostItem.title')}
        </h2>
        <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
          {t('EmptyPostItem.description')}
        </p>
        <AddNewPost variant="outline" />
      </div>
    </div>
  )
}
