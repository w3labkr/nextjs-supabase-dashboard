'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text?: string
}

export function Title({ text, children, className, ...props }: TitleProps) {
  const { t } = useTranslation()

  return (
    <h1
      className={cn('text-2xl font-semibold tracking-tight', className)}
      {...props}
    >
      {text ? t(text) : children}
    </h1>
  )
}
