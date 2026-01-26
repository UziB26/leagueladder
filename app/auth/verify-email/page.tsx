"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-verified'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setStatus('error')
      setMessage('Verification token is missing')
      return
    }

    // Verify email
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json()
        
        if (res.ok) {
          if (data.alreadyVerified) {
            setStatus('already-verified')
            setMessage('Your email is already verified!')
          } else {
            setStatus('success')
            setMessage('Email verified successfully!')
            // Refresh session to update email_verified status
            setTimeout(() => {
              router.refresh()
            }, 1000)
          }
        } else {
          setStatus('error')
          setMessage(data.error || 'Failed to verify email')
        }
      })
      .catch((error) => {
        console.error('Error verifying email:', error)
        setStatus('error')
        setMessage('An error occurred while verifying your email')
      })
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-blue-500">
            Email Verification
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {status === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-700 dark:text-gray-300">Verifying your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Email Verified!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <Button
                onClick={() => {
                  router.push('/dashboard')
                  router.refresh()
                }}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          )}

          {status === 'already-verified' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Already Verified</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <Button
                onClick={() => {
                  router.push('/dashboard')
                  router.refresh()
                }}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Verification Failed</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/auth/login')}
                  className="w-full"
                >
                  Go to Login
                </Button>
                <Link href="/auth/register" className="block text-center text-sm text-blue-500 hover:text-blue-400">
                  Create a new account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-blue-500">
              Email Verification
            </h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-700 dark:text-gray-300">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
