'use client'

import * as React from 'react'

import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'

interface FavoriteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const FavoriteButton = (props: FavoriteButtonProps) => {
  const { ...rest } = props
  const [isLike, setIsLike] = React.useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      setIsLike(!isLike)

      // ...
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
