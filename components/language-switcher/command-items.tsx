'use client'

import * as React from 'react'

import { ResolvedLanguage, Languages } from '@/types/i18next'

import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { CommandItem } from '@/components/ui/command'

export interface CommandItemsProps {
  items: Languages[]
  language: ResolvedLanguage
  onSelect: (value: string) => void
  className?: string
}

export function CommandItems({
  items,
  language,
  onSelect,
  className,
}: CommandItemsProps) {
  return items.map((item) => (
    <CommandItem
      key={item.value}
      value={item.value}
      onSelect={onSelect}
      className={cn('cursor-pointer', className)}
    >
      <LucideIcon
        name="Check"
        className={cn(
          'mr-2 h-4 w-4',
          item.value === language ? 'opacity-100' : 'opacity-0'
        )}
      />
      {item.label}
    </CommandItem>
  ))
}
