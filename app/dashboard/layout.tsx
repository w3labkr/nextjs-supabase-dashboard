import * as React from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const cookieStore = cookies()
  // const supabase = createClient(cookieStore)
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // console.log(user)

  return <React.Fragment>{children}</React.Fragment>
}
