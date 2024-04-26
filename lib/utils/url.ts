export function absoluteUrl(pathname?: string): string {
  const origin = process.env.NEXT_PUBLIC_SITE_URL!
  const url = new URL(`${origin}${pathname}`)

  return url.toString()
}

export function getSearchParams(searchParams: URLSearchParams) {
  return Object.fromEntries(searchParams?.entries())
}

export function setSearchParams<T extends Record<string, any>>(
  object: T
): string {
  const params = Object.keys(object).reduce((acc: T, key: string) => {
    if (object[key] === null || object[key] === undefined) return acc
    acc[key as keyof T] = object[key]
    return acc
  }, {} as T)

  return new URLSearchParams(params).toString()
}
