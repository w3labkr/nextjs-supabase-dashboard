'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTrans } from '@/hooks/use-trans'

export const Policy = () => {
  const { trans } = useTrans()

  return (
    <p className="text-sm text-muted-foreground">
      {trans('SignUpPage.policy', {
        components: {
          link1: (
            <Link href="/policy/terms" className="text-primary underline" />
          ),
          link2: (
            <Link href="/policy/privacy" className="text-primary underline" />
          ),
        },
      })}
    </p>
  )
}
