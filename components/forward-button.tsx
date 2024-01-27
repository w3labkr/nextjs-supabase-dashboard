'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button, ButtonProps } from '@/components/ui/button'

export interface ForwardButtonProps extends ButtonProps {
  href: string
}

export function ForwardButton({
  children,
  href,
  ...props
}: ForwardButtonProps) {
  const router = useRouter()

  return (
    <Button onClick={() => router.push(href)} {...props}>
      {children}
    </Button>
  )
}
