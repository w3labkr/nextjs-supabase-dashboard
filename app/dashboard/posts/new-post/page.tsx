import * as React from 'react'

import { NewPostForm } from './new-post-form'

export default function NewPostPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <NewPostForm />
      </div>
    </main>
  )
}
