'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

interface DescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text?: string
}

const Description = (props: DescriptionProps) => {
  const { children, className, text, translate, ...rest } = props
  const { t } = useTranslation()

  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...rest}>
      {text && translate === 'yes' ? t(text) : text}
      {children}
    </p>
  )
}

export { Description, type DescriptionProps }
