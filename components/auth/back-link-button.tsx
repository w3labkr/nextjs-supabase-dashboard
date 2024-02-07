'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation, Trans } from 'react-i18next'

import { Button, ButtonProps } from '@/components/ui/button'
import { LucideIcon } from '@/lib/lucide-icon'

export interface BackLinkButtonProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function BackLinkButton({
  variant = 'ghost',
  ...props
}: BackLinkButtonProps) {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <Button variant={variant} onClick={() => router.push('/')} {...props}>
      <LucideIcon name="ChevronLeft" className="mr-2 size-4" />
      <Trans t={t}>Back</Trans>
    </Button>
  )
}
