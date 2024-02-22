import merge from 'lodash/merge'
import { i18n } from '@/lib/utils'

export async function fetcher<JSON = any>(
  input: string,
  init?: RequestInit | undefined
): Promise<JSON> {
  if (/^\//.test(input)) {
    input = process.env.NEXT_PUBLIC_SITE_URL + input
  }
  return await fetch(input, init)
    .then((res) => res.json())
    .then((res) => {
      if (res?.error) {
        return merge(res, {
          error: { i18n: i18n(res?.error?.message) },
        })
      }
      return res
    })
}
