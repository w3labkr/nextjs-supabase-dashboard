import * as React from 'react'

import { AppBar } from '@/components/dashboard/app-bar'
import {
  PersistentDrawer,
  drawerItemProps,
} from '@/components/dashboard/persistent-drawer'

const drawerItems: drawerItemProps[] = [
  { id: 1, title: 'New Post', href: '/dashboard/posts/new' },
  { id: 2, title: 'Edit Post', href: '/dashboard/posts/edit' },
]

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PersistentDrawer title="Posts" drawerItems={drawerItems} />
      <div className="hide-scrollbar flex flex-1 flex-col">
        <AppBar />
        {children}
      </div>
    </>
  )
}
