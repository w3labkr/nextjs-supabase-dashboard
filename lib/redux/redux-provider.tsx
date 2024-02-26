'use client'

import * as React from 'react'
import { StoreProvider } from '@/lib/redux/store-provider'
import { PersistProvider } from '@/lib/redux/persist-provider'

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <PersistProvider>{children}</PersistProvider>
    </StoreProvider>
  )
}
