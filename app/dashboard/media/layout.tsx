import * as React from 'react'

import { AppBar } from '@/components/dashboard/app-bar'
import {
  PersistentDrawer,
  drawerItemProps,
} from '@/components/dashboard/persistent-drawer'

const drawerItems: drawerItemProps[] = [
  { id: 1, title: 'New Media', href: '/dashboard/media/new' },
  { id: 2, title: 'Edit Media', href: '/dashboard/media/edit' },
]

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PersistentDrawer title="Media" drawerItems={drawerItems} />
      <div className="hide-scrollbar flex flex-1 flex-col">
        <AppBar />
        {children}
      </div>
    </>
  )
}
