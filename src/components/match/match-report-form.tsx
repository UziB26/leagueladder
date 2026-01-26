"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LoadingState, Spinner } from "@/components/ui/loading-state"
import { Challenge } from "@/types/database"
import { formatDistanceToNow } from "date-fns"
import { parseDatabaseDate } from "@/lib/utils"

interface MatchReportFormProps {
  currentPlayerId: string
  onSuccess?: () => void
}

interface AcceptedChallenge extends Challenge {
  challenger_name?: string
  challengee_name?: string
  league_name?: string
}

export function MatchReportForm({ currentPlayerId, onSuccess }: MatchReportFormProps) {
  const [acceptedChallenges, setAcceptedChallenges] = useState<AcceptedChallenge[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [scores, setScores] = useState<Record<string, { player1Score: string; player2Score: string }>>({})

  useEffect(() => {
    fetchAcceptedChallenges()
  }, [currentPlayerId])

  const fetchAcceptedChallenges = async () => {
    if (!currentPlayerId) return
    
    try {
      setLoading(true)
      
      // Fetch both challenges and pending matches
      const [challengesResponse, pendingMatchesResponse] = await Promise.all([
        fetch('/api/challenges'),
        fetch('/api/matches/pending-confirmations')
      ])
      
      if (!challengesResponse.ok) {
        throw new Error('Failed to fetch challenges')
      }
      
      const challengesData = await challengesResponse.json()
      const pendingData = pendingMatchesResponse.ok ? await pendingMatchesResponse.json() : { matches: [] }
      
      // Get challenge IDs that have pending matches where current player needs to confirm
      // (matches where current player is NOT the reporter)
      const pendingMatchChallengeIds = new Set(
        (pendingData.matches || [])
          .filter((m: any) => 
            m.status === 'pending_confirmation' && 
            m.reported_by !== currentPlayerId &&
            m.challenge_id
          )
          .map((m: any) => m.challenge_id)
      )
      
      // Filter for accepted challenges where:
      // 1. Current player is involved
      // 2. Challenge doesn't have a pending match waiting for current player's confirmation
      const accepted = (challengesData.challenges || []).filter((c: Challenge) => {
        const isInvolved = c.status === 'accepted' && 
          (c.challenger_id === currentPlayerId || c.challengee_id === currentPlayerId)
        
        // Don't show if there's a pending match for this challenge that needs current player's confirmation
        const hasPendingMatch = pendingMatchChallengeIds.has(c.id)
        
        return isInvolved && !hasPendingMatch
      })
      
      setAcceptedChallenges(accepted)
    } catch (error: any) {
      console.error('Error fetching accepted challenges:', error)
      if (error.message?.includes('fetch')) {
        setError('Network error. Please check your connection and try again.')
      } else {
        setError('Failed to load accepted challenges. Please refresh the page.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleScoreChange = (challengeId: string, field: 'player1Score' | 'player2Score', value: string) => {
    // Only allow non-negative integers
    if (value === '' || /^\d+$/.test(value)) {
      setScores(prev => ({
        ...prev,
        [challengeId]: {
          player1Score: prev[challengeId]?.player1Score ?? '',
          player2Score: prev[challengeId]?.player2Score ?? '',
          [field]: value
        }
      }))
      setError("")
      setSuccess("")
    }
  }

  const getPlayerNames = (challenge: AcceptedChallenge) => {
    const isChallenger = challenge.challenger_id === currentPlayerId
    return {
      player1: isChallenger ? challenge.challenger_name || 'You' : challenge.challengee_name || 'You',
      player2: isChallenger ? challenge.challengee_name || 'Opponent' : challenge.challenger_name || 'Opponent',
      player1Id: isChallenger ? challenge.challenger_id : challenge.challengee_id,
      player2Id: isChallenger ? challenge.challengee_id : challenge.challenger_id
    }
  }

  const handleSubmit = async (challenge: AcceptedChallenge) => {
    const challengeScores = scores[challenge.id]
    if (!challengeScores) {
      setError('Please enter scores for both players')
      return
    }

    const player1Score = parseInt(challengeScores.player1Score)
    const player2Score = parseInt(challengeScores.player2Score)

    if (isNaN(player1Score) || isNaN(player2Score)) {
      setError('Please enter valid scores')
      return
    }

    if (player1Score < 0 || player2Score < 0) {
      setError('Scores must be positive numbers')
      return
    }

    // Validate reasonable score limits (e.g., max 1000 for most sports)
    const MAX_REASONABLE_SCORE = 1000
    if (player1Score > MAX_REASONABLE_SCORE || player2Score > MAX_REASONABLE_SCORE) {
      setError(`Scores must be reasonable numbers (max ${MAX_REASONABLE_SCORE})`)
      return
    }

    // Ensure at least one score is greater than 0 (can't both be 0)
    if (player1Score === 0 && player2Score === 0) {
      setError('At least one player must have a score greater than 0')
      return
    }

    setSubmitting(challenge.id)
    setError("")
    setSuccess("")

    try {
      const { player1Id, player2Id } = getPlayerNames(challenge)
      
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({
          challengeId: challenge.id,
          player1Id,
          player2Id,
          leagueId: challenge.league_id,
          player1Score,
          player2Score
          // Status will be set to 'pending_confirmation' automatically
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to report match')
      }

      setSuccess('Match reported successfully! Waiting for opponent confirmation. Ratings will be updated once confirmed.')
      
      // Trigger leaderboard refresh event
      window.dispatchEvent(new CustomEvent('leaderboard:refresh'))
      // Trigger match reported event for navigation badge
      window.dispatchEvent(new CustomEvent('match:reported'))
      
      // Clear scores for this challenge
      setScores(prev => {
        const newScores = { ...prev }
        delete newScores[challenge.id]
        return newScores
      })

      // Refresh challenges list
      setTimeout(() => {
        fetchAcceptedChallenges()
        if (onSuccess) {
          onSuccess()
        }
      }, 1500)

    } catch (error: any) {
      console.error('Error reporting match:', error)
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        setError('Network error. Please check your connection and try again.')
      } else {
        setError(error.message || 'Failed to report match. Please try again.')
      }
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-black p-6 rounded-lg shadow border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-blue-500">Report Match Results</h3>
        <LoadingState text="Loading accepted challenges..." />
      </div>
    )
  }

  if (acceptedChallenges.length === 0) {
    return (
      <div className="bg-black p-6 rounded-lg shadow border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-blue-500">Report Match Results</h3>
        <div className="text-center py-8 text-gray-400">
          <p className="text-white">No accepted challenges to report.</p>
          <p className="text-sm mt-2 text-gray-400">Accept a challenge first, then report the match results here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black p-6 rounded-lg shadow border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-blue-500">Report Match Results</h3>
      <p className="text-sm text-gray-400 mb-6">
        Enter the final scores for your accepted challenges. Ratings will be updated automatically.
      </p>

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {acceptedChallenges.map((challenge) => {
          const { player1, player2 } = getPlayerNames(challenge)
          const challengeScores = scores[challenge.id] || { player1Score: '', player2Score: '' }
          const isSubmitting = submitting === challenge.id
          
          // Ensure values are always strings to prevent controlled/uncontrolled input issues
          const player1ScoreValue = challengeScores.player1Score ?? ''
          const player2ScoreValue = challengeScores.player2Score ?? ''

          return (
            <div key={challenge.id} className="border rounded-lg p-4 bg-gray-900 border-gray-700">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">
                    {challenge.league_name || 'League'}
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(parseDatabaseDate(challenge.created_at), { addSuffix: true })}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  {player1} vs {player2}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-base font-medium text-white mb-2">
                    {player1} Score
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    enterKeyHint="next"
                    min="0"
                    value={player1ScoreValue}
                    onChange={(e) => handleScoreChange(challenge.id, 'player1Score', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const nextInput = e.currentTarget.parentElement?.parentElement?.querySelector<HTMLInputElement>('input[type="number"]:last-of-type')
                        nextInput?.focus()
                      }
                    }}
                    className="w-full px-4 py-3 text-base border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-white mb-2">
                    {player2} Score
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    enterKeyHint="done"
                    min="0"
                    value={player2ScoreValue}
                    onChange={(e) => handleScoreChange(challenge.id, 'player2Score', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isSubmitting && player1ScoreValue && player2ScoreValue) {
                        e.preventDefault()
                        handleSubmit(challenge)
                      }
                    }}
                    className="w-full px-4 py-3 text-base border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Button
                onClick={() => handleSubmit(challenge)}
                disabled={isSubmitting || !player1ScoreValue || !player2ScoreValue}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Reporting Match...
                  </>
                ) : (
                  'Report Match Result'
                )}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
