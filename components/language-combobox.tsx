'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { useTranslation } from 'react-i18next'
import { languages, Language } from '@/i18next.config'

import { Button, ButtonProps } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

interface LanguageComboboxProps
  extends ButtonProps,
    React.RefAttributes<HTMLButtonElement> {
  className?: string
}

const LanguageCombobox = ({
  variant = 'outline',
  role = 'combobox',
  className,
  ...props
}: LanguageComboboxProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { resolvedLanguage } = useAppSelector(({ i18n }) => i18n)
  const { t, i18n } = useTranslation()
  const [open, setOpen] = React.useState<boolean>(false)

  const onSelect = (currentValue: string) => {
    if (currentValue === resolvedLanguage) return false

    i18n.changeLanguage(currentValue)
    document.documentElement.lang = currentValue
    dispatch(setResolvedLanguage(currentValue))

    setOpen(false)

    router.refresh()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          role={role}
          className={cn('w-50 justify-between', className)}
          aria-expanded={open}
          {...props}
        >
          <span>
            {resolvedLanguage
              ? languages?.find((l: Language) => l.value === resolvedLanguage)
                  ?.native
              : null}
          </span>
          <LucideIcon
            name="ChevronsUpDown"
            className="ml-2 size-4 min-w-4 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0">
        <Command>
          <CommandInput placeholder={t('search_language')} />
          <CommandEmpty>{t('no_language_found')}</CommandEmpty>
          <CommandGroup>
            {languages?.map((language: Language) => (
              <ListItem
                key={language?.value}
                language={language}
                resolvedLanguage={resolvedLanguage}
                onSelect={onSelect}
              />
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const ListItem = ({
  language,
  resolvedLanguage,
  onSelect,
}: {
  language: Language
  resolvedLanguage: string
  onSelect: (value: string) => void
}) => {
  return (
    <CommandItem
      value={language?.value}
      onSelect={onSelect}
      className="cursor-pointer"
    >
      <LucideIcon
        name="Check"
        className={cn(
          'mr-2 size-4 min-w-4',
          language?.value === resolvedLanguage ? 'opacity-100' : 'opacity-0'
        )}
      />
      {language?.native}
    </CommandItem>
  )
}

export { LanguageCombobox, type LanguageComboboxProps }
