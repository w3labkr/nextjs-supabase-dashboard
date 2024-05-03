'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { ButtonProps, buttonVariants } from '@/components/ui/button'

interface ButtonLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  startIconName?: LucideIconName
  startIconClassName?: string
  endIconName?: LucideIconName
  endIconClassName?: string
  text?: string
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
      variant = 'ghost',
      ...rest
    } = props
    const { t } = useTranslation()

    return (
      <Link
        ref={ref}
        className={cn(buttonVariants({ variant }), className)}
        {...rest}
      >
        {startIconName && (
          <LucideIcon
            name={startIconName}
            className={cn('mr-2 size-4 min-w-4', startIconClassName)}
          />
        )}
        {text && translate === 'yes' ? t(text) : text}
        {children}
        {endIconName && (
          <LucideIcon
            name={endIconName}
            className={cn('ml-2 size-4 min-w-4', endIconClassName)}
          />
        )}
      </Link>
    )
  }
)

ButtonLink.displayName = 'ButtonLink'

export { ButtonLink, type ButtonLinkProps }
