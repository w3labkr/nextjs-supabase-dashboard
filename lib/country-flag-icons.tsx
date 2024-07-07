import * as React from 'react'
import Flags from 'country-flag-icons/react/3x2'

interface FlagProps {
  code: string
  className?: string
}

const Flag = ({ code, className }: FlagProps) => {
  const FlagComponent = Flags[code.toUpperCase() as keyof typeof Flags]
  return <FlagComponent className={className} />
}

export { Flag, type FlagProps }
