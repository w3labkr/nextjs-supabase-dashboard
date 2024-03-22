import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function fetcher<JSON = any>(
  input: string,
  init?: RequestInit | undefined
): Promise<JSON> {
  return fetch(input, init).then((res) => res.json())
}

export function absoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SITE_URL}${path}`
}

export function isObject(obj: any): boolean {
  return obj !== undefined && obj !== null && obj.constructor == Object
}

export function isArray(obj: any): boolean {
  return obj !== undefined && obj !== null && obj.constructor == Array
}

export function isBoolean(obj: any): boolean {
  return obj !== undefined && obj !== null && obj.constructor == Boolean
}

export function isFunction(obj: any): boolean {
  return obj !== undefined && obj !== null && obj.constructor == Function
}

export function isNumber(obj: any): boolean {
  return obj !== undefined && obj !== null && obj.constructor == Number
}

export function isString(obj: any): boolean {
  return obj !== undefined && obj !== null && obj.constructor == String
}
