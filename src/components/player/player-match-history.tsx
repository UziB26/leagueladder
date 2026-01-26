"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow, format } from "date-fns"
import { parseDatabaseDate } from "@/lib/utils"

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
  admin_adjustments?: {
    rating_adjusted?: boolean
    stats_adjusted?: boolean
    match_score_edited?: boolean
  }
}

interface PlayerMatchHistoryProps {
  playerId: string
  limit?: number
}

export function PlayerMatchHistory({ playerId, limit = 50 }: PlayerMatchHistoryProps) {
  const [matches, setMatches] = useState<MatchWithRatings[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (playerId) {
      fetchMatchHistory()
    }
  }, [playerId])

  const fetchMatchHistory = async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await fetch(`/api/players/${playerId}/matches?limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch match history')
      }
      
      const data = await response.json()
      setMatches(data.matches || [])
    } catch (error: any) {
      console.error('Error fetching match history:', error)
      setError(error.message || 'Failed to load match history')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-black shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Match History</h2>
        <div className="text-center py-12 text-gray-400">Loading match history...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-black shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Match History</h2>
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="bg-black shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Match History</h2>
      <div className="text-center py-12 text-gray-400">
        <p>No matches played yet.</p>
        <p className="text-sm mt-2">This player hasn't played any matches yet.</p>
      </div>
      </div>
    )
  }

  return (
    <div className="bg-black shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Match History</h2>
        <span className="text-sm text-gray-400">
          {matches.length} {matches.length === 1 ? 'match' : 'matches'}
        </span>
      </div>

      <div className="space-y-4">
        {matches.map((match) => {
          const isPlayer1 = match.player1_id === playerId
          const opponentName = isPlayer1 ? match.player2_name : match.player1_name
          const playerScore = isPlayer1 ? match.player1_score : match.player2_score
          const opponentScore = isPlayer1 ? match.player2_score : match.player1_score
          
          // Determine winner - check winner_id first, then fallback to scores
          let isWinner = false
          let isDraw = false
          
          if (match.winner_id === playerId) {
            isWinner = true
          } else if (match.winner_id === null || match.winner_id === undefined) {
            // If winner_id is not set, determine from scores
            if (playerScore === opponentScore) {
              isDraw = true
            } else {
              isWinner = playerScore > opponentScore
            }
          } else {
            // winner_id is set and it's not the current player, so it's a loss
            isWinner = false
          }
          
          const ratingUpdate = isPlayer1 
            ? match.rating_updates?.player1 
            : match.rating_updates?.player2

          return (
            <div
              key={match.id}
              className={`border rounded-lg p-4 transition-colors ${
                isWinner 
                  ? 'bg-green-900/30 border-green-700' 
                  : isDraw
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-red-900/30 border-red-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      isWinner 
                        ? 'bg-green-800 text-green-300' 
                        : isDraw
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-red-800 text-red-300'
                    }`}>
                      {isWinner ? 'WIN' : isDraw ? 'DRAW' : 'LOSS'}
                    </span>
                    <span className="text-sm font-medium text-gray-300">
                      {match.league_name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(parseDatabaseDate(match.played_at), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-semibold ${isPlayer1 ? 'text-blue-400' : 'text-gray-300'}`}>
                      {match.player1_name}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {match.player1_score}
                    </span>
                    <span className="text-gray-500">-</span>
                    <span className="text-lg font-bold text-white">
                      {match.player2_score}
                    </span>
                    <span className={`font-semibold ${!isPlayer1 ? 'text-blue-400' : 'text-gray-300'}`}>
                      {match.player2_name}
                    </span>
                  </div>

                  {ratingUpdate && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">Rating:</span>
                      <span className="font-medium text-gray-300">
                        {ratingUpdate.old_rating}
                      </span>
                      <span className="text-gray-500">→</span>
                      <span className="font-bold text-white">
                        {ratingUpdate.new_rating}
                      </span>
                      <span className={`font-semibold ${
                        ratingUpdate.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ({ratingUpdate.change >= 0 ? '+' : ''}{ratingUpdate.change})
                      </span>
                    </div>
                  )}
                  
                  {match.admin_adjustments && (
                    <div className="flex items-center gap-2 text-xs mt-2">
                      {(match.admin_adjustments.rating_adjusted || 
                        match.admin_adjustments.stats_adjusted || 
                        match.admin_adjustments.match_score_edited) && (
                        <span className="px-2 py-1 bg-yellow-900/50 text-yellow-300 rounded border border-yellow-700/50 flex items-center gap-1">
                          <span>⚙️</span>
                          <span>
                            {match.admin_adjustments.match_score_edited && 'Score edited'}
                            {match.admin_adjustments.match_score_edited && 
                             (match.admin_adjustments.rating_adjusted || match.admin_adjustments.stats_adjusted) && ', '}
                            {match.admin_adjustments.rating_adjusted && 'Rating adjusted'}
                            {match.admin_adjustments.rating_adjusted && match.admin_adjustments.stats_adjusted && ', '}
                            {match.admin_adjustments.stats_adjusted && 'Stats adjusted'}
                            {' by admin'}
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-400 ml-4">
                  {format(parseDatabaseDate(match.played_at), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
