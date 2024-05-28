import * as React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/types/database'
import { LucideIcon } from '@/lib/lucide-icon'

const Aside = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-col gap-2">
      <Avatar className="size-12 min-w-12">
        <AvatarImage
          src={user?.avatar_url ?? undefined}
          alt={`@${user?.username}`}
        />
        <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-4xl font-semibold leading-none tracking-tight">
          {user?.full_name}
        </h1>
        <p className="text-sm text-gray-600">@{user?.username}</p>
      </div>
      <div className="mt-4">
        <ul>
          {user?.email ? (
            <li className="flex items-center text-sm text-gray-600">
              <LucideIcon name="Mail" className="mr-1 size-4 min-w-4" />
              {user?.email}
            </li>
          ) : null}
        </ul>
        {user?.bio ? (
          <p className="text-sm text-gray-600">{user?.bio}</p>
        ) : null}
      </div>
    </div>
  )
}

export { Aside }
