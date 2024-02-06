import * as React from 'react'

import { Separator } from '@/components/ui/separator'

export default function DashboardPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground"></p>
      </div>
      <Separator className="my-6" />
      <div>...</div>
    </main>
  )
}
