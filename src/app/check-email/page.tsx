// In your /check-email page
'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CheckEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const justSignedUp = searchParams.get('justSignedUp')

  useEffect(() => {
    if (!justSignedUp) {
      router.replace('/login')
    }
  }, [justSignedUp, router])

  if (!justSignedUp) return null

  return (
    <div>
      <h1>Check your email</h1>
      <p>Please confirm your account by clicking the link in your email.</p>
    </div>
  )
}