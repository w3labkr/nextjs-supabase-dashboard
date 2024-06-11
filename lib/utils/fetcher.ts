export function fetcher<JSON = any>(
  input: string,
  init?: RequestInit
): Promise<JSON> {
  if (/^\//.test(input)) input = process.env.NEXT_PUBLIC_APP_URL! + input
  return fetch(input, init).then((res) => res.json())
}
