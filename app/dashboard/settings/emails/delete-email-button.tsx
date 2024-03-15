'use client'

import * as React from 'react'
import { LucideIcon } from '@/lib/lucide-icon'

import { EmailListItemContext } from './email-list-item-provider'

export function DeleteEmailButton() {
  const state = React.useContext(EmailListItemContext)

  // if (!state?.isVerified) return null
  // if (!state?.isPrimary) return null

  return (
    <button
      type="button"
      className="rounded-md border p-1.5 text-red-700 hover:bg-red-700 hover:text-white"
    >
      <LucideIcon name="Trash" className="size-4 min-w-4" />
    </button>
  )
}
