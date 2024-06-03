'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
import { cn, fetcher, getAuthorPath } from '@/lib/utils'

import { useSWRConfig } from 'swr'
import { useAuth } from '@/hooks/use-auth'
import { useFavoriteAPI } from '@/queries/client/favorites'
import { useUserAPI } from '@/queries/client/users'
import { FavoriteAPI } from '@/types/api'
import { Post } from '@/types/database'

interface FavoriteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  post: Post
}

const FavoriteButton = (props: FavoriteButtonProps) => {
  const { user } = useAuth()

  return user ? <SignedInAction {...props} /> : <SignedOutAction {...props} />
}

const SignedInAction = (props: FavoriteButtonProps) => {
  const { post, ...rest } = props

  const { user } = useUserAPI()
  const { favorite } = useFavoriteAPI(null, {
    postId: post?.id,
    userId: user?.id ?? undefined,
  })
  const { mutate } = useSWRConfig()

  const [isLike, setIsLike] = React.useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (favorite?.is_favorite !== undefined) {
      setIsLike(favorite?.is_favorite)
    }
  }, [favorite?.is_favorite])

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      const username = user?.username

      if (!user) throw new Error('Require is not defined.')
      if (!username) throw new Error('Require is not defined.')

      const fetchUrl = `/api/v1/favorite?postId=${post?.id}&userId=${user?.id}`
      const result = await fetcher<FavoriteAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          data: { is_favorite: !isLike },
          options: { revalidatePaths: getAuthorPath(username) + '/favorites' },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      setIsLike(!isLike)

      mutate(fetchUrl)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting}
      {...rest}
    >
      <LucideIcon
        name="Heart"
        fill={cn(isLike ? '#ef4444' : 'transparent')}
        className={cn('size-5 min-w-5 text-destructive')}
      />
    </button>
  )
}

const SignedOutAction = (props: FavoriteButtonProps) => {
  const { post, ...rest } = props
  const router = useRouter()
  const pathname = usePathname()

  return (
    <button
      type="button"
      onClick={() => router?.push(`/auth/signin?next=${pathname}`)}
      {...rest}
    >
      <LucideIcon
        name="Heart"
        fill="transparent"
        className={cn('size-5 min-w-5 text-destructive')}
      />
    </button>
  )
}

export { FavoriteButton, type FavoriteButtonProps }
