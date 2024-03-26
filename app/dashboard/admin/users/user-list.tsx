'use client'

import * as React from 'react'
import dayjs from 'dayjs'

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
import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Paginate } from '@/components/paginate'

import { User } from '@supabase/supabase-js'
import { useUsers } from '@/hooks/api/use-users'

export function UserList() {
  const [page, setPage] = React.useState<number>(1)
  const [perPage, setPerPage] = React.useState<number>(50)

  const { users, isLoading } = useUsers(page, perPage)

  return (
    <>
      <div className="space-y-4">
        <Title text="ListUsers.title" translate="yes" />
        <Separator />
        <Description text="ListUsers.description" translate="yes" />
        <Table>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>created_at</TableHead>
              <TableHead>updated_at</TableHead>
              <TableHead>role</TableHead>
              <TableHead>email</TableHead>
              <TableHead>email_confirmed_at</TableHead>
              <TableHead>phone</TableHead>
              <TableHead>last_sign_in_at</TableHead>
              <TableHead>provider</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((item) => <ListItem key={item?.id} item={item} />)}
          </TableBody>
        </Table>
      </div>
      <Paginate
        page={page}
        perPage={perPage}
        setPage={setPage}
        total={users?.length ?? 0}
      />
    </>
  )
}

function ListItem({ item }: { item: User }) {
  return (
    <TableRow>
      <TableCell>
        {dayjs(item?.created_at).format('YYYY-MM-DD HH:mm')}
      </TableCell>
      <TableCell>
        {dayjs(item?.updated_at).format('YYYY-MM-DD HH:mm')}
      </TableCell>
      <TableCell>{item?.role}</TableCell>
      <TableCell>{item?.email}</TableCell>
      <TableCell>
        {dayjs(item?.email_confirmed_at).format('YYYY-MM-DD HH:mm')}
      </TableCell>
      <TableCell>{item?.phone}</TableCell>
      <TableCell>
        {dayjs(item?.last_sign_in_at).format('YYYY-MM-DD HH:mm')}
      </TableCell>
      <TableCell>{item?.app_metadata?.provider}</TableCell>
    </TableRow>
  )
}
