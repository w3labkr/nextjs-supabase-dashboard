import { redirect } from 'next/navigation'

export default async function AdminPage() {
  redirect('/dashboard/admin/users')
}
