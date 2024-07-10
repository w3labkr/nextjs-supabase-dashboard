import * as React from 'react'
import Link, { type LinkProps } from 'next/link'

import { cn } from '@/lib/utils'
import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { Translation } from '@/hooks/i18next'

interface TabLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  t: Translation['t']
  text?: string
  iconName?: LucideIconName
  iconClassName?: string
  active?: boolean
}

const TabLink = React.forwardRef<HTMLAnchorElement, TabLinkProps>(
  (props, ref) => {
    const {
      t,
      active,
      children,
      className,
      translate,
      text,
      iconName,
      iconClassName,
      ...rest
    } = props

    return (
      <Link
        ref={ref}
        className={cn(
          'flex items-center',
          active ? '' : 'text-muted-foreground',
          className
        )}
        {...rest}
      >
        {iconName ? (
          <LucideIcon
            name={iconName}
            className={cn('mr-1 size-4 min-w-4', iconClassName)}
          />
        ) : null}
        {text && translate === 'yes' ? t(text) : text}
        {children && typeof children === 'string' && translate === 'yes'
          ? t(children)
          : children}
      </Link>
    )
  }
)

TabLink.displayName = 'TabLink'

export { TabLink, type TabLinkProps }
