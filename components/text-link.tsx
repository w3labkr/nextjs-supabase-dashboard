'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { useTranslation } from 'react-i18next'
import { siteConfig } from '@/config/site'
import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
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
      scroll,
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
      <Link ref={ref} scroll={scroll ?? !siteConfig?.fixedHeader} {...rest}>
        {startIconName ? (
          <LucideIcon
            name={startIconName}
            className={cn('mr-2 size-4 min-w-4', startIconClassName)}
          />
        ) : null}
        {text && translate === 'yes' ? t(text, { ns }) : text}
        {children && typeof children === 'string' && translate === 'yes'
          ? t(children, { ns })
          : children}
        {endIconName ? (
          <LucideIcon
            name={endIconName}
            className={cn('ml-2 size-4 min-w-4', endIconClassName)}
          />
        ) : null}
      </Link>
    )
  }
)

TextLink.displayName = 'TextLink'

export { TextLink, type TextLinkProps }
