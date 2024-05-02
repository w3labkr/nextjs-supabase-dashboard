'use client'

import * as React from 'react'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { useTranslation } from 'react-i18next'

export interface LinkProps
  extends NextLinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  text?: string
}

export function Link({ children, text, translate, ...props }: LinkProps) {
  const { t } = useTranslation()

  return (
    <NextLink {...props}>
      {text && translate === 'yes' ? t(text) : text}
      {children}
    </NextLink>
  )
}
