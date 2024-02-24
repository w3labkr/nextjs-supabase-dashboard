'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'

import { Trans } from 'react-i18next'
import type { SetOptional } from 'type-fest'
import { cn } from '@/lib/utils'

type TransLinkProps = SetOptional<LinkProps, 'href'> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

const Link1 = ({ children, ...props }: TransLinkProps) => (
  <Link
    href="/policy/terms"
    className="text-primary underline underline-offset-4"
    {...props}
  >
    {children}
  </Link>
)

const Link2 = ({ children, ...props }: TransLinkProps) => (
  <Link
    href="/policy/privacy"
    className="text-primary underline underline-offset-4"
    {...props}
  >
    {children}
  </Link>
)

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
