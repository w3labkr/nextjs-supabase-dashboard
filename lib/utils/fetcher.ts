export function fetcher<JSON = any>(
  input: string,
  init?: RequestInit
): Promise<JSON> {
  if (/^\//.test(input)) input = process.env.NEXT_PUBLIC_SITE_URL! + input
  return fetch(input, init).then((res) => res.json())
}
