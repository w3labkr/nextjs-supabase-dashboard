'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text?: string
}

const Title = (props: TitleProps) => {
  const { children, className, text, translate, ...rest } = props
  const { t } = useTranslation()

  return (
    <h2
      className={cn('text-2xl font-semibold tracking-tight', className)}
      {...rest}
    >
      {text && translate === 'yes' ? t(text) : text}
      {children}
    </h2>
  )
}

export { Title, type TitleProps }
