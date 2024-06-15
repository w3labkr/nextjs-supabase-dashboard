'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTrans } from '@/hooks/use-trans'
import { siteConfig } from '@/config/site'

const Policy = () => {
  const { trans } = useTrans()

  return (
    <p className="text-sm text-muted-foreground">
      {trans('SignUpPage.policy', {
        components: {
          link1: (
            <Link
              href="/policy/terms"
              scroll={!siteConfig?.fixedHeader}
              className="text-primary underline"
            />
          ),
          link2: (
            <Link
              href="/policy/privacy"
              scroll={!siteConfig?.fixedHeader}
              className="text-primary underline"
            />
          ),
        },
      })}
    </p>
  )
}

export { Policy }
