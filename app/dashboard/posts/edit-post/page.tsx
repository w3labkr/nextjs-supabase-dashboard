import * as React from 'react'

import { EditPostForm } from './edit-post-form'
import { authenticate } from '@/lib/supabase/auth'

export default async function EditPostPage() {
  const { authenticated, user } = await authenticate()

  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <EditPostForm />
      </div>
    </main>
  )
}
