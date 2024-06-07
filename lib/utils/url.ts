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
    if (object[k] === undefined || object[k] === null || object[k] === '') {
      return acc
    }
    acc[k as keyof T] = object[k]
    return acc
  }, {} as T)

  return new URLSearchParams(params).toString()
}

export function getPostPath(
  post: Partial<Post> | null,
  params?: { username?: string | null; slug?: string | null }
): string | null {
  const username = params?.username ?? post?.author?.username
  const slug = params?.slug ?? post?.slug

  return username && slug ? `/${username}/${slug}` : null
}

export function getPostUrl(
  post: Partial<Post> | null,
  params?: { username?: string | null; slug?: string | null }
): string | null {
  const pathname = getPostPath(post, params)

  return pathname ? absoluteUrl(pathname) : null
}

export function getAuthorPath(
  post: Partial<Post> | null,
  params?: { username?: string | null }
): string | null {
  const username = params?.username ?? post?.author?.username

  return username ? `/${username}` : null
}

export function getAuthorUrl(
  post: Partial<Post> | null,
  params?: { username?: string | null }
): string | null {
  const pathname = getAuthorPath(post, params)

  return pathname ? absoluteUrl(pathname) : null
}

export function getArchivePath(): string {
  return `/posts`
}

export function getArchiveUrl(): string {
  return absoluteUrl(getArchivePath())
}

export function getProfilePath(username?: string | null): string | null {
  return username ? `/${username}` : null
}

export function getProfileUrl(username?: string | null): string | null {
  const pathname = getProfilePath(username)

  return pathname ? absoluteUrl(pathname) : null
}
