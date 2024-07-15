'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
import { cn, fetcher } from '@/lib/utils'

import { useSWRConfig } from 'swr'
import { useAuth } from '@/hooks/use-auth'
import { useFavoriteAPI } from '@/queries/client/favorites'
import { useUserAPI } from '@/queries/client/users'
import { FavoriteAPI } from '@/types/api'

interface FavoriteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: number
}

const FavoriteButton = ({ id, ...props }: FavoriteButtonProps) => {
  const { user } = useAuth()

  return user ? (
    <SignedInAction id={id} {...props} />
  ) : (
    <SignedOutAction id={id} {...props} />
  )
}

const SignedInAction = ({ id, ...props }: FavoriteButtonProps) => {
  const { user } = useUserAPI()
  const { favorite } = useFavoriteAPI(null, {
    postId: id,
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

  const onClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')

      const { error } = await fetcher<FavoriteAPI>(
        `/api/v1/favorite?postId=${id}&userId=${user?.id}`,
        {
          method: 'POST',
          body: JSON.stringify({
            data: { is_favorite: !isLike },
          }),
        }
      )

      if (error) throw new Error(error?.message)

      setIsLike(!isLike)

      mutate(`/api/v1/favorite?postId=${id}&userId=${user?.id}`)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button type="button" onClick={onClick} disabled={isSubmitting} {...props}>
      <LucideIcon
        name="Heart"
        className={cn(
          'size-5 min-w-5 text-destructive dark:text-white',
          isLike ? 'fill-destructive dark:fill-white' : ''
        )}
      />
    </button>
  )
}

const SignedOutAction = ({ id, ...props }: FavoriteButtonProps) => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <button
      type="button"
      onClick={() => router.push(`/auth/signin?next=${pathname}`)}
      {...props}
    >
      <LucideIcon
        name="Heart"
        className="size-5 min-w-5 text-destructive dark:text-white"
      />
    </button>
  )
}

export { FavoriteButton, type FavoriteButtonProps }
