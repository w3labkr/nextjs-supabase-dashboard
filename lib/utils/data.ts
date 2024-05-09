export function setMeta<T extends Record<string, any>>(
  data: T
): Omit<T, 'meta'> & {
  meta: Record<string, string>
} {
  const meta: Record<string, string> = data?.meta?.reduce(
    (acc: Record<string, string>, obj: Record<string, any>) => {
      acc[obj.meta_key] = obj.meta_value
      return acc
    },
    {}
  )

  return { ...data, meta }
}
