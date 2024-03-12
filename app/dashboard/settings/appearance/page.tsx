import * as React from 'react'

import { ChangeThemeForm } from './change-theme-form'
import { ChangeLanguageForm } from './change-language-form'

// import { authenticate } from '@/lib/supabase/auth'

export default async function AppearancePage() {
  // const { authenticated, user } = await authenticate()

  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <ChangeThemeForm />
        <ChangeLanguageForm />
      </div>
    </main>
  )
}
