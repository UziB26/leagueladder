"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow, format } from "date-fns"

interface MatchWithRatings {
  id: string
  player1_id: string
  player2_id: string
  player1_name: string
  player2_name: string
  player1_score: number
  player2_score: number
  winner_id: string | null
  league_name: string
  played_at: string
  status: string
  rating_updates?: {
    player1?: {
      old_rating: number
      new_rating: number
      change: number
    }
    player2?: {
      old_rating: number
      new_rating: number
      change: number
    }
  }
}

interface MatchHistoryProps {
  currentPlayerId: string
  limit?: number
}

export function MatchHistory({ currentPlayerId, limit = 20 }: MatchHistoryProps) {
  const [matches, setMatches] = useState<MatchWithRatings[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (currentPlayerId) {
      fetchMatchHistory()
    }
  }, [currentPlayerId])

  const fetchMatchHistory = async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await fetch(`/api/matches/history?limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch match history')
      }
      
      const data = await response.json()
      setMatches(data.matches || [])
    } catch (error: any) {
      console.error('Error fetching match history:', error)
      setError('Failed to load match history')
    } finally {
      setLoading(false)
    }
  }

  const getPlayerRole = (match: MatchWithRatings) => {
    if (match.player1_id === currentPlayerId) {
      return { isPlayer1: true, opponentName: match.player2_name }
    } else {
      return { isPlayer1: false, opponentName: match.player1_name }
    }
  }

  const getPlayerScore = (match: MatchWithRatings) => {
    const { isPlayer1 } = getPlayerRole(match)
    return isPlayer1 ? match.player1_score : match.player2_score
  }

  const getOpponentScore = (match: MatchWithRatings) => {
    const { isPlayer1 } = getPlayerRole(match)
    return isPlayer1 ? match.player2_score : match.player1_score
  }

  const getPlayerRatingChange = (match: MatchWithRatings) => {
    const { isPlayer1 } = getPlayerRole(match)
    if (!match.rating_updates) return null
    
    return isPlayer1 ? match.rating_updates.player1 : match.rating_updates.player2
  }

  const isWinner = (match: MatchWithRatings) => {
    // Check if current player is the winner
    if (match.winner_id === currentPlayerId) {
      return true
    }
    // Also check by scores if winner_id is not set
    const { isPlayer1 } = getPlayerRole(match)
    if (match.winner_id === null || match.winner_id === undefined) {
      const playerScore = isPlayer1 ? match.player1_score : match.player2_score
      const opponentScore = isPlayer1 ? match.player2_score : match.player1_score
      return playerScore > opponentScore
    }
    return false
  }

  const isDraw = (match: MatchWithRatings) => {
    // Check if it's a draw (winner_id is null or scores are equal)
    if (match.winner_id === null || match.winner_id === undefined) {
      return match.player1_score === match.player2_score
    }
    return false
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">Match History</h3>
        <div className="text-center py-8 text-gray-500">Loading match history...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">Match History</h3>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">Match History</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No matches played yet.</p>
          <p className="text-sm mt-2">Complete a match to see it here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-blue-600">Match History</h3>
      <p className="text-sm text-gray-600 mb-6">
        Your recent matches with scores and rating changes
      </p>

      <div className="space-y-4">
        {matches.map((match) => {
          const { opponentName } = getPlayerRole(match)
          const playerScore = getPlayerScore(match)
          const opponentScore = getOpponentScore(match)
          const ratingChange = getPlayerRatingChange(match)
          const won = isWinner(match)
          const draw = isDraw(match)

          return (
            <div
              key={match.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      vs {opponentName}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                      {match.league_name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(match.played_at), 'MMM d, yyyy')} •{' '}
                    {formatDistanceToNow(new Date(match.played_at), { addSuffix: true })}
                  </div>
                </div>
                
                <div className="text-right">
                  {won && (
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      WIN
                    </span>
                  )}
                  {!won && !draw && (
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      LOSS
                    </span>
                  )}
                  {draw && (
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      DRAW
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{playerScore}</div>
                  <div className="text-xs text-gray-500">Your Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{opponentScore}</div>
                  <div className="text-xs text-gray-500">{opponentName}'s Score</div>
                </div>
              </div>

              {ratingChange && (
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating Change:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {ratingChange.old_rating} →
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {ratingChange.new_rating}
                      </span>
                      {ratingChange.change !== 0 && (
                        <span
                          className={`text-sm font-medium ${
                            ratingChange.change > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          ({ratingChange.change > 0 ? '+' : ''}{ratingChange.change})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!ratingChange && match.status === 'completed' && (
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-400">Rating update pending</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
