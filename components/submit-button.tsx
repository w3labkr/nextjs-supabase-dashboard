'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { Button, ButtonProps } from '@/components/ui/button'

interface SubmitButtonProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  startIconName?: LucideIconName
  startIconClassName?: string
  endIconName?: LucideIconName
  endIconClassName?: string
  text?: string
  isSubmitting?: boolean
  submittingIconName?: LucideIconName
  submittingIconClassName?: string
}

export function SubmitButton({
  children,
  disabled,
  startIconName,
  startIconClassName,
  endIconName,
  endIconClassName,
  translate,
  text = 'Submit',
  isSubmitting = false,
  submittingIconName = 'LoaderCircle',
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
