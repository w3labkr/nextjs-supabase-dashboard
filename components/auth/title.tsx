'use client'

import * as React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { cn } from '@/utils/tailwind'

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function Title({ children, className, ...props }: TitleProps) {
  const { t } = useTranslation()

  return (
    <h1
      className={cn('text-2xl font-semibold tracking-tight', className)}
      {...props}
    >
      <Trans t={t}>{children}</Trans>
    </h1>
  )
}
