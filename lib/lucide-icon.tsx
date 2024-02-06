import * as React from 'react'
import { icons, LucideProps } from 'lucide-react'

export interface LucideIconProps extends LucideProps {
  name: keyof typeof icons
}

export function LucideIcon({ name, ...props }: LucideIconProps) {
  const Icon = icons[name]

  return <Icon {...props} />
}
