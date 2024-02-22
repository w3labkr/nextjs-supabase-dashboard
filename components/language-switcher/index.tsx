'use client'

import * as React from 'react'

import { useTranslation } from 'react-i18next'
import { languages } from '@/i18next.config'
import { ResolvedLanguage } from '@/types/i18next'

import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { CommandItems } from './command-items'

export interface LanguageSwitcherProps {
  className?: string | undefined
  triggerClassName?: string | undefined
  contentClassName?: string | undefined
}

export function LanguageSwitcher({
  className,
  triggerClassName,
  contentClassName,
}: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = React.useState<boolean>(false)
  const [language, setLanguage] = React.useState<ResolvedLanguage>(
    i18n.resolvedLanguage
  )

  const handleChange = (currentValue: string) => {
    if (currentValue === language) return false
    i18n.changeLanguage(currentValue)
    document.documentElement.lang = currentValue
    setLanguage(currentValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-50 justify-between', className, triggerClassName)}
        >
          {language
            ? languages.find((l) => l.value === language)?.label
            : t('search_language')}
          <LucideIcon
            name="ChevronsUpDown"
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-50 p-0', className, contentClassName)}>
        <Command>
          <CommandInput placeholder={t('search_language')} />
          <CommandEmpty>{t('no_language_found')}</CommandEmpty>
          <CommandGroup>
            <CommandItems
              items={languages}
              language={language}
              onSelect={handleChange}
            />
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
