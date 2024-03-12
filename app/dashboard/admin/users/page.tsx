import * as React from 'react'

import { ListUsers } from './list-users'
import { authenticate } from '@/lib/supabase/auth'

export default async function UsersPage() {
  const { authenticated, user } = await authenticate()

  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <ListUsers />
      </div>
    </main>
  )
}
