'use client'

import * as React from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Bowser from 'bowser'
import { flatten } from 'flat'

import { createClient } from '@/supabase/client'
import { fetcher, setQueryString } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { type IpAPI } from '@/types/api'

interface Browser {
  'browser.name': string
  'browser.version': string
  'os.name': string
  'os.version': string
  'os.versionName': string
  'platform.type': string
  'platform.vendor': string
  'engine.name': string
  [key: string]: string
}

interface StorageValues {
  visitorId: string
  href: string
  referrer: string
}

interface FormValues extends StorageValues {
  userId: string | null
  query: string
}

const Statistics = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const q = (searchParams.get('q') as string) || null
  const tag = (searchParams.get('tag') as string) || null
  const queryString = setQueryString({ q, tag })
  const { user } = useAuth()

  const setStatistics = React.useCallback(async (values: FormValues) => {
    const ip = await fetcher<IpAPI>('/api/ip')
    const ua = globalThis?.navigator.userAgent
    const browser: Browser = flatten(Bowser.parse(ua))

    const supabase = createClient()
    const result = await supabase.rpc('set_statistics', {
      data: {
        visitor_id: values?.visitorId,
        user_id: values?.userId,
        title: globalThis?.document.title,
        location: values?.href,
        path: globalThis?.location.pathname,
        query: values?.query,
        referrer: values?.referrer,
        ip,
        browser,
        user_agent: ua,
      },
    })
    // console.log(result)
  }, [])

  React.useEffect(() => {
    const storage = globalThis?.localStorage
    if (!storage) return

    const data = storage?.getItem('app:statistics') ?? '{}'
    const previous = JSON.parse(data)
    const current = globalThis?.location

    const storageValues: StorageValues = {
      visitorId: previous?.visitorId ?? crypto.randomUUID(),
      href: current.href ?? '',
      referrer: previous?.href ?? '',
    }

    storage?.setItem('app:statistics', JSON.stringify(storageValues))

    const formValues: FormValues = {
      ...storageValues,
      userId: user?.id ?? null,
      query: queryString ? '?' + queryString : '',
    }

    if (previous?.href !== current.href) {
      setStatistics(formValues)
    }
  }, [user?.id, pathname, queryString, setStatistics])

  return null
}

export { Statistics }
