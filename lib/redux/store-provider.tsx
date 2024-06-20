'use client'

import * as React from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/lib/redux/store'

const StoreProvider = ({ children }: { children?: React.ReactNode }) => {
  const storeRef = React.useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}

export { StoreProvider }
