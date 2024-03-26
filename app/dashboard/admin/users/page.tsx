import * as React from 'react'

import { UserList } from './user-list'

export default function UsersPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <UserList />
      </div>
    </main>
  )
}
