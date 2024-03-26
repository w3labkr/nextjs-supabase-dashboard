'use client'

import * as React from 'react'

import { useTranslation } from 'react-i18next'
import { languageItems } from '@/i18next.config'
import { ResolvedLanguage, LanguageItem } from '@/types/i18next'

import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
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

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

export function LanguageSwitcher({
  className,
  triggerClassName,
  contentClassName,
}: {
  className?: string | undefined
  triggerClassName?: string | undefined
  contentClassName?: string | undefined
}) {
  const { t, i18n } = useTranslation()

  const dispatch = useAppDispatch()
  const resolvedLanguage = useAppSelector(
    (state) => state?.i18n?.resolvedLanguage
  )
  const [open, setOpen] = React.useState<boolean>(false)

  const handleSelect = (currentValue: string) => {
    if (currentValue === resolvedLanguage) return false
    i18n.changeLanguage(currentValue)
    document.documentElement.lang = currentValue
    dispatch(setResolvedLanguage(currentValue))
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
          {resolvedLanguage
            ? languageItems.find((l) => l.value === resolvedLanguage)?.label
            : t('LanguageSwitcher.label')}
          <LucideIcon
            name="ChevronsUpDown"
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-50 p-0', className, contentClassName)}>
        <Command>
          <CommandInput placeholder={t('LanguageSwitcher.placeholder')} />
          <CommandEmpty>{t('LanguageSwitcher.empty')}</CommandEmpty>
          <CommandGroup>
            {languageItems.map((item) => (
              <LanguageSwitcherItem
                key={item?.value}
                item={item}
                resolvedLanguage={resolvedLanguage}
                onSelect={handleSelect}
              />
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function LanguageSwitcherItem({
  item,
  resolvedLanguage,
  onSelect,
}: {
  item: LanguageItem
  resolvedLanguage: ResolvedLanguage
  onSelect: (value: string) => void
}) {
  return (
    <CommandItem
      value={item?.value}
      onSelect={onSelect}
      className="cursor-pointer"
    >
      <LucideIcon
        name="Check"
        className={cn(
          'mr-2 h-4 w-4',
          item?.value === resolvedLanguage ? 'opacity-100' : 'opacity-0'
        )}
      />
      {item.label}
    </CommandItem>
  )
}
