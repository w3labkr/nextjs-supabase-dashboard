'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import * as Bowser from 'bowser'
import { flatten } from 'flat'

import { createClient } from '@/supabase/client'
import { fetcher } from '@/lib/utils'
import { IpAPI } from '@/types/api'
import { useAuth } from '@/hooks/use-auth'

interface StorageValues {
  visitorId: string
  location: string
  path: string
  referrer: string
}

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

const Statistics = () => {
  const pathname = usePathname()
  const { user } = useAuth()

  const setStatistics = React.useCallback(
    async (values: StorageValues) => {
      const ip = await fetcher<IpAPI>('/api/ip')
      const ua = globalThis?.navigator.userAgent
      const browser: Browser = flatten(Bowser.parse(ua))

      const data = {
        user_id: user?.id ?? null,
        visitor_id: values?.visitorId,
        title: document.title,
        location: values.location,
        path: values.path,
        referrer: values.referrer,
        ip,
        browser,
        user_agent: ua,
      }

      const supabase = createClient()
      const { error } = await supabase.rpc('set_statistics', { data })
      if (error) console.error(error)
    },
    [user?.id]
  )

  React.useEffect(() => {
    const storage = globalThis?.localStorage
    if (!storage) return

    const data = storage?.getItem('app:statistics') ?? '{}'
    const previous = JSON.parse(data)
    const values: StorageValues = {
      visitorId: previous?.visitorId ?? crypto.randomUUID(),
      location: globalThis?.location.href,
      path: globalThis?.location.pathname,
      referrer:
        previous?.location === globalThis?.location.href
          ? ''
          : previous?.location ?? '',
    }

    storage?.setItem('app:statistics', JSON.stringify(values))

    setStatistics(values)
  }, [pathname, setStatistics])

  return null
}

export { Statistics }
