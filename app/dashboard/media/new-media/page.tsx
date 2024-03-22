import * as React from 'react'

import { NewMediaForm } from './new-media-form'
import { authenticate } from '@/lib/supabase/auth'

export default async function NewMediaPage() {
  const { isAuthenticated, user } = await authenticate()

  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <NewMediaForm />
      </div>
    </main>
  )
}
