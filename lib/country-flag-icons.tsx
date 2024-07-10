import * as React from 'react'
import Flags from 'country-flag-icons/react/3x2'

export interface FlagProps {
  code: string
  className?: string
}

export function Flag({ code, className }: FlagProps) {
  const FlagComponent = Flags[code.toUpperCase() as keyof typeof Flags]
  return <FlagComponent className={className} />
}
