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
import { setAppLanguage } from '@/store/reducers/app-reducer'

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
  const { language } = useAppSelector(({ app }) => app)
  const { t, i18n } = useTranslation()
  const [open, setOpen] = React.useState<boolean>(false)

  const onSelect = (currentValue: string) => {
    if (currentValue === language) return false

    i18n.changeLanguage(currentValue)
    dispatch(setAppLanguage(currentValue))

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
            {language
              ? languages?.find((lang: Language) => lang?.value === language)
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
            {languages?.map((lang: Language) => (
              <ListItem
                key={lang?.value}
                lang={lang}
                language={language}
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
  lang,
  language,
  onSelect,
}: {
  lang: Language
  language: string
  onSelect: (value: string) => void
}) => {
  return (
    <CommandItem
      value={lang?.value}
      onSelect={onSelect}
      className="cursor-pointer"
    >
      <LucideIcon
        name="Check"
        className={cn(
          'mr-2 size-4 min-w-4',
          lang?.value === language ? 'opacity-100' : 'opacity-0'
        )}
      />
      {lang?.native}
    </CommandItem>
  )
}

export { LanguageCombobox, type LanguageComboboxProps }
