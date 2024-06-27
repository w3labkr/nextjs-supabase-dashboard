import { Post, User } from '@/types/database'

export function absoluteUrl(pathname?: string): string {
  const origin = process.env.NEXT_PUBLIC_APP_URL!
  const uri = `${origin}/${pathname}`
  const sanitized = uri.replace(/\/+/g, '/').replace(/\/+$/, '')
  const url = new URL(sanitized)

  return url.toString()
}

export function setUrn(pathname: string, queryString: string): string {
  const sanitized = pathname.replace(/\/+/g, '/').replace(/\/+$/, '')

  return [sanitized, queryString].filter(Boolean).join('?')
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

export function getAuthorFavoritesPath(
  post: Partial<Post> | null,
  params?: { username?: string | null }
): string | null {
  const pathname = getAuthorPath(post, params)

  return pathname ? pathname + '/favorites' : null
}

export function getAuthorFavoritesUrl(
  post: Partial<Post> | null,
  params?: { username?: string | null }
): string | null {
  const pathname = getAuthorFavoritesPath(post, params)

  return pathname ? absoluteUrl(pathname) : null
}

export function getArchivePath(): string {
  return `/posts`
}

export function getArchiveUrl(): string {
  return absoluteUrl(getArchivePath())
}

export function getProfilePath(
  user: User | null,
  params?: { username?: string | null }
): string | null {
  const pathname = params?.username ?? user?.username

  return pathname ? `/${pathname}` : null
}

export function getProfileUrl(
  user: User | null,
  params?: { username?: string | null }
): string | null {
  const pathname = getProfilePath(user, params)

  return pathname ? absoluteUrl(pathname) : null
}

export function getFavoritesPath(
  user: User | null,
  params?: { username?: string | null }
): string | null {
  const pathname = getProfilePath(user, params)

  return pathname ? pathname + '/favorites' : null
}

export function getFavoritesUrl(
  user: User | null,
  params?: { username?: string | null }
): string | null {
  const pathname = getFavoritesPath(user, params)

  return pathname ? absoluteUrl(pathname) : null
}
