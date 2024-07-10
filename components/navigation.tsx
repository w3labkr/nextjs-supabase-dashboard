'use client'

import * as React from 'react'
import Link from 'next/link'

import {
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenu,
} from '@/components/ui/navigation-menu'
import { absoluteUrl } from '@/lib/utils'

const Navigation = () => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-2">
        <NavigationMenuLink asChild>
          <Link
            className="text-sm hover:underline"
            href={absoluteUrl('/posts')}
          >
            Posts
          </Link>
        </NavigationMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export { Navigation }
