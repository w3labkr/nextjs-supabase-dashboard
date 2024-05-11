import { getUser } from '@/queries/server/users'

export async function authenticate() {
  const { user } = await getUser()

  if (!user) return { authenticated: false, user: null }

  return { authenticated: true, user }
}

export async function authorize(id: string) {
  const { user, role, plan } = await getUser()

  if (!user) return { user: null, role: null, plan: null }

  return user?.id === id
    ? { user, role, plan }
    : { user: null, role: null, plan: null }
}
