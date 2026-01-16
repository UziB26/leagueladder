"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow, format } from "date-fns"
import { parseDatabaseDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RatingHistoryEntry {
  id: string
  match_id: string
  league_id: string
  league_name: string
  old_rating: number
  new_rating: number
  change: number
  created_at: string
  opponent_name?: string
  match_score?: string
  match_date?: string
}

interface RatingHistoryProps {
  playerId: string
  leagueId?: string
  limit?: number
}

export function RatingHistory({ playerId, leagueId, limit = 50 }: RatingHistoryProps) {
  const [history, setHistory] = useState<RatingHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (playerId) {
      fetchRatingHistory()
    }
  }, [playerId, leagueId])

  const fetchRatingHistory = async () => {
    try {
      setLoading(true)
      setError("")
      
      let url = `/api/players/${playerId}/rating-history?limit=${limit}`
      if (leagueId) {
        url += `&leagueId=${leagueId}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch rating history')
      }
      
      const data = await response.json()
      setHistory(data.history || [])
    } catch (error: any) {
      console.error('Error fetching rating history:', error)
      setError(error.message || 'Failed to load rating history')
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalChanges = history.length
  const positiveChanges = history.filter(h => h.change > 0).length
  const negativeChanges = history.filter(h => h.change < 0).length
  const totalGain = history.filter(h => h.change > 0).reduce((sum, h) => sum + h.change, 0)
  const totalLoss = Math.abs(history.filter(h => h.change < 0).reduce((sum, h) => sum + h.change, 0))
  const netChange = history.reduce((sum, h) => sum + h.change, 0)
  const highestRating = history.length > 0 ? Math.max(...history.map(h => h.new_rating)) : null
  const lowestRating = history.length > 0 ? Math.min(...history.map(h => h.new_rating)) : null

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rating History</CardTitle>
          <CardDescription>Track your rating changes over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">Loading rating history...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rating History</CardTitle>
          <CardDescription>Track your rating changes over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rating History</CardTitle>
          <CardDescription>Track your rating changes over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>No rating changes yet.</p>
            <p className="text-sm mt-2">Complete matches to see your rating history here!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating History</CardTitle>
        <CardDescription>Track your rating changes over time</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Statistics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{totalChanges}</div>
            <div className="text-xs text-gray-600">Total Changes</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">+{totalGain}</div>
            <div className="text-xs text-gray-600">Total Gained</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-bold text-red-600">-{totalLoss}</div>
            <div className="text-xs text-gray-600">Total Lost</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className={`text-lg font-bold ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netChange >= 0 ? '+' : ''}{netChange}
            </div>
            <div className="text-xs text-gray-600">Net Change</div>
          </div>
        </div>

        {highestRating && lowestRating && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">{highestRating}</div>
              <div className="text-xs text-gray-600">Highest Rating</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-600">{lowestRating}</div>
              <div className="text-xs text-gray-600">Lowest Rating</div>
            </div>
          </div>
        )}

        {/* Rating Timeline */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Changes</h3>
          {history.map((entry, index) => (
            <div
              key={entry.id}
              className={`border-l-4 pl-4 py-3 rounded-r-lg ${
                entry.change > 0
                  ? 'bg-green-50 border-green-500'
                  : entry.change < 0
                  ? 'bg-red-50 border-red-500'
                  : 'bg-gray-50 border-gray-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {entry.league_name}
                    </span>
                    {entry.opponent_name && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          vs {entry.opponent_name}
                        </span>
                        {entry.match_score && (
                          <span className="text-sm text-gray-500">
                            ({entry.match_score})
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-medium text-gray-700">
                      {entry.old_rating}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="font-bold text-gray-900">
                      {entry.new_rating}
                    </span>
                    <span className={`font-semibold ${
                      entry.change > 0
                        ? 'text-green-600'
                        : entry.change < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}>
                      ({entry.change >= 0 ? '+' : ''}{entry.change})
                    </span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 ml-4">
                  {formatDistanceToNow(parseDatabaseDate(entry.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
