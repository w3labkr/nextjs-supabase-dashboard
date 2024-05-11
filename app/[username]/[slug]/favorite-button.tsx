'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
import { cn, fetcher, getAuthorPath } from '@/lib/utils'

import { useSWRConfig } from 'swr'
import { Post } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { useFavoriteAPI } from '@/queries/client/favorites'
import { FavoriteAPI } from '@/types/api'
import { useProfileAPI } from '@/queries/client/profiles'

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

  const { user } = useAuth()
  const { profile } = useProfileAPI(user?.id ?? null)
  const { favorite } = useFavoriteAPI(null, {
    postId: post?.id,
    userId: user?.id,
  })
  const { mutate } = useSWRConfig()

  const [isLike, setIsLike] = React.useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const is_favorite = favorite?.is_favorite

  React.useEffect(() => {
    if (is_favorite) {
      setIsLike(is_favorite)
    }
  }, [is_favorite])

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')
      if (!profile?.username) throw new Error('Require is not defined.')

      const formData = { is_favorite: !is_favorite }

      const fetchUrl = `/api/v1/favorite?postId=${post?.id}&userId=${user?.id}`
      const fetchOptions = {
        revalidatePaths: getAuthorPath(profile?.username) + '/favorites',
      }

      const result = await fetcher<FavoriteAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({ formData, options: fetchOptions }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      setIsLike(!is_favorite)

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
        className={cn('size-5 min-w-5 text-red-500')}
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
        className={cn('size-5 min-w-5 text-red-500')}
      />
    </button>
  )
}

export { FavoriteButton, type FavoriteButtonProps }
