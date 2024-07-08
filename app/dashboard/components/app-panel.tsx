'use client'

import * as React from 'react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Navigation } from '@/app/dashboard/components/navigation'

import { cn } from '@/lib/utils'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setAppLayout, setAppCollapsed } from '@/store/reducers/app-reducer'

const AppPanel = ({ children }: { children?: React.ReactNode }) => {
  const dispatch = useAppDispatch()
  const { layout, collapsed } = useAppSelector(({ app }) => app)

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen"
      onLayout={(sizes: number[]) => dispatch(setAppLayout(sizes))}
    >
      <ResizablePanel
        className={cn(
          'max-w-[300px] !overflow-auto',
          collapsed ? 'min-w-[50px]' : 'min-w-[200px]'
        )}
        defaultSize={Array.isArray(layout) ? layout[0] : 25}
        minSize={10}
        maxSize={25}
        collapsible={true}
        onCollapse={() => dispatch(setAppCollapsed(true))}
        onExpand={() => dispatch(setAppCollapsed(false))}
      >
        <Navigation />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={Array.isArray(layout) ? layout[1] : 75}
        minSize={75}
        className="!overflow-auto"
      >
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export { AppPanel }
