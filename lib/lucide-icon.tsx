import * as React from 'react'
import { icons, LucideProps } from 'lucide-react'

type LucideIconName = keyof typeof icons

interface LucideIconProps extends LucideProps {
  name: LucideIconName
}

function LucideIcon({ name, ...props }: LucideIconProps) {
  const Icon = icons[name]

  return <Icon {...props} />
}

export { LucideIcon, type LucideIconProps, type LucideIconName }
