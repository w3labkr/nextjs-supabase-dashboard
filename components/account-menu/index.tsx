'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from '@/components/ui/dropdown-menu'
import { SignOutButton } from '@/components/signout-button'

import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/api/use-profile'

export function AccountMenu() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data: profile, isLoading } = useProfile(user?.id ?? null)

  if (isLoading) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-800"
          size="icon"
          variant="ghost"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="Avatar" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle account menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="grid font-normal">
          <span>{profile?.name}</span>
          <span className="text-xs text-muted-foreground">
            {profile?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings/profile" className="cursor-pointer">
            {t('AccountMenu.profile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings/profile" className="cursor-pointer">
            {t('AccountMenu.settings')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton
            variant="ghost"
            className="flex h-auto w-full justify-start p-0 font-normal"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
