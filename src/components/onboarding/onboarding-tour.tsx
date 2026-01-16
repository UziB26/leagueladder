"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

interface TourStep {
  id: string
  title: string
  description: string
  targetSelector: string
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

interface OnboardingTourProps {
  steps: TourStep[]
  storageKey?: string
  onComplete?: () => void
  onSkip?: () => void
}

export function OnboardingTour({
  steps,
  storageKey = 'league-ladder-onboarding-completed',
  onComplete,
  onSkip,
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Check if user has already completed the tour
    const hasCompleted = localStorage.getItem(storageKey) === 'true'
    if (!hasCompleted) {
      setIsVisible(true)
      updateTooltipPosition()
    }
  }, [storageKey])

  useEffect(() => {
    if (isVisible && currentStep < steps.length) {
      updateTooltipPosition()
      // Add resize and scroll listeners to update position
      const handleUpdate = () => updateTooltipPosition()
      window.addEventListener('resize', handleUpdate)
      window.addEventListener('scroll', handleUpdate, true)
      
      return () => {
        window.removeEventListener('resize', handleUpdate)
        window.removeEventListener('scroll', handleUpdate, true)
      }
    }
  }, [isVisible, currentStep, steps])

  const updateTooltipPosition = () => {
    if (currentStep >= steps.length) return

    const step = steps[currentStep]
    const element = document.querySelector(step.targetSelector) as HTMLElement

    if (!element) {
      // If element not found, center the tooltip
      setTargetElement(null)
      setTooltipPosition({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      })
      return
    }

    setTargetElement(element)
    const rect = element.getBoundingClientRect()
    const position = step.position || 'bottom'

    let top = 0
    let left = 0

    switch (position) {
      case 'top':
        top = rect.top - 20
        left = rect.left + rect.width / 2
        break
      case 'bottom':
        top = rect.bottom + 20
        left = rect.left + rect.width / 2
        break
      case 'left':
        top = rect.top + rect.height / 2
        left = rect.left - 20
        break
      case 'right':
        top = rect.top + rect.height / 2
        left = rect.right + 20
        break
      case 'center':
        top = rect.top + rect.height / 2
        left = rect.left + rect.width / 2
        break
    }

    // Adjust for mobile - ensure tooltip is visible
    const tooltipWidth = window.innerWidth < 768 ? window.innerWidth * 0.9 : 384 // max-w-sm = 384px
    const tooltipHeight = 250 // Approximate tooltip height
    const padding = 16

    // Center horizontally on mobile
    if (window.innerWidth < 768) {
      left = window.innerWidth / 2
      // Position above or below element on mobile
      if (position === 'bottom' && top + tooltipHeight > window.innerHeight - padding) {
        top = Math.max(padding, rect.top - tooltipHeight - 20)
      }
      // If element is in top navigation, show tooltip below it
      if (rect.top < 100) {
        top = rect.bottom + 20
      }
    } else {
      // Ensure tooltip doesn't go off screen on desktop
      if (left < padding + tooltipWidth / 2) {
        left = padding + tooltipWidth / 2
      }
      if (left + tooltipWidth / 2 > window.innerWidth - padding) {
        left = window.innerWidth - padding - tooltipWidth / 2
      }
    }

    // Ensure tooltip doesn't go off screen vertically
    if (top < padding) {
      top = padding
    }
    if (top + tooltipHeight > window.innerHeight - padding) {
      top = Math.max(padding, window.innerHeight - tooltipHeight - padding)
    }

    setTooltipPosition({ top, left })
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem(storageKey, 'true')
    setIsVisible(false)
    if (onSkip) onSkip()
  }

  const handleComplete = () => {
    localStorage.setItem(storageKey, 'true')
    setIsVisible(false)
    if (onComplete) onComplete()
  }

  if (!isVisible || currentStep >= steps.length) {
    return null
  }

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <>
      {/* Overlay with highlight */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] bg-black/60 transition-opacity"
        onClick={(e) => {
          // Prevent closing on overlay click - require explicit skip/next
          e.stopPropagation()
        }}
      >
        {/* Highlight cutout for target element */}
        {targetElement && (() => {
          const rect = targetElement.getBoundingClientRect()
          return (
            <div
              className="absolute border-4 border-blue-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none transition-all"
              style={{
                top: `${rect.top - 4}px`,
                left: `${rect.left - 4}px`,
                width: `${rect.width + 8}px`,
                height: `${rect.height + 8}px`,
              }}
            />
          )
        })()}
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[9999] w-[90vw] max-w-sm md:max-w-md bg-white rounded-lg shadow-2xl p-6 transition-all"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          transform: 'translate(-50%, 0)',
        }}
      >
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Skip tour"
            >
              Skip tour
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-xl md:text-lg font-bold text-gray-900 mb-2">
            {step.title}
          </h3>
          <p className="text-base md:text-sm text-gray-600 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3 md:gap-2">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1 min-h-[44px] md:min-h-0"
            >
              Previous
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 min-h-[44px] md:min-h-0"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </>
  )
}

// Predefined tour steps for League Ladder
export const leagueLadderTourSteps: TourStep[] = [
  {
    id: 'leaderboard',
    title: 'View the Leaderboard',
    description: 'See where you rank against other players. Your Elo rating determines your position on the leaderboard.',
    targetSelector: 'a[href="/leaderboard"], nav a[href*="leaderboard"]',
    position: 'bottom',
  },
  {
    id: 'challenges',
    title: 'Challenge Players',
    description: 'Challenge other players in your league to matches. Once accepted, you can report match results.',
    targetSelector: 'a[href="/challenges"], nav a[href*="challenges"]',
    position: 'bottom',
  },
  {
    id: 'matches',
    title: 'Report Matches',
    description: 'After playing a match, report the scores here. Your opponent will confirm, and ratings will update automatically.',
    targetSelector: 'a[href="/matches"], nav a[href*="matches"]',
    position: 'bottom',
  },
]

// Hook to check if onboarding should be shown
export function useOnboardingTour(storageKey: string = 'league-ladder-onboarding-completed') {
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    const hasCompleted = localStorage.getItem(storageKey) === 'true'
    setShouldShow(!hasCompleted)
  }, [storageKey])

  const markAsCompleted = () => {
    localStorage.setItem(storageKey, 'true')
    setShouldShow(false)
  }

  return { shouldShow, markAsCompleted }
}
