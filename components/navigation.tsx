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
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuLink asChild>
          <Link className="text-sm" href={absoluteUrl('/posts')}>
            POSTS
          </Link>
        </NavigationMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export { Navigation }
