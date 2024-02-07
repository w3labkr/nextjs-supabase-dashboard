import * as React from 'react'

import { AppBar } from '@/components/dashboard/app-bar'
import {
  PersistentDrawer,
  drawerItemProps,
} from '@/components/dashboard/persistent-drawer'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

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
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25} className="max-w-64 !overflow-auto">
        <PersistentDrawer
          title="Posts"
          drawerItems={drawerItems}
          className="w-full border-none lg:max-w-full"
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75} className="relative !overflow-auto">
        <AppBar className="sticky left-0 top-0 z-10" />
        <div className="flex flex-1 flex-col">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
