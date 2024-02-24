import * as React from 'react'

import { NewMediaForm } from './new-media-form'

export default function NewMediaPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <NewMediaForm />
      </div>
    </main>
  )
}
