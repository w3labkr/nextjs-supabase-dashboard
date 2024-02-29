import * as React from 'react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <React.Fragment>{children}</React.Fragment>
}
