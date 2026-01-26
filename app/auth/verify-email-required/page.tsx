"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailRequiredPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const user = session?.user as { email_verified?: boolean; email?: string } | undefined

  useEffect(() => {
    // If not logged in, redirect to login
    if (!session) {
      router.push('/auth/login')
      return
    }

    // If email is verified, redirect to dashboard
    if (user?.email_verified) {
      router.push('/dashboard')
      return
    }
  }, [session, user, router])

  const handleResend = async () => {
    setIsSending(true)
    setSendStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setSendStatus('success')
        setMessage('Verification email sent! Please check your inbox.')
        setTimeout(() => setSendStatus('idle'), 5000)
      } else {
        setSendStatus('error')
        // Show detailed error message if available
        const errorMsg = data.message || data.error || 'Failed to send verification email. Please try again.'
        const details = data.details ? ` (${JSON.stringify(data.details)})` : ''
        setMessage(errorMsg + details)
        console.error('[Verify Email Required] Error response:', data)
        setTimeout(() => setSendStatus('idle'), 10000) // Show error longer
      }
    } catch (error) {
      console.error('Error sending verification email:', error)
      setSendStatus('error')
      setMessage('An error occurred. Please try again later.')
      setTimeout(() => setSendStatus('idle'), 5000)
    } finally {
      setIsSending(false)
    }
  }

  if (!session || user?.email_verified) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-blue-500">
            Email Verification Required
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 mb-4">
              <svg className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Please Verify Your Email
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to verify your email address before you can use League Ladder.
            </p>
            {user?.email && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                We sent a verification email to <strong className="text-gray-700 dark:text-gray-300">{user.email}</strong>
              </p>
            )}

            {message && (
              <div className={`mb-6 p-3 rounded ${
                sendStatus === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-4">
              <Button
                onClick={handleResend}
                disabled={isSending}
                className="w-full"
              >
                {isSending ? 'Sending...' : 'Resend Verification Email'}
              </Button>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Can't find the email? Check your spam folder.</p>
                <p className="mt-2">
                  After verifying, you'll be able to access all features.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  href="/auth/login" 
                  className="text-sm text-blue-500 hover:text-blue-400"
                >
                  Sign in with a different account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
