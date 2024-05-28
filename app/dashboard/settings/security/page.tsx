import * as React from 'react'
import { redirect } from 'next/navigation'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { ChangePasswordForm } from './change-password-form'
import { getAuth } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'

export default async function SecurityPage() {
  const { session } = await getAuth()
  const { user } = await getUserAPI(session?.user?.id ?? null)

  if (!session) redirect('/auth/signin')
  if (!user) redirect('/auth/signin')

  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <Title text="ChangePasswordSection.title" translate="yes" />
        <Separator />
        <Description text="ChangePasswordSection.description" translate="yes" />
        <ChangePasswordForm user={user} />
      </div>
    </main>
  )
}
