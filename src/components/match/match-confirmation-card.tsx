"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Match } from "@/types/database"
import { SuccessMessage } from "@/components/ui/success-state"
import { ErrorMessage } from "@/components/ui/error-state"
import { LoadingState } from "@/components/ui/loading-state"
import { parseDatabaseDate } from "@/lib/utils"

interface MatchConfirmationCardProps {
  match: Match
  onConfirmed: () => void
}

export function MatchConfirmationCard({ match, onConfirmed }: MatchConfirmationCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showDisputeForm, setShowDisputeForm] = useState(false)
  const [disputeReason, setDisputeReason] = useState("")
  const [disputedScore1, setDisputedScore1] = useState<string>("")
  const [disputedScore2, setDisputedScore2] = useState<string>("")

  // Get the name of the player who reported (the opponent from current player's perspective)
  const reporterName = match.reported_by === match.player1_id
    ? match.player1_name || "Opponent"
    : match.player2_name || "Opponent"

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/matches/${match.id}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "confirmed",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm match")
      }

      setSuccess(data.message || "Match confirmed successfully!")
      // Trigger events for navigation and leaderboard refresh
      window.dispatchEvent(new Event('match:confirmed'))
      // Dispatch leaderboard refresh event immediately so ratings update instantly
      window.dispatchEvent(new CustomEvent('leaderboard:refresh', { detail: { immediate: true } }))
      setTimeout(() => {
        onConfirmed()
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to confirm match")
    } finally {
      setLoading(false)
    }
  }

  const handleDispute = async () => {
    if (!disputeReason.trim()) {
      setError("Please provide a reason for disputing this match")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const body: any = {
        action: "disputed",
        dispute_reason: disputeReason,
      }

      // If player provided corrected scores, include them
      if (disputedScore1 && disputedScore2) {
        const score1 = parseInt(disputedScore1)
        const score2 = parseInt(disputedScore2)
        if (!isNaN(score1) && !isNaN(score2) && score1 >= 0 && score2 >= 0) {
          body.confirmed_score1 = score1
          body.confirmed_score2 = score2
        }
      }

      const response = await fetch(`/api/matches/${match.id}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to dispute match")
      }

      setSuccess(data.message || "Match disputed. An admin will review.")
      setTimeout(() => {
        onConfirmed()
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to dispute match")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">
          Match Confirmation Required
        </CardTitle>
        <CardDescription className="text-gray-400">
          {reporterName} reported a match result. Please confirm or dispute the scores.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        )}

        {success && (
          <SuccessMessage message={success} onDismiss={() => setSuccess(null)} />
        )}

        {/* Match Details */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Player 1</div>
              <div className="text-white font-medium">{match.player1_name || "Player 1"}</div>
              <div className="text-2xl font-bold text-blue-400 mt-2">{match.player1_score}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Player 2</div>
              <div className="text-white font-medium">{match.player2_name || "Player 2"}</div>
              <div className="text-2xl font-bold text-blue-400 mt-2">{match.player2_score}</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            League: <span className="text-white">{match.league_name || "Unknown"}</span>
          </div>
          {match.played_at && (
            <div className="text-sm text-gray-400 mt-1">
              Played: <span className="text-white">{parseDatabaseDate(match.played_at).toLocaleString()}</span>
            </div>
          )}
        </div>

        {!showDisputeForm ? (
          <div className="flex gap-3 md:gap-3">
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white"
            >
              {loading ? "Processing..." : "Confirm Match"}
            </Button>
            <Button
              onClick={() => setShowDisputeForm(true)}
              disabled={loading}
              variant="outline"
              className="flex-1 border-red-600 text-red-400 hover:bg-red-900 hover:text-red-300 active:bg-red-800"
            >
              Dispute Match
            </Button>
          </div>
        ) : (
          <div className="space-y-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div>
              <label className="block text-base font-medium text-gray-300 mb-2">
                Reason for Dispute *
              </label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                inputMode="text"
                enterKeyHint="next"
                placeholder="Explain why you're disputing these scores..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    // Ctrl+Enter submits on desktop
                    e.preventDefault()
                    if (!loading && disputeReason.trim()) {
                      handleDispute()
                    }
                  }
                }}
                className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">
                  Correct Score for {match.player1_name || "Player 1"} (Optional)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  enterKeyHint="next"
                  min="0"
                  value={disputedScore1}
                  onChange={(e) => setDisputedScore1(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const nextInput = e.currentTarget.parentElement?.parentElement?.querySelector<HTMLInputElement>('input[type="number"]:last-of-type')
                      nextInput?.focus()
                    }
                  }}
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={match.player1_score.toString()}
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">
                  Correct Score for {match.player2_name || "Player 2"} (Optional)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  enterKeyHint="done"
                  min="0"
                  value={disputedScore2}
                  onChange={(e) => setDisputedScore2(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading && disputeReason.trim()) {
                      e.preventDefault()
                      handleDispute()
                    }
                  }}
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={match.player2_score.toString()}
                />
              </div>
            </div>
            <div className="flex gap-4 md:gap-3">
              <Button
                onClick={handleDispute}
                disabled={loading || !disputeReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white"
              >
                {loading ? "Processing..." : "Submit Dispute"}
              </Button>
              <Button
                onClick={() => {
                  setShowDisputeForm(false)
                  setDisputeReason("")
                  setDisputedScore1("")
                  setDisputedScore2("")
                }}
                disabled={loading}
                variant="outline"
                className="flex-1 active:bg-gray-200"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
