import { i18nKey } from '@/utils/string'
import { createBrowserClient } from '@supabase/ssr'

// To access Supabase from Client Components, which run in the browser.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function changeUserPassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string
  newPassword: string
}) {
  let response = await verifyUserPassword(oldPassword)

  if (response?.error) return response

  response = await updateUserPassword(newPassword)

  return response
}

export async function verifyUserPassword(password: string) {
  const supabase = createClient()
  let { data, error } = await supabase.rpc('verify_user_password', {
    password,
  })

  if (data === false) {
    error = { ...error, message: 'invalid_old_password' }
  }

  return { data, error }
}

export async function updateUserPassword(password: string) {
  const supabase = createClient()
  let { data, error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    const message: string = i18nKey(error?.message)
    switch (message) {
      case 'new_password_should_be_different_from_the_old_password':
        error = { ...error, message }
        break
    }
  }

  return { data, error }
}

export async function deleteAccount({
  email,
  password,
}: {
  email: string
  password: string
}) {
  let response = verifyUserEmailAndPassword(email, password)

  if (response?.error) return response

  response = await deleteUser()

  return response
}

export async function verifyUserEmailAndPassword(
  email: string,
  password: string
) {
  const supabase = createClient()
  let { data, error } = await supabase.rpc('verify_user_email_and_password', {
    user_email: email,
    user_password: password,
  })

  if (!data) {
    error = { ...error, message: 'invalid_account_information' }
  }

  return { data, error }
}

export async function deleteUser() {
  const supabase = createClient()
  const response = await supabase.rpc('delete_user')

  return response
}
