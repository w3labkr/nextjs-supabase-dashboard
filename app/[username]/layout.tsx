import * as React from 'react'

export default function ProfileLayout({
  children,
  params: { username },
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  return <>{children}</>
}
