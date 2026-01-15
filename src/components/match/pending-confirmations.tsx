"use client"

import { useState, useEffect } from "react"
import { MatchConfirmationCard } from "./match-confirmation-card"
import { LoadingState } from "@/components/ui/loading-state"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Match } from "@/types/database"

export function PendingConfirmations() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPendingConfirmations = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/matches/pending-confirmations")
      if (!response.ok) {
        throw new Error("Failed to fetch pending confirmations")
      }
      const data = await response.json()
      setMatches(data.matches || [])
    } catch (err: any) {
      setError(err.message || "Failed to load pending confirmations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingConfirmations()
  }, [])

  if (loading) {
    return <LoadingState text="Loading pending confirmations..." />
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load confirmations"
        message={error}
        onRetry={fetchPendingConfirmations}
      />
    )
  }

  if (matches.length === 0) {
    return (
      <EmptyState
        title="No pending confirmations"
        description="You don't have any matches waiting for your confirmation."
        icon={
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Pending Confirmations</h2>
        <p className="text-gray-400">
          You have {matches.length} match{matches.length !== 1 ? "es" : ""} waiting for your confirmation.
        </p>
      </div>
      {matches.map((match) => (
        <MatchConfirmationCard
          key={match.id}
          match={match}
          onConfirmed={fetchPendingConfirmations}
        />
      ))}
    </div>
  )
}
