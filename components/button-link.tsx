'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { ButtonProps, buttonVariants } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

interface ButtonLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  startIconName?: LucideIconName
  startIconClassName?: string
  endIconName?: LucideIconName
  endIconClassName?: string
  text?: string
  ns?: string
  variant?: ButtonProps['variant']
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (props, ref) => {
    const {
      children,
      className,
      startIconName,
      startIconClassName,
      endIconName,
      endIconClassName,
      text,
      translate,
      ns,
      variant = 'ghost',
      scroll,
      ...rest
    } = props
    const { t } = useTranslation()

    return (
      <Link
        ref={ref}
        scroll={scroll ?? !siteConfig?.fixedHeader}
        className={cn(buttonVariants({ variant }), className)}
        {...rest}
      >
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

ButtonLink.displayName = 'ButtonLink'

export { ButtonLink, type ButtonLinkProps }
