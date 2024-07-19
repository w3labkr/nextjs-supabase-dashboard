'use client'

import * as React from 'react'
import { type Tag } from '@/types/database'

interface TagFormContextProps {
  tag: Tag | null
  [key: string]: any
}

const TagFormContext = React.createContext<TagFormContextProps | undefined>({
  tag: null,
})

const TagFormProvider = ({
  children,
  value,
}: {
  children?: React.ReactNode
  value: TagFormContextProps
}) => {
  const memoValue = React.useMemo(() => value, [value])

  return (
    <TagFormContext.Provider value={memoValue}>
      {children}
    </TagFormContext.Provider>
  )
}

const useTagForm = () => {
  const context = React.useContext<TagFormContextProps | undefined>(
    TagFormContext
  )

  if (context === undefined) {
    throw new Error('useTagForm must be used within TagFormProvider')
  }

  return context
}

export { TagFormProvider, useTagForm }
