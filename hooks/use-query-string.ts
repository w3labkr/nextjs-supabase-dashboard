'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'

export function useQueryString() {
  const searchParams = useSearchParams()

  const qs = React.useCallback(
    (name?: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (!name && !value) return Object.fromEntries(params.entries())
      if (name && !value) return params.get(name)
      if (name && value) params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return { qs }
}
