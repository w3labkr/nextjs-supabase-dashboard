'use client'

import * as React from 'react'

import { LucideIcon } from '@/lib/lucide-icon'

interface ViewCountProps extends React.HTMLAttributes<HTMLDivElement> {
  count: string
}

const ViewCount = (props: ViewCountProps) => {
  const { count, ...rest } = props

  return (
    <div className="flex items-center" {...rest}>
      <LucideIcon name="Eye" className="mr-2 size-5 min-w-5" />
      {count}
    </div>
  )
}

export { ViewCount, type ViewCountProps }
