'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation, Trans } from 'react-i18next'

import { Button, ButtonProps } from '@/components/ui/button'
import { LucideIcon } from '@/lib/lucide-icon'

export interface BackLinkButtonProps
  extends ButtonProps,
    React.RefAttributes<HTMLButtonElement> {
  href?: string
  title?: string
}

export function BackLinkButton({
  variant = 'ghost',
  href = '/',
  title = 'Back',
  ...props
}: BackLinkButtonProps) {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <Button variant={variant} onClick={() => router.push(href)} {...props}>
      <LucideIcon name="ChevronLeft" className="mr-2 size-4" />
      <Trans t={t}>{title}</Trans>
    </Button>
  )
}
