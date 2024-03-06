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

import { AdminListUsers } from '@/types/api'
import { useUsers } from '@/hooks/api/use-users'

export function ListUsers() {
  const [page, setPage] = React.useState<number>(1)
  const [perPage, setPerPage] = React.useState<number>(50)
  const { data, error, isLoading } = useUsers(page, perPage)

  // if (error) return <div>failed to load</div>
  // if (isLoading) return <div>loading...</div>

  return (
    <>
      <List users={data?.users ?? []} />
      <Paginate
        page={page}
        perPage={perPage}
        setPage={setPage}
        total={data?.total ?? 0}
      />
    </>
  )
}

function List({ users }: { users: AdminListUsers['data']['users'] }) {
  return (
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
          {users.map((user) => (
            <TableRow key={user?.id}>
              <TableCell>
                {dayjs(user?.created_at).format('YYYY-MM-DD HH:mm')}
              </TableCell>
              <TableCell>
                {dayjs(user?.updated_at).format('YYYY-MM-DD HH:mm')}
              </TableCell>
              <TableCell>{user?.role}</TableCell>
              <TableCell>{user?.email}</TableCell>
              <TableCell>
                {dayjs(user?.email_confirmed_at).format('YYYY-MM-DD HH:mm')}
              </TableCell>
              <TableCell>{user?.phone}</TableCell>
              <TableCell>
                {dayjs(user?.last_sign_in_at).format('YYYY-MM-DD HH:mm')}
              </TableCell>
              <TableCell>{user?.app_metadata?.provider}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
