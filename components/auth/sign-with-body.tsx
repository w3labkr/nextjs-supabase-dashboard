import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SignWithBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SignWithBody({
  children,
  className,
  ...props
}: SignWithBodyProps) {
  return (
    <div className={cn('grid gap-2', className)} {...props}>
      {children}
    </div>
  )
}
