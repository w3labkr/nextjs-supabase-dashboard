'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/utils/tailwind'
import { LucideIcon, LucideIconNameProp } from '@/lib/lucide-icon'
import { Button, ButtonProps } from '@/components/ui/button'

interface SubmitButtonProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string | undefined
  disabled?: boolean | undefined
  startIconName?: LucideIconNameProp | undefined
  startIconClassName?: string | undefined
  endIconName?: LucideIconNameProp | undefined
  endIconClassName?: string | undefined
  isSubmitting?: boolean | undefined
  submittingIconName?: LucideIconNameProp | undefined
  submittingIconClassName?: string | undefined
}

export function SubmitButton({
  children,
  text,
  translate,
  disabled,
  startIconName,
  startIconClassName,
  endIconName,
  endIconClassName,
  isSubmitting = false,
  submittingIconName = 'Loader2',
  submittingIconClassName = '',
  ...props
}: SubmitButtonProps) {
  const { t } = useTranslation()

  return (
    <Button type="submit" disabled={disabled ?? isSubmitting} {...props}>
      {isSubmitting && submittingIconName && (
        <LucideIcon
          name={submittingIconName}
          className={cn(
            'mr-2 size-4 min-w-4 animate-spin',
            submittingIconClassName
          )}
        />
      )}
      {startIconName && (
        <LucideIcon
          name={startIconName}
          className={cn('mr-2 size-4 min-w-4', startIconClassName)}
        />
      )}
      {text && translate === 'yes' ? t(text) : text}
      {children}
      {endIconName && (
        <LucideIcon
          name={endIconName}
          className={cn('ml-2 size-4 min-w-4', endIconClassName)}
        />
      )}
    </Button>
  )
}
