'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/utils/tailwind'

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text?: string
  translate?: boolean
}

export function Title({
  children,
  className,
  text,
  translate = false,
  ...props
}: TitleProps) {
  const { t } = useTranslation()

  return (
    <h1
      className={cn('text-2xl font-semibold tracking-tight', className)}
      {...props}
    >
      {translate ? t(text) : text}
      {children}
    </h1>
  )
}
