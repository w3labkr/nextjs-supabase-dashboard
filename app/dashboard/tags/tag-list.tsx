'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

import { CheckedState } from '@radix-ui/react-checkbox'
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
import { QuickEdit, QuickView, QuickDelete } from './components/quick-links'
import {
  BulkActions,
  BulkActionsProvider,
  useBulkActions,
} from './components/bulk-actions'

import { type Tag } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { useTagsAPI } from '@/queries/client/tags'
import { useUserAPI } from '@/queries/client/users'

const TagList = () => {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') as string
  const orderBy = (searchParams.get('orderBy') as string) ?? 'id'
  const order = (searchParams.get('order') as string) ?? 'desc'
  const perPage = +((searchParams.get('perPage') as string) ?? '10')
  const page = +((searchParams.get('page') as string) ?? '1')
  const pageSize = +((searchParams.get('pageSize') as string) ?? '10')

  const { user } = useAuth()
  const { count } = useTagsAPI(user?.id ?? null, {
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
      <div></div>
      <div className="flex flex-wrap justify-between gap-2">
        <BulkActions className="w-full sm:w-auto" />
        <SearchForm className="w-full sm:w-auto" />
      </div>
    </div>
  )
}

const Body = () => {
  const { t } = useTranslation()
  const paging = usePaging()

  const { user } = useAuth()
  const { tags } = useTagsAPI(user?.id ?? null, {
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
              checked={checks?.length > 0 && checks?.length === tags?.length}
              onCheckedChange={(checked: CheckedState) => {
                setChecks(checked && tags ? tags : [])
              }}
            />
          </TableHead>
          <TableHead className="min-w-[70px] text-center">{t('num')}</TableHead>
          <TableHead className="min-w-[100px]">{t('name')}</TableHead>
          <TableHead className="min-w-[100px]">{t('slug')}</TableHead>
          <TableHead className="min-w-[70px] text-center">
            {t('count')}
          </TableHead>
          <TableHead className="min-w-[250px]">{t('description')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags === null ? (
          <LoadingItem />
        ) : Array.isArray(tags) && tags?.length > 0 ? (
          tags?.map((tag: Tag) => <ListItem key={tag?.id} tag={tag} />)
        ) : (
          <EmptyItem />
        )}
      </TableBody>
    </Table>
  )
}

const ListItem = ({ tag }: { tag: Tag }) => {
  const { checks, setChecks } = useBulkActions()
  const { user } = useUserAPI()
  const { id, num, name, slug, description, post_tags = [] } = tag

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={checks?.some((x: Tag) => x.id === id)}
          onCheckedChange={(checked: CheckedState) => {
            const value = checked
              ? [...checks, tag]
              : checks?.filter((x: Tag) => x.id !== id)
            setChecks(value)
          }}
        />
      </TableCell>
      <TableCell align="center">{num}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <div className="line-clamp-1">
            <span className="break-all">{name}</span>
          </div>
        </div>
        <QuickLinks tag={tag} />
      </TableCell>
      <TableCell>{slug}</TableCell>
      <TableCell align="center">
        <Link
          href={user?.username && slug ? `/${user?.username}?tag=${slug}` : '#'}
          className="text-blue-700 underline underline-offset-4 hover:no-underline"
        >
          {post_tags?.length?.toLocaleString()}
        </Link>
      </TableCell>
      <TableCell>{description}</TableCell>
    </TableRow>
  )
}

interface QuickLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  tag: Tag
}

const QuickLinks = ({ tag, ...props }: QuickLinksProps) => {
  return (
    <div className="space-x-1" {...props}>
      <QuickEdit tag={tag} />
      <span>|</span>
      <QuickDelete tag={tag} />
      <span>|</span>
      <QuickView tag={tag} />
    </div>
  )
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
  const { tags } = useTagsAPI(user?.id ?? null, {
    q: paging?.q,
    orderBy: paging?.orderBy,
    order: paging?.order,
    perPage: paging?.perPage,
    page: paging?.page,
  })

  if (!tags) return null

  return <Paging />
}

export { TagList }
