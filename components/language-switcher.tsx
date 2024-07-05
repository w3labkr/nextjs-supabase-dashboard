'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { useTranslation } from 'react-i18next'
import { languageItems } from '@/i18next.config'
import { ResolvedLanguage, LanguageItem } from '@/types/i18next'

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

import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

interface LanguageSwitcherProps {
  className?: string
  triggerClassName?: string
  contentClassName?: string
}

const LanguageSwitcher = ({
  className,
  triggerClassName,
  contentClassName,
}: LanguageSwitcherProps) => {
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
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-50 justify-between', className, triggerClassName)}
        >
          {resolvedLanguage
            ? languageItems.find((l) => l.value === resolvedLanguage)?.label
            : t('search_language')}
          <LucideIcon
            name="ChevronsUpDown"
            className="ml-2 size-4 min-w-4 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-50 p-0', className, contentClassName)}>
        <Command>
          <CommandInput placeholder={t('search_language')} />
          <CommandEmpty>{t('no_language_found')}</CommandEmpty>
          <CommandGroup>
            {languageItems.map((item) => (
              <LanguageSwitcherItem
                key={item?.value}
                item={item}
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

const LanguageSwitcherItem = ({
  item,
  resolvedLanguage,
  onSelect,
}: {
  item: LanguageItem
  resolvedLanguage: ResolvedLanguage
  onSelect: (value: string) => void
}) => {
  return (
    <CommandItem
      value={item?.value}
      onSelect={onSelect}
      className="cursor-pointer"
    >
      <LucideIcon
        name="Check"
        className={cn(
          'mr-2 size-4 min-w-4',
          item?.value === resolvedLanguage ? 'opacity-100' : 'opacity-0'
        )}
      />
      {item.label}
    </CommandItem>
  )
}

export { LanguageSwitcher, type LanguageSwitcherProps }
