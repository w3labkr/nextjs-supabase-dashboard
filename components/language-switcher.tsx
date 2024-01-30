'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { useTranslation } from 'react-i18next'
import { languages } from '@/i18next.config'

import { cn } from '@/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function LanguageSwitcher({ width = '320px' }: { width?: string }) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = React.useState<boolean>(false)
  const [value, setValue] = React.useState<string | undefined>(
    i18n.resolvedLanguage
  )

  const handleChange = (currentValue: string) => {
    i18n.changeLanguage(currentValue)
    document.documentElement.lang = currentValue
    setValue(currentValue === value ? '' : currentValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[${width}] justify-between`}
        >
          {value
            ? languages.find((language) => language.value === value)?.label
            : t('Search language')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-[${width}] p-0`}>
        <Command>
          <CommandInput placeholder={t('Search language')} />
          <CommandEmpty>{t('No language found')}</CommandEmpty>
          <CommandGroup>
            {languages.map((language) => (
              <CommandItem
                key={language.value}
                value={language.value}
                onSelect={handleChange}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === language.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {language.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
