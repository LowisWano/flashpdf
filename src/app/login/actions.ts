'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log(error)
    return { error: error.message }
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const name = formData.get('name') as string

  const { error, data: signupData } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  const user = signupData?.user
    ? signupData.user
    : (await supabase.auth.getUser()).data.user

  if (user) {
    // Save to your User table
    await prisma.user.create({
      data: {
        id: user.id, // Supabase Auth UUID
        name: name,
      },
    })
  }

  redirect('/check-email?justSignedUp=true')
}

export async function logout() {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.log(error)
    redirect('/error')
  }
  
  redirect('/')
}