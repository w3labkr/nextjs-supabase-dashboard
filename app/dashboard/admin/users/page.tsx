import * as React from 'react'

import { UserList } from './user-list'
import { authenticate } from '@/lib/supabase/auth'

export default async function UsersPage() {
  const { isAuthenticated, user } = await authenticate()

  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <UserList />
      </div>
    </main>
  )
}
