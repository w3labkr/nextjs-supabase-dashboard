'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { Button, ButtonProps } from '@/components/ui/button'

export interface HistoryBackButtonProps extends ButtonProps {}

export function HistoryBackButton({
  children,
  ...props
}: HistoryBackButtonProps) {
  const router = useRouter()

  return (
    <Button onClick={() => router.back()} {...props}>
      {children}
    </Button>
  )
}
