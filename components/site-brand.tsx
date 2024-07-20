import * as React from 'react'
import Link from 'next/link'

import { absoluteUrl } from '@/lib/utils'
import { siteConfig } from '@/config/site'

const SiteBrand = ({ className }: { className?: string }) => {
  return (
    <Link className={className} href={absoluteUrl('/')}>
      <img
        className="size-8 min-w-8"
        src="/assets/icons/manifest/icon.svg"
        alt=""
      />
      <span className="sr-only">{siteConfig?.name}</span>
    </Link>
  )
}

export { SiteBrand }
