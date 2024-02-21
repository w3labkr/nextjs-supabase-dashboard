'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/utils/tailwind'
import { HttpStatusCodeProp } from '@/utils/server'

export interface ErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  statusCode: HttpStatusCodeProp
  statusText?: string | undefined
  message?: string | undefined
  className?: string | undefined
}

export function Error({
  statusCode,
  statusText,
  message,
  className,
  ...props
}: ErrorProps) {
  const { t } = useTranslation('httpstatuscode')

  return (
    <div className={cn('flex h-screen w-screen', className)} {...props}>
      <div className="container flex max-w-[768px] items-center justify-center">
        <h1 className="text-2xl font-medium">{statusCode}</h1>
        <div className="ml-6 border-l border-solid border-[rgba(0,0,0,.3)] py-1 pl-6 dark:border-[rgba(255,255,255,.3)]">
          <h2 className="font-medium">
            {statusText ?? t(`${statusCode}.statusText`)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {message ?? t(`${statusCode}.message`)}
          </p>
        </div>
      </div>
    </div>
  )
}
