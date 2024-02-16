import * as React from 'react'
import { icons, LucideProps } from 'lucide-react'

export type LucideIconNameProp = keyof typeof icons

export interface LucideIconProps extends LucideProps {
  name: LucideIconNameProp
}

export function LucideIcon({ name, ...props }: LucideIconProps) {
  const Icon = icons[name]

  return <Icon {...props} />
}
