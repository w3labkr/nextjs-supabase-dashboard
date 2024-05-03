import * as React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Profile } from '@/types/database'

const Aside = ({ profile }: { profile: Profile }) => {
  return (
    <div className="flex flex-col gap-2">
      <Avatar className="size-12 min-w-12">
        <AvatarImage
          src={profile?.avatar_url ?? undefined}
          alt={`@${profile?.username}`}
        />
        <AvatarFallback>{profile?.username?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-4xl font-semibold leading-none tracking-tight">
          {profile?.full_name}
        </h1>
        <p className="text-sm text-gray-600">@{profile?.username}</p>
      </div>
      {profile?.bio ? (
        <p className="text-sm text-gray-600">{profile?.bio}</p>
      ) : null}
    </div>
  )
}

export { Aside }
