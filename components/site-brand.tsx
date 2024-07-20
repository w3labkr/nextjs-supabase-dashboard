import * as React from 'react'
import Link from 'next/link'

import { absoluteUrl } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { SiteLogo } from '@/components/site-logo'

interface SiteBrandProps {
  className?: string
}

const SiteBrand = ({ className }: SiteBrandProps) => {
  return (
    <Link className={className} href={absoluteUrl('/')}>
      <SiteLogo className="size-8 min-w-8" />
      <span className="sr-only">{siteConfig?.name}</span>
    </Link>
  )
}

export { SiteBrand, type SiteBrandProps }
