'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import * as Bowser from 'bowser'
import { flatten } from 'flat'

import { createClient } from '@/supabase/client'
import { fetcher } from '@/lib/utils'
import { IpAPI } from '@/types/api'
import { useAuth } from '@/hooks/use-auth'
import { Post } from '@/types/database'

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

interface StatisticsProps {
  post: Post
}

const Statistics = ({ post }: StatisticsProps) => {
  const pathname = usePathname()
  const { user } = useAuth()

  const setStatistics = React.useCallback(
    async (values: StorageValues) => {
      const ip = await fetcher<IpAPI>('/api/ip')
      const ua = globalThis?.navigator.userAgent
      const browser: Browser = flatten(Bowser.parse(ua))

      const supabase = createClient()
      const { error } = await supabase.rpc('set_statistics', {
        data: {
          visitor_id: values?.visitorId,
          user_id: user?.id ?? null,
          post_id: post?.id,
          title: document.title,
          location: values?.href,
          path: globalThis?.location.pathname,
          referrer: values?.referrer,
          ip,
          browser,
          user_agent: ua,
        },
      })
      if (error) console.log(error)
    },
    [user?.id, post?.id]
  )

  React.useEffect(() => {
    const storage = globalThis?.localStorage
    if (!storage) return

    const data = storage?.getItem('app:statistics') ?? '{}'
    const previous = JSON.parse(data)
    const values: StorageValues = {
      visitorId: previous?.visitorId ?? crypto.randomUUID(),
      href: globalThis?.location.href,
      referrer:
        previous?.href === globalThis?.location.href
          ? ''
          : previous?.href ?? '',
    }

    storage?.setItem('app:statistics', JSON.stringify(values))

    setStatistics(values)
  }, [pathname, setStatistics])

  return null
}

export { Statistics, type StatisticsProps }
