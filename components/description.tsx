'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/utils/tailwind'

export interface DescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  text?: string
  translate?: boolean
}

export function Description({
  children,
  className,
  text,
  translate = false,
  ...props
}: DescriptionProps) {
  const { t } = useTranslation()

  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props}>
      {translate ? t(text) : text}
      {children}
    </p>
  )
}
