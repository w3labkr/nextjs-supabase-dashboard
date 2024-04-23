export function absoluteUrl(pathname?: string): string {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL!)
  if (pathname) url.pathname = pathname

  return url.toString()
}

export function createQueryString<T extends Record<string, any>>(
  object: T
): string {
  const params = Object.keys(object).reduce((acc: T, key: string) => {
    acc[key as keyof T] = object[key]
    return acc
  }, {} as T)

  return new URLSearchParams(params).toString()
}
