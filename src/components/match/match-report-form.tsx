"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Challenge } from "@/types/database"
import { formatDistanceToNow } from "date-fns"

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
      const response = await fetch('/api/challenges')
      
      if (!response.ok) {
        throw new Error('Failed to fetch challenges')
      }
      
      const data = await response.json()
      // Filter for accepted challenges where current player is involved
      const accepted = (data.challenges || []).filter((c: Challenge) => 
        c.status === 'accepted' && 
        (c.challenger_id === currentPlayerId || c.challengee_id === currentPlayerId)
      )
      setAcceptedChallenges(accepted)
    } catch (error: any) {
      console.error('Error fetching accepted challenges:', error)
      setError('Failed to load accepted challenges')
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
      setError('Scores must be non-negative')
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
          player2Score,
          status: 'completed'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to report match')
      }

      setSuccess('Match reported successfully! Ratings will be updated.')
      
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
      setError(error.message || 'Failed to report match. Please try again.')
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">Report Match Results</h3>
        <div className="text-center py-8 text-gray-500">Loading accepted challenges...</div>
      </div>
    )
  }

  if (acceptedChallenges.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">Report Match Results</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No accepted challenges to report.</p>
          <p className="text-sm mt-2">Accept a challenge first, then report the match results here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-blue-600">Report Match Results</h3>
      <p className="text-sm text-gray-600 mb-6">
        Enter the final scores for your accepted challenges. Ratings will be updated automatically.
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
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
            <div key={challenge.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">
                    {challenge.league_name || 'League'}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(challenge.created_at), { addSuffix: true })}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {player1} vs {player2}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {player1} Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={player1ScoreValue}
                    onChange={(e) => handleScoreChange(challenge.id, 'player1Score', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {player2} Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={player2ScoreValue}
                    onChange={(e) => handleScoreChange(challenge.id, 'player2Score', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
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
                {isSubmitting ? 'Reporting Match...' : 'Report Match Result'}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
