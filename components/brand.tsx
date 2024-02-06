import * as React from 'react'
import Link from 'next/link'

import { LucideIcon } from '@/lib/lucide-icon'

export function Brand() {
  return (
    <Link className="mr-6 hidden lg:flex" href="/">
      <LucideIcon name="Mountain" className="size-6" />
      <span className="sr-only">Acme Inc</span>
    </Link>
  )
}
