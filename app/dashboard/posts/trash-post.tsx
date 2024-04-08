'use client'

import * as React from 'react'
import Link from 'next/link'

import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'

import { Post } from '@/types/database'

export function TrashPost({ post }: { post: Post }) {
  const handleClick = async () => {
    console.log('click')
  }

  return (
    <Button
      variant="ghost"
      className="h-auto p-0 text-xs font-normal text-red-700 hover:underline"
      onClick={handleClick}
    >
      Trash
    </Button>
  )
}
