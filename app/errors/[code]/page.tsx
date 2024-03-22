import * as React from 'react'

import { ButtonLink } from '@/components/button-link'
import { Error } from '@/components/error'
import { HttpStatusCode } from '@/types'

export default function NotFound({
  params: { code },
}: {
  params: { code: HttpStatusCode }
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
      <Error statusCode={code} />
    </div>
  )
}
