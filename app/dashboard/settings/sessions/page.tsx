import * as React from 'react'

import { SessionsForm } from './sessions-form'

export default function SessionsPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <SessionsForm />
      </div>
    </main>
  )
}
