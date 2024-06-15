'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface ErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string
  statusText?: string
  message?: string
  className?: string
}

const Error = ({
  status,
  statusText,
  message,
  className,
  ...props
}: ErrorProps) => {
  const { t } = useTranslation('httpstatuscode')

  return (
    <div className={cn('flex h-screen w-screen', className)} {...props}>
      <div className="container flex max-w-[768px] items-center justify-center">
        <h1 className="text-2xl font-medium">{status}</h1>
        <div className="ml-6 border-l border-solid border-[rgba(0,0,0,.3)] py-1 pl-6 dark:border-[rgba(255,255,255,.3)]">
          <h2 className="font-medium">
            {statusText ?? t(`${status}.statusText`)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {message ?? t(`${status}.message`)}
          </p>
        </div>
      </div>
    </div>
  )
}

const Forbidden = (props: Omit<ErrorProps, 'status'>) => {
  return <Error status="403" {...props} />
}

const NotFound = (props: Omit<ErrorProps, 'status'>) => {
  return <Error status="404" {...props} />
}

export { Forbidden, NotFound, Error, type ErrorProps }
