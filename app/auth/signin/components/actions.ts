// 'use server'

// import { cookies } from 'next/headers'
// import { createClient } from '@/lib/supabase/actions'
// import { type FormTypes } from './validation'

// export async function signIn(values: FormTypes) {
//   const cookieStore = cookies()
//   const supabase = createClient(cookieStore)

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: values.email as string,
//     password: values.password as string,
//   }

//   const { error } = await supabase.auth.signInWithPassword(data)

//   if (error) {
//     console.log(error)
//   }

//   console.log('success')
// }
