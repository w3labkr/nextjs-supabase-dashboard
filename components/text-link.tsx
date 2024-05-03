'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { useTranslation } from 'react-i18next'

interface TextLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  text?: string
}

const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
  (props, ref) => {
    const { children, text, translate, ...rest } = props
    const { t } = useTranslation()

    return (
      <Link ref={ref} {...rest}>
        {text && translate === 'yes' ? t(text) : text}
        {children}
      </Link>
    )
  }
)

TextLink.displayName = 'TextLink'

export { TextLink, type TextLinkProps }
