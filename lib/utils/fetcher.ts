export function fetcher<JSON = any>(
  input: string,
  init?: RequestInit
): Promise<JSON> {
  return fetch(input, init).then((res) => res.json())
}
