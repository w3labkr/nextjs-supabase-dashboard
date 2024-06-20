'use client'

import * as React from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from '@/lib/redux/store'

const PersistProvider = ({ children }: { children?: React.ReactNode }) => {
  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  )
}

export { PersistProvider }
