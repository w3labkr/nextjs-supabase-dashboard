'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTrans } from '@/hooks/use-trans'

const Policy = () => {
  const { trans } = useTrans()

  return (
    <p className="text-sm text-muted-foreground">
      {trans(
        'by_clicking_sign_up_you_agree_to_our_terms_of_service_and_privacy_policy',
        {
          components: {
            link1: (
              <Link href="/policy/terms" className="text-primary underline" />
            ),
            link2: (
              <Link href="/policy/privacy" className="text-primary underline" />
            ),
          },
        }
      )}
    </p>
  )
}

export { Policy }
