import * as React from 'react'

import { ListUsers } from './list-users'

export default function UsersPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <ListUsers />
      </div>
    </main>
  )
}
