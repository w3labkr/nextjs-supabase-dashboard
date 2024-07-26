import * as React from 'react'
import { Statistics } from './statistics'

export default function UsernameLayout({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <>
      {children}
      <Statistics />
    </>
  )
}
