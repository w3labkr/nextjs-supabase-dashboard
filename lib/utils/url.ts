export function absoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SITE_URL}${path}`
}
