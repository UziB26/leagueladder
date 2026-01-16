"use client"

import { OnboardingTour, leagueLadderTourSteps, useOnboardingTour } from "./onboarding-tour"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

/**
 * Wrapper component that shows the onboarding tour for first-time users
 * Add this to your main layout or dashboard page
 */
export function OnboardingWrapper() {
  const { data: session } = useSession()
  const { shouldShow } = useOnboardingTour()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Wait for navigation to be ready before showing tour
    if (session) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [session])

  if (!session || !shouldShow || !isReady) {
    return null
  }

  return (
    <OnboardingTour
      steps={leagueLadderTourSteps}
      onComplete={() => {
        console.log('Onboarding tour completed')
      }}
      onSkip={() => {
        console.log('Onboarding tour skipped')
      }}
    />
  )
}
