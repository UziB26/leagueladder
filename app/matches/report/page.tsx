"use client"

import { useState, useEffect } from "react"
import { MatchReportForm } from "@/components/match/match-report-form"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorState } from "@/components/ui/error-state"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ReportMatchPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    // Check if email is verified
    const user = session.user as { email_verified?: boolean; email?: string } | undefined
    if (user && !user.email_verified) {
      router.push('/auth/verify-email-required')
      return
    }

    fetchCurrentPlayer()
  }, [session, router])

  const fetchCurrentPlayer = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/players/me')
      if (!response.ok) {
        throw new Error('Failed to fetch player information')
      }
      const data = await response.json()
      if (!data.player?.id) {
        throw new Error('Player profile not found')
      }
      setCurrentPlayerId(data.player.id)
    } catch (error: any) {
      console.error('Error fetching current player:', error)
      setError(error.message || 'Failed to load player information. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleMatchReported = () => {
    // Redirect to matches page to see the updated history
    router.push('/matches')
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState text="Loading match report form..." fullScreen />
      </div>
    )
  }

  if (error && !currentPlayerId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Failed to load match report"
          message={error}
          onRetry={fetchCurrentPlayer}
          fullScreen
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Report Match</h1>
        <p className="text-gray-300 font-medium mt-2">
          Enter the final scores for your accepted challenges. Ratings will be updated automatically.
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorState
            title="Error"
            message={error}
            onRetry={fetchCurrentPlayer}
          />
        </div>
      )}

      <div className="max-w-4xl">
        {currentPlayerId ? (
          <MatchReportForm 
            currentPlayerId={currentPlayerId}
            onSuccess={handleMatchReported}
          />
        ) : (
          <LoadingState text="Loading player information..." />
        )}
      </div>
    </div>
  )
}
