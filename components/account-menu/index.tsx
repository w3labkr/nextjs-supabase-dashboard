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

interface StateProps {
  username: string
  email: string
  initial: string
}

export function AccountMenu() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [state, setState] = React.useState<StateProps>({
    username: '',
    email: '',
    initial: '',
  })

  React.useEffect(() => {
    const email = user?.email ?? ''
    setState({
      email,
      username: email.split('@')[0],
      initial: email.charAt(0).toUpperCase(),
    })
  }, [user])

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
            <AvatarFallback>{state.initial}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="grid font-normal">
          <span>{state.username}</span>
          <span className="text-xs text-muted-foreground">{state.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings/profile" className="cursor-pointer">
            {t('profile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings/profile" className="cursor-pointer">
            {t('settings')}
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
