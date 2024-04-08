import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { UserList } from './user-list'

export default function UsersPage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <Title text="ListUsers.title" translate="yes" />
        <Separator />
        <Description text="ListUsers.description" translate="yes" />
        <UserList />
      </div>
    </main>
  )
}
