export function absoluteUrl(path?: string): string {
  const origin = process.env.NEXT_PUBLIC_APP_URL!
  const uri = `${origin}/${path}`
  const sanitized = uri.replace(/\/+/g, '/').replace(/\/+$/, '')
  const url = new URL(sanitized)

  return url.toString()
}

export function setUrn(path: string, query: string): string {
  const sanitized = path.replace(/\/+/g, '/').replace(/\/+$/, '')

  return [sanitized, query].filter(Boolean).join('?')
}

export function getQueryString(searchParams: URLSearchParams) {
  return Object.fromEntries(searchParams?.entries())
}

export function setQueryString<T extends Record<string, any>>(
  object: T
): string {
  const params = Object.keys(object).reduce((acc: T, key: string) => {
    if (object[key] === undefined || object[key] === null) {
      return acc
    }
    acc[key as keyof T] = object[key]
    return acc
  }, {} as T)

  return new URLSearchParams(params).toString()
}
