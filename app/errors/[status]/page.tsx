import * as React from 'react'

import { Error } from '@/components/error'
import { ButtonLink } from '@/components/button-link'

export default function NotFound({
  params: { status },
}: {
  params: { status: string }
}) {
  return (
    <div className="relative">
      <ButtonLink
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        startIconName="ChevronLeft"
        text="ButtonLink.home"
        translate="yes"
      />
      <Error status={status} />
    </div>
  )
}
