"use client"

import { OnboardingTour, leagueLadderTourSteps } from "./onboarding-tour"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

/**
 * Get storage key for onboarding completion, user-specific
 */
function getStorageKey(userId?: string): string {
  if (userId) {
    return `league-ladder-onboarding-completed-${userId}`
  }
  return 'league-ladder-onboarding-completed'
}

/**
 * Wrapper component that shows the onboarding tour for first-time users
 * Add this to your main layout or dashboard page
 */
export function OnboardingWrapper() {
  const { data: session, status } = useSession()
  const [shouldShow, setShouldShow] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(false)

  // Set mounted flag on client only
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if user is new via API
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) {
      return
    }
    
    if (status === 'loading') {
      return
    }

    if (!session?.user?.email) {
      setShouldShow(false)
      setIsReady(false)
      return
    }

    // Check API for new user status
    const checkOnboardingStatus = async () => {
      setCheckingStatus(true)
      try {
        const response = await fetch('/api/user/onboarding-status')
        if (response.ok) {
          const data = await response.json()
          setIsNewUser(data.isNewUser)
        } else {
          // On error, default to showing onboarding (safer for new users)
          setIsNewUser(true)
        }
      } catch (error) {
        console.error('[OnboardingWrapper] Error checking onboarding status:', error)
        // On error, default to showing onboarding (safer for new users)
        setIsNewUser(true)
      } finally {
        setCheckingStatus(false)
      }
    }

    checkOnboardingStatus()
  }, [mounted, session, status])

  // Check localStorage and determine if tour should show
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) {
      return
    }
    
    if (status === 'loading' || checkingStatus) {
      return
    }

    if (!session?.user) {
      setShouldShow(false)
      setIsReady(false)
      return
    }

    // Get user-specific storage key
    const userId = (session.user as any)?.id || session.user.email
    const storageKey = getStorageKey(userId)
    
    // PRIORITY 1: Check if tour was already completed in localStorage
    // If completed, never show it again (this is the most important check)
    const hasCompleted = localStorage.getItem(storageKey) === 'true'
    
    if (hasCompleted) {
      setShouldShow(false)
      setIsReady(false)
      return
    }

    // PRIORITY 2: If not completed in localStorage, check API to see if user is new
    // Only show tour if user is new AND hasn't completed it
    if (isNewUser === null) {
      // Still waiting for API response
      return
    }

    if (isNewUser) {
      setShouldShow(true)
      
      // Delay to ensure DOM is ready and navigation is rendered
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 2000) // Reduced delay for better UX
      
      return () => {
        clearTimeout(timer)
      }
    } else {
      // User is not new, don't show tour
      setShouldShow(false)
      setIsReady(false)
    }
  }, [mounted, session, status, isNewUser, checkingStatus])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

  // Show tour if conditions are met
  if (!shouldShow || !isReady || checkingStatus) {
    return null
  }

  // Get user-specific storage key for the tour component
  const userId = (session?.user as any)?.id || session?.user?.email
  const storageKey = getStorageKey(userId)
  
  return (
    <OnboardingTour
      steps={leagueLadderTourSteps}
      storageKey={storageKey}
      onComplete={() => {
        setShouldShow(false)
      }}
      onSkip={() => {
        setShouldShow(false)
      }}
    />
  )
}
