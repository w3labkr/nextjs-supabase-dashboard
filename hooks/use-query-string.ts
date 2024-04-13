'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'

export function useQueryString() {
  const searchParams = useSearchParams()

  const qs = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return { qs }
}
