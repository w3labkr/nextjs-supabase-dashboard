'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text?: string
  ns?: string
}

const Title = ({
  children,
  className,
  translate,
  text,
  ns,
  ...props
}: TitleProps) => {
  const { t } = useTranslation()

  return (
    <h2
      className={cn('text-2xl font-semibold tracking-tight', className)}
      {...props}
    >
      {text && translate === 'yes' ? t(text, { ns }) : text}
      {children && typeof children === 'string' && translate === 'yes'
        ? t(children, { ns })
        : children}
    </h2>
  )
}

export { Title, type TitleProps }
