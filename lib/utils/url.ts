import { Post } from '@/types/database'

export function absoluteUrl(pathname?: string): string {
  const origin = process.env.NEXT_PUBLIC_SITE_URL!
  const uri = `${origin}/${pathname}`
  const sanitized = uri.replace(/\/+/g, '/').replace(/\/+$/, '')
  const url = new URL(sanitized)

  return url.toString()
}

export function getQueryString(searchParams: URLSearchParams) {
  return Object.fromEntries(searchParams?.entries())
}

export function setQueryString<T extends Record<string, any>>(
  object: T
): string {
  const params = Object.keys(object).reduce((acc: T, k: string) => {
    if (object[k] === null || object[k] === undefined || object[k] === '') {
      return acc
    }
    acc[k as keyof T] = object[k]
    return acc
  }, {} as T)

  return new URLSearchParams(params).toString()
}

export function getPostPath(
  post: Post | null,
  slug?: string | null
): string | null {
  const username = post?.author?.username
  const postname = slug ?? post?.slug

  return username && postname ? `/${username}/${postname}` : null
}

export function getPostUrl(
  post: Post | null,
  slug?: string | null
): string | null {
  const username = post?.author?.username
  const postname = slug ?? post?.slug

  return username && postname ? absoluteUrl(`/${username}/${postname}`) : null
}

export function getAuthorPath(username?: string | null): string | null {
  return username ? `/${username}` : null
}

export function getAuthorUrl(username?: string | null): string | null {
  return username ? absoluteUrl(`/${username}`) : null
}
