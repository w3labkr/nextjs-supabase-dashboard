import * as React from 'react'
import { EmailList } from './email-list'

export default async function EmailsPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <EmailList />
      </div>
    </main>
  )
}
