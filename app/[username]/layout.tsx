import * as React from 'react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default async function ProfileLayout({
  children,
  params: { username },
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
