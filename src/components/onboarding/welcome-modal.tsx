"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface WelcomeModalProps {
  storageKey?: string
  onClose?: () => void
  userName?: string
}

export function WelcomeModal({
  storageKey = 'league-ladder-welcome-shown',
  onClose,
  userName,
}: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if welcome modal has been shown before
    const hasBeenShown = localStorage.getItem(storageKey) === 'true'
    if (!hasBeenShown) {
      // Small delay to ensure smooth appearance
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [storageKey])

  const handleClose = () => {
    localStorage.setItem(storageKey, 'true')
    setIsOpen(false)
    if (onClose) onClose()
  }

  const handleGetStarted = () => {
    handleClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
      >
        <div
          className="bg-black border border-gray-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  id="welcome-modal-title"
                  className="text-2xl md:text-3xl font-bold mb-1"
                >
                  Welcome{userName ? `, ${userName}` : ''}! 🎉
                </h2>
                <p className="text-blue-100 text-base md:text-sm">
                  Let's get you started with League Ladder
                </p>
              </div>
              <button
                onClick={handleClose}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:bg-white/20 rounded-md transition-colors active:bg-white/30"
                aria-label="Close welcome modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="space-y-8">
              {/* Step 1: Join Leagues */}
              <div className="flex gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-900 rounded-full flex items-center justify-center border border-blue-700">
                    <span className="text-2xl md:text-3xl font-bold text-blue-400">1</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-lg font-bold text-white mb-2">
                    Join a League
                  </h3>
                  <p className="text-base md:text-sm text-gray-300 mb-4 leading-relaxed">
                    Start by joining either the <strong>Table Tennis</strong> or <strong>FIFA</strong> league (or both!). 
                    Each league has its own separate Elo rating system.
                  </p>
                  <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                    <p className="text-sm text-blue-300 font-medium">
                      💡 Tip: Go to the Dashboard to join leagues and see your current memberships.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Challenge Players */}
              <div className="flex gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-green-900 rounded-full flex items-center justify-center border border-green-700">
                    <span className="text-2xl md:text-3xl font-bold text-green-400">2</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-lg font-bold text-white mb-2">
                    Challenge Players
                  </h3>
                  <p className="text-base md:text-sm text-gray-300 mb-4 leading-relaxed">
                    Once you're in a league, challenge other players to matches. They'll receive a notification 
                    and can accept or decline your challenge.
                  </p>
                  <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                    <p className="text-sm text-green-300 font-medium">
                      💡 Tip: Visit the Challenges page to create new challenges and manage incoming requests.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Report Matches */}
              <div className="flex gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-900 rounded-full flex items-center justify-center border border-purple-700">
                    <span className="text-2xl md:text-3xl font-bold text-purple-400">3</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-lg font-bold text-white mb-2">
                    Report Match Results
                  </h3>
                  <p className="text-base md:text-sm text-gray-300 mb-4 leading-relaxed">
                    After playing a match, report the scores. Your opponent will confirm the result, 
                    and your Elo ratings will update automatically!
                  </p>
                  <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
                    <p className="text-sm text-purple-300 font-medium">
                      💡 Tip: Check the Matches page to report results and view your match history.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="pt-6 border-t border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Quick Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href="/dashboard"
                    className="flex items-center justify-center px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium text-base transition-colors active:bg-gray-600 min-h-[44px] border border-gray-700"
                    onClick={handleClose}
                  >
                    Dashboard
                  </a>
                  <a
                    href="/challenges"
                    className="flex items-center justify-center px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium text-base transition-colors active:bg-gray-600 min-h-[44px] border border-gray-700"
                    onClick={handleClose}
                  >
                    Challenges
                  </a>
                  <a
                    href="/leaderboard"
                    className="flex items-center justify-center px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium text-base transition-colors active:bg-gray-600 min-h-[44px] border border-gray-700"
                    onClick={handleClose}
                  >
                    Leaderboard
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-6 rounded-b-lg">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 min-h-[44px] md:min-h-0 order-2 sm:order-1"
              >
                Maybe Later
              </Button>
              <Button
                onClick={handleGetStarted}
                className="flex-1 min-h-[44px] md:min-h-0 order-1 sm:order-2"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Hook to check if welcome modal should be shown
export function useWelcomeModal(storageKey: string = 'league-ladder-welcome-shown') {
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    const hasBeenShown = localStorage.getItem(storageKey) === 'true'
    setShouldShow(!hasBeenShown)
  }, [storageKey])

  const markAsShown = () => {
    localStorage.setItem(storageKey, 'true')
    setShouldShow(false)
  }

  return { shouldShow, markAsShown }
}

/**
 * Wrapper component that shows the welcome modal for first-time logged-in users
 * Add this to your main layout or dashboard page
 */
export function WelcomeModalWrapper() {
  const { data: session } = useSession()
  const { shouldShow } = useWelcomeModal()

  if (!session || !shouldShow) {
    return null
  }

  return (
    <WelcomeModal
      userName={session.user?.name || undefined}
      onClose={() => {
        console.log('Welcome modal closed')
      }}
    />
  )
}
