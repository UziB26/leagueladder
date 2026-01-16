"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow, format } from "date-fns"
import { parseDatabaseDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

interface LeagueMatchHistoryProps {
  leagueId: string
  leagueName: string
  limit?: number
}

export function LeagueMatchHistory({ leagueId, leagueName, limit = 50 }: LeagueMatchHistoryProps) {
  const [matches, setMatches] = useState<MatchWithRatings[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (leagueId) {
      fetchMatchHistory()
    }
  }, [leagueId])

  const fetchMatchHistory = async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await fetch(`/api/leagues/${leagueId}/matches?limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch match history')
      }
      
      const data = await response.json()
      setMatches(data.matches || [])
    } catch (error: any) {
      console.error('Error fetching league match history:', error)
      setError(error.message || 'Failed to load match history')
    } finally {
      setLoading(false)
    }
  }

  // Listen for match reporting events to refresh
  useEffect(() => {
    const handleMatchReported = () => {
      fetchMatchHistory()
    }

    window.addEventListener('match:reported', handleMatchReported)
    window.addEventListener('leaderboard:refresh', handleMatchReported)
    
    return () => {
      window.removeEventListener('match:reported', handleMatchReported)
      window.removeEventListener('leaderboard:refresh', handleMatchReported)
    }
  }, [leagueId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{leagueName} Match History</CardTitle>
          <CardDescription>Recent matches played in this league</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">Loading match history...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{leagueName} Match History</CardTitle>
          <CardDescription>Recent matches played in this league</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{leagueName} Match History</CardTitle>
          <CardDescription>Recent matches played in this league</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>No matches played in this league yet.</p>
            <p className="text-sm mt-2">Be the first to start playing!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{leagueName} Match History</CardTitle>
            <CardDescription>Recent matches played in this league</CardDescription>
          </div>
          <span className="text-sm text-gray-500">
            {matches.length} {matches.length === 1 ? 'match' : 'matches'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map((match) => {
            // Determine outcome - check winner_id first, then fallback to scores
            let isDraw = false
            let player1Won = false
            
            if (match.winner_id === null || match.winner_id === undefined) {
              // If winner_id is not set, determine from scores
              if (match.player1_score === match.player2_score) {
                isDraw = true
              } else {
                player1Won = match.player1_score > match.player2_score
              }
            } else {
              // winner_id is set
              player1Won = match.winner_id === match.player1_id
              isDraw = false
            }
            
            return (
              <div
                key={match.id}
                className={`border rounded-lg p-4 transition-colors ${
                  isDraw
                    ? 'bg-gray-50 border-gray-200'
                    : player1Won
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        isDraw
                          ? 'bg-gray-200 text-gray-800'
                          : player1Won
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {isDraw ? 'DRAW' : player1Won ? `${match.player1_name} WINS` : `${match.player2_name} WINS`}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(parseDatabaseDate(match.played_at), { addSuffix: true })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">{match.player1_name}</span>
                      <span className="text-lg font-bold text-gray-900">
                        {match.player1_score}
                      </span>
                      <span className="text-gray-500">-</span>
                      <span className="text-lg font-bold text-gray-900">
                        {match.player2_score}
                      </span>
                      <span className="font-semibold text-gray-900">{match.player2_name}</span>
                    </div>

                    {match.rating_updates && (
                      <div className="flex items-center gap-4 text-sm">
                        {match.rating_updates.player1 && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{match.player1_name}:</span>
                            <span className="font-medium text-gray-700">
                              {match.rating_updates.player1.old_rating}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="font-bold text-gray-900">
                              {match.rating_updates.player1.new_rating}
                            </span>
                            <span className={`font-semibold ${
                              match.rating_updates.player1.change >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ({match.rating_updates.player1.change >= 0 ? '+' : ''}{match.rating_updates.player1.change})
                            </span>
                          </div>
                        )}
                        {match.rating_updates.player2 && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{match.player2_name}:</span>
                            <span className="font-medium text-gray-700">
                              {match.rating_updates.player2.old_rating}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="font-bold text-gray-900">
                              {match.rating_updates.player2.new_rating}
                            </span>
                            <span className={`font-semibold ${
                              match.rating_updates.player2.change >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ({match.rating_updates.player2.change >= 0 ? '+' : ''}{match.rating_updates.player2.change})
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 ml-4">
                    {format(parseDatabaseDate(match.played_at), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
