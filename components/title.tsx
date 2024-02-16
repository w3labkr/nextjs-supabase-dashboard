'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/utils/tailwind'

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text?: string | undefined
}

export function Title({
  children,
  className,
  text,
  translate,
  ...props
}: TitleProps) {
  const { t } = useTranslation()

  return (
    <h1
      className={cn('text-2xl font-semibold tracking-tight', className)}
      {...props}
    >
      {text && translate === 'yes' ? t(text) : text}
      {children}
    </h1>
  )
}
