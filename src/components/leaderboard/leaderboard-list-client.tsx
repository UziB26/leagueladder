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
  const [totalMatches, setTotalMatches] = useState(0)
  const [leagueMatchesCount, setLeagueMatchesCount] = useState<Record<string, number>>({})

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

  // Fetch total matches count and per-league counts
  useEffect(() => {
    const fetchMatchesCount = async () => {
      try {
        const totalResponse = await fetch('/api/matches/count')
        if (totalResponse.ok) {
          const totalData = await totalResponse.json()
          setTotalMatches(totalData.count || 0)
        }
        
        // Fetch per-league match counts
        const leagueCounts: Record<string, number> = {}
        for (const { league } of leagueData) {
          try {
            const leagueResponse = await fetch(`/api/leagues/${league.id}/matches/count`)
            if (leagueResponse.ok) {
              const leagueData = await leagueResponse.json()
              leagueCounts[league.id] = leagueData.count || 0
            }
          } catch (error) {
            console.error(`Error fetching matches for league ${league.id}:`, error)
          }
        }
        setLeagueMatchesCount(leagueCounts)
      } catch (error) {
        console.error('Error fetching matches count:', error)
      }
    }
    fetchMatchesCount()
  }, [leagueData])

  // Auto-refresh all leaderboards periodically and on events
  useEffect(() => {
    const refreshMatchesCount = async () => {
      try {
        const totalResponse = await fetch('/api/matches/count')
        if (totalResponse.ok) {
          const totalData = await totalResponse.json()
          setTotalMatches(totalData.count || 0)
        }
        
        // Refresh per-league match counts
        const leagueCounts: Record<string, number> = {}
        for (const { league } of leagueData) {
          try {
            const leagueResponse = await fetch(`/api/leagues/${league.id}/matches/count`)
            if (leagueResponse.ok) {
              const leagueData = await leagueResponse.json()
              leagueCounts[league.id] = leagueData.count || 0
            }
          } catch (error) {
            console.error(`Error fetching matches for league ${league.id}:`, error)
          }
        }
        setLeagueMatchesCount(leagueCounts)
      } catch (error) {
        console.error('Error refreshing matches count:', error)
      }
    }

    const handleRefresh = () => {
      refreshAll()
      refreshMatchesCount()
    }

    window.addEventListener('leaderboard:refresh', handleRefresh)
    
    // Also refresh when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshAll()
        refreshMatchesCount()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Auto-refresh every 5 seconds when page is visible
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshAll()
        refreshMatchesCount()
      }
    }, 5000) // Refresh every 5 seconds

    return () => {
      window.removeEventListener('leaderboard:refresh', handleRefresh)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(intervalId)
    }
  }, [refreshAll, leagueData])

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
                <h2 className="text-xl font-bold text-white">{league.name} Leaderboard</h2>
                <p className="text-white text-sm">Top players by Elo rating</p>
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
                <CardTitle className="text-lg text-white">{league.name} Stats</CardTitle>
                <CardDescription className="text-gray-400">League overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{players.length}</div>
                    <div className="text-sm text-white">Players</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {leagueMatchesCount[league.id] ?? '...'}
                    </div>
                    <div className="text-sm text-white">Total Games</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {players.length > 0 
                        ? Math.round(players.reduce((sum, p) => sum + p.rating, 0) / players.length)
                        : 0
                      }
                    </div>
                    <div className="text-sm text-white">Avg Rating</div>
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
                {new Set(leagueData.flatMap(data => data.players.map(p => p.id))).size}
              </div>
              <div className="text-gray-600">Total Players</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {totalMatches}
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
