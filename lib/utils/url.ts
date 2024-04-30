import { kebabCase } from 'lodash'
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
  const params = Object.keys(object).reduce((acc: T, key: string) => {
    if (
      object[key] === null ||
      object[key] === undefined ||
      object[key] === ''
    ) {
      return acc
    }
    acc[key as keyof T] = object[key]
    return acc
  }, {} as T)

  return new URLSearchParams(params).toString()
}

export function getPostPath(post: Post | null, slug?: string): string | null {
  const username = post?.profile?.username
  const slugified = kebabCase(slug ?? post?.slug ?? undefined)

  return post ? `/${username}/posts/${slugified}` : null
}

export function getPostUrl(post: Post | null, slug?: string): string | null {
  const path = getPostPath(post, slug)

  return path ? absoluteUrl(path) : null
}

export function getAuthorPath(post: Post | null): string | null {
  return post ? `/${post?.profile?.username}` : null
}

export function getAuthorUrl(post: Post | null): string | null {
  const path = getAuthorPath(post)

  return path ? absoluteUrl(path) : null
}
