import * as React from 'react'

import { DashboardForm } from './dashboard-form'

export default async function DashboardPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <DashboardForm />
      </div>
    </main>
  )
}
