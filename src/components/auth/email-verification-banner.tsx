"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function EmailVerificationBanner() {
  const { data: session, update } = useSession()
  const [isDismissed, setIsDismissed] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Check if user is authenticated and email is not verified
  const user = session?.user as { email_verified?: boolean; email?: string } | undefined
  const needsVerification = user && !user.email_verified && user.email

  if (!needsVerification || isDismissed) {
    return null
  }

  const handleResend = async () => {
    setIsSending(true)
    setSendStatus('idle')

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setSendStatus('success')
        setTimeout(() => setSendStatus('idle'), 3000)
      } else {
        setSendStatus('error')
        setTimeout(() => setSendStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Error sending verification email:', error)
      setSendStatus('error')
      setTimeout(() => setSendStatus('idle'), 3000)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Please verify your email address
          </h3>
          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            <p>
              We sent a verification email to <strong>{user.email}</strong>. 
              Please check your inbox and click the verification link to activate your account.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button
              onClick={handleResend}
              disabled={isSending}
              size="sm"
              variant="outline"
              className="text-yellow-800 border-yellow-400 hover:bg-yellow-100 dark:text-yellow-200 dark:border-yellow-600 dark:hover:bg-yellow-900/30"
            >
              {isSending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
            {sendStatus === 'success' && (
              <span className="text-sm text-green-600 dark:text-green-400">
                Email sent! Check your inbox.
              </span>
            )}
            {sendStatus === 'error' && (
              <span className="text-sm text-red-600 dark:text-red-400">
                Failed to send. Please try again.
              </span>
            )}
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => setIsDismissed(true)}
            className="inline-flex text-yellow-400 hover:text-yellow-500 dark:hover:text-yellow-300"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
