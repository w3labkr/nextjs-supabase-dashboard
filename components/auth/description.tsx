'use client'

import * as React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { cn } from '@/utils/tailwind'

export interface DescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function Description({
  children,
  className,
  ...props
}: DescriptionProps) {
  const { t } = useTranslation()

  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props}>
      <Trans t={t}>{children}</Trans>
    </p>
  )
}
