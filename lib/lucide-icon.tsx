import * as React from 'react'
import { icons, LucideProps } from 'lucide-react'

export type LucideIconName = keyof typeof icons

export type LucideIconProps = LucideProps & {
  name: LucideIconName
}

export function LucideIcon({ name, ...props }: LucideIconProps) {
  const Icon = icons[name]

  return <Icon {...props} />
}
