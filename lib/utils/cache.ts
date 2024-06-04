import { revalidatePath, revalidateTag } from 'next/cache'

export function revalidates(options: {
  revalidatePaths?: string | string[] | null
  revalidateTags?: string | string[] | null
  [key: string]: any
}): boolean {
  let revalidated: boolean = false

  if (options?.revalidatePaths) {
    revalidated = revalidatePaths(options?.revalidatePaths)
  }

  if (options?.revalidateTags) {
    revalidated = revalidateTags(options?.revalidateTags)
  }

  return revalidated
}

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

export function revalidateTags(tags?: string | string[] | null): boolean {
  let revalidated: boolean = false

  if (typeof tags === 'string') {
    revalidateTag(tags)
    revalidated = true
  } else if (Array.isArray(tags) && tags?.length > 0) {
    tags.forEach((path: string) => {
      revalidateTag(path)
      revalidated = true
    })
  }

  return revalidated
}
