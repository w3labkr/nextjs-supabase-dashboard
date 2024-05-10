'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
import { cn } from '@/lib/utils'

import { useSWRConfig } from 'swr'
import { createClient } from '@/supabase/client'
import { Post } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { useFavoriteAPI } from '@/queries/client/favorites'

interface FavoriteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  post: Post
}

const FavoriteButton = (props: FavoriteButtonProps) => {
  const { post, ...rest } = props

  const router = useRouter()
  const pathname = usePathname()

  const { user } = useAuth()
  const { favorite } = useFavoriteAPI(null, { pid: post?.id, uid: user?.id })
  const { mutate } = useSWRConfig()

  const [isLike, setIsLike] = React.useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (favorite?.is_favorite) {
      setIsLike(favorite?.is_favorite)
    }
  }, [favorite?.is_favorite])

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) {
        router?.push(`/auth/signin?next=${pathname}`)
        return false
      }

      const supabase = createClient()
      const result = await supabase.rpc('set_favorite', {
        pid: post?.id,
        uid: post?.user_id,
        isfavorite: !isLike,
      })

      if (result?.error) throw new Error(result?.error?.message)

      setIsLike(!isLike)

      mutate(`/api/v1/favorite?pid=${post?.id}&uid=${user?.id}`)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={isSubmitting} {...rest}>
      <LucideIcon
        name="Heart"
        fill={cn(isLike ? '#ef4444' : 'transparent')}
        className={cn('size-5 min-w-5 text-red-500')}
      />
    </button>
  )
}

export { FavoriteButton, type FavoriteButtonProps }
