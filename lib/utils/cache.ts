import { revalidatePath } from 'next/cache'

export function revalidatePaths(paths?: string | string[] | null): boolean {
  let revalidated: boolean = false

  if (typeof paths === 'string') {
    revalidatePath(encodeURI(paths))
    revalidated = true
  } else if (Array.isArray(paths) && paths?.length > 0) {
    paths.forEach((path: string) => {
      revalidatePath(encodeURI(path))
      revalidated = true
    })
  }

  return revalidated
}
