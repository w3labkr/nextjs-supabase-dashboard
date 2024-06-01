export function getMeta<T extends Array<Record<string, any>> | undefined>(
  data: T,
  key: string,
  defaultValue?: string | null
): any {
  return (
    data?.find((r: Record<string, any>) => r.meta_key === key)?.meta_value ??
    defaultValue
  )
}
