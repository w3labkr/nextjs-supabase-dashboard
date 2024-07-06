import { absoluteUrl } from '@/lib/utils'

export function fetcher<JSON = any>(
  input: string,
  init?: RequestInit
): Promise<JSON> {
  if (/^\//.test(input)) input = absoluteUrl(input)
  return fetch(input, init).then((response: Response) =>
    response.headers.get('content-type').includes('application/json')
      ? response.json()
      : response.text()
  )
}
