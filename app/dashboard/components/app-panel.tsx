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
import { setPanelSizes, setPanelCollapsed } from '@/store/features/app-slice'

const AppPanel = ({ children }: { children?: React.ReactNode }) => {
  const dispatch = useAppDispatch()
  const { panelSizes, panelCollapsed } = useAppSelector(({ app }) => app)

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen"
      onLayout={(sizes: number[]) => dispatch(setPanelSizes(sizes))}
    >
      <ResizablePanel
        className={cn(
          'max-w-[250px] !overflow-auto',
          panelCollapsed ? 'min-w-[50px]' : 'min-w-[150px]'
        )}
        defaultSize={Array.isArray(panelSizes) ? panelSizes[0] : 25}
        minSize={10}
        maxSize={25}
        collapsible={true}
        onCollapse={() => dispatch(setPanelCollapsed(true))}
        onExpand={() => dispatch(setPanelCollapsed(false))}
      >
        <Navigation />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={Array.isArray(panelSizes) ? panelSizes[1] : 75}
        minSize={75}
        className="!overflow-auto"
      >
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export { AppPanel }
