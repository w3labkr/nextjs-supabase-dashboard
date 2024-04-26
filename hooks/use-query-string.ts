'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'

export function useQueryString() {
  const searchParams = useSearchParams()

  const qs = React.useCallback(
    <T extends Record<string, any>>(object: T): string => {
      const params = new URLSearchParams(searchParams.toString())

      if (object) {
        Object.keys(object).forEach((key: string) => {
          if (object[key] === null || object[key] === undefined) {
            params.delete(key)
            return
          }
          params.set(key, object[key])
        })
      }

      return params.toString()
    },
    [searchParams]
  )

  return { qs }
}
