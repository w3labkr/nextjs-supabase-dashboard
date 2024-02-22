'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { LucideIcon, LucideIconNameProp } from '@/lib/lucide-icon'
import { Button, ButtonProps } from '@/components/ui/button'

interface SubmitButtonProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string | undefined
  disabled?: boolean | undefined
  isSubmitting?: boolean | undefined
  submittingIconName?: LucideIconNameProp | undefined
  submittingIconClassName?: string | undefined
}

export function SubmitButton({
  children,
  text,
  translate,
  disabled,
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
      {text && translate === 'yes' ? t(text) : text}
      {children}
    </Button>
  )
}
