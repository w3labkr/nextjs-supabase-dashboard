'use client'

import * as React from 'react'
import Link from 'next/link'

import { Trans } from 'react-i18next'
import { cn } from '@/lib/utils'

export interface SignUpPolicyLinkProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export function SignUpPolicyLink({
  className,
  ...props
}: SignUpPolicyLinkProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props}>
      <Trans components={{ link1: <Link1 />, link2: <Link2 /> }}>
        SignUpPolicyLink.paragraph
      </Trans>
    </p>
  )
}

function Link1({ children }: { children?: React.ReactNode }) {
  return (
    <Link href="/policy/terms" className="text-primary underline">
      {children}
    </Link>
  )
}

function Link2({ children }: { children?: React.ReactNode }) {
  return (
    <Link href="/policy/privacy" className="text-primary underline">
      {children}
    </Link>
  )
}
