"use client"

import { useState, useEffect, useCallback } from "react"
import { LeaderboardTable } from "./leaderboard-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LeaderboardEntry } from "@/types/database"
import { League } from "@/types/database"

interface LeaderboardListClientProps {
  initialLeagueData: Array<{
    league: League
    players: LeaderboardEntry[]
  }>
}

export function LeaderboardListClient({ initialLeagueData }: LeaderboardListClientProps) {
  const [leagueData, setLeagueData] = useState(initialLeagueData)
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const refreshLeague = useCallback(async (leagueId: string) => {
    setLoading(prev => ({ ...prev, [leagueId]: true }))
    try {
      const response = await fetch(`/api/leaderboard/${leagueId}`)
      if (response.ok) {
        const data = await response.json()
        setLeagueData(prev => prev.map(item => 
          item.league.id === leagueId 
            ? { ...item, players: data.players || [] }
            : item
        ))
      }
    } catch (error) {
      console.error(`Error refreshing leaderboard for league ${leagueId}:`, error)
    } finally {
      setLoading(prev => ({ ...prev, [leagueId]: false }))
    }
  }, [])

  const refreshAll = useCallback(async () => {
    for (const { league } of leagueData) {
      await refreshLeague(league.id)
    }
  }, [leagueData, refreshLeague])

  // Listen for custom event to refresh all leaderboards
  useEffect(() => {
    const handleRefresh = () => {
      refreshAll()
    }

    window.addEventListener('leaderboard:refresh', handleRefresh)
    
    // Also refresh when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshAll()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('leaderboard:refresh', handleRefresh)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refreshAll])

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Leaderboards</h1>
          <p className="text-white mt-2">See who's on top in each league</p>
        </div>
        <button
          onClick={refreshAll}
          disabled={Object.values(loading).some(l => l)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {Object.values(loading).some(l => l) ? 'Refreshing...' : '🔄 Refresh All'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {leagueData.map(({ league, players }) => (
          <div key={league.id}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{league.name} Leaderboard</h2>
                <p className="text-gray-600 text-sm">Top players by Elo rating</p>
              </div>
              <button
                onClick={() => refreshLeague(league.id)}
                disabled={loading[league.id]}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
              >
                {loading[league.id] ? '...' : '🔄'}
              </button>
            </div>
            <LeaderboardTable players={players} leagueName={league.name} />
            
            {/* League Stats Summary */}
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{league.name} Stats</CardTitle>
                <CardDescription>League overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{players.length}</div>
                    <div className="text-sm text-gray-600">Players</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {players.reduce((sum, p) => sum + p.games_played, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Games</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {players.length > 0 
                        ? Math.round(players.reduce((sum, p) => sum + p.rating, 0) / players.length)
                        : 0
                      }
                    </div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Global Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Global Statistics</CardTitle>
          <CardDescription>Across all leagues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {leagueData.length}
              </div>
              <div className="text-gray-600">Active Leagues</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {leagueData.reduce((sum, data) => sum + data.players.length, 0)}
              </div>
              <div className="text-gray-600">Total Players</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {leagueData.reduce((sum, data) => 
                  sum + data.players.reduce((pSum, p) => pSum + p.games_played, 0), 0
                )}
              </div>
              <div className="text-gray-600">Matches Played</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {leagueData.reduce((sum, data) => 
                  sum + data.players.reduce((pSum, p) => pSum + p.wins, 0), 0
                )}
              </div>
              <div className="text-gray-600">Total Wins</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
