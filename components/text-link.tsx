'use client'

import * as React from 'react'
import Link, { type LinkProps } from 'next/link'
import { useTranslation } from 'react-i18next'

import { LucideIcon, type LucideIconName } from '@/lib/lucide-icon'
import { cn } from '@/lib/utils'

interface TextLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  startIconName?: LucideIconName
  startIconClassName?: string
  endIconName?: LucideIconName
  endIconClassName?: string
  text?: string
  ns?: string
}

const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
  (props, ref) => {
    const {
      children,
      startIconName,
      startIconClassName,
      endIconName,
      endIconClassName,
      text,
      translate,
      ns,
      ...rest
    } = props
    const { t } = useTranslation()

    return (
      <Link ref={ref} {...rest}>
        {startIconName ? (
          <LucideIcon
            name={startIconName}
            size={16}
            className={cn('mr-2', startIconClassName)}
          />
        ) : null}
        {text && translate === 'yes' ? t(text, { ns }) : text}
        {children && typeof children === 'string' && translate === 'yes'
          ? t(children, { ns })
          : children}
        {endIconName ? (
          <LucideIcon
            name={endIconName}
            size={16}
            className={cn('ml-2', endIconClassName)}
          />
        ) : null}
      </Link>
    )
  }
)

TextLink.displayName = 'TextLink'

export { TextLink, type TextLinkProps }
