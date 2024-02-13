'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/utils/tailwind'

export interface ErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  statusCode: number
  message?: string
  description?: string
  className?: string
}

export function Error({
  statusCode,
  message,
  description,
  className,
  ...props
}: ErrorProps) {
  const { t } = useTranslation('error')

  return (
    <div className={cn('flex h-screen w-screen', className)} {...props}>
      <div className="container flex max-w-[768px] items-center justify-center">
        <h1 className="text-2xl font-medium">{statusCode}</h1>
        <div className="ml-6 border-l border-solid border-[rgba(0,0,0,.3)] py-1 pl-6 dark:border-[rgba(255,255,255,.3)]">
          <h2 className="font-medium">
            {message ?? t(`${statusCode}.message`)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {description ?? t(`${statusCode}.description`)}
          </p>
        </div>
      </div>
    </div>
  )
}
