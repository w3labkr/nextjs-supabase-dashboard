import * as React from 'react'

import { AppBar } from '@/components/dashboard/app-bar'
import {
  PersistentDrawer,
  drawerItemProps,
} from '@/components/dashboard/persistent-drawer'

const drawerItems: drawerItemProps[] = [
  { id: 1, title: 'Profile', href: '/dashboard/settings/profile' },
  { id: 2, title: 'Account', href: '/dashboard/settings/account' },
  { id: 3, title: 'Appearance', href: '/dashboard/settings/appearance' },
  { id: 4, title: 'Notifications', href: '/dashboard/settings/notifications' },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PersistentDrawer title="Settings" drawerItems={drawerItems} />
      <div className="hide-scrollbar flex flex-1 flex-col">
        <AppBar />
        {children}
      </div>
    </>
  )
}
