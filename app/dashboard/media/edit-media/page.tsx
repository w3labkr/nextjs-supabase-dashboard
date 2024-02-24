import * as React from 'react'

import { EditMediaForm } from './edit-media-form'

export default function EditMediaPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <EditMediaForm />
      </div>
    </main>
  )
}
