import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SITE_URL}${path}`
}

export async function fetcher<JSON = any>(
  input: string,
  init?: RequestInit | undefined
): Promise<JSON> {
  input = /^\//.test(input) ? process.env.NEXT_PUBLIC_SITE_URL + input : input
  return await fetch(input, init).then((res) => res.json())
}
