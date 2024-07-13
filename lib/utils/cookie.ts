'use client'

export function setCookie(key: string, value: string): void {
  document.cookie = key + '=' + value + '; path=/;'
}

export function getCookie(key: string): string | null {
  const cookies = document.cookie.split(';') ?? []
  for (let i = 0; i < cookies.length; i++) {
    const v = cookies[i].split('=')
    if (v[0].trim() === key) return v[1]
  }
  return null
}

export function deleteCookie(key: string): void {
  document.cookie =
    key + '=; Max-Age=0; path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}
