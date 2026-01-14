"use client"

import { useState, useEffect, useCallback } from "react"
import { LeaderboardTable } from "./leaderboard-table"
import { LeaderboardEntry } from "@/types/database"

interface LeaderboardClientProps {
  leagueId: string
  leagueName: string
  initialPlayers: LeaderboardEntry[]
}

export function LeaderboardClient({ leagueId, leagueName, initialPlayers }: LeaderboardClientProps) {
  const [players, setPlayers] = useState<LeaderboardEntry[]>(initialPlayers)
  const [loading, setLoading] = useState(false)

  const refreshLeaderboard = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/leaderboard/${leagueId}`)
      if (response.ok) {
        const data = await response.json()
        setPlayers(data.players || [])
      }
    } catch (error) {
      console.error('Error refreshing leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }, [leagueId])

  // Listen for custom event to refresh leaderboard
  useEffect(() => {
    const handleRefresh = () => {
      refreshLeaderboard()
    }

    window.addEventListener('leaderboard:refresh', handleRefresh)
    
    // Also refresh when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshLeaderboard()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('leaderboard:refresh', handleRefresh)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refreshLeaderboard])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{leagueName} Leaderboard</h2>
          <p className="text-gray-600 text-sm">Top players by Elo rating</p>
        </div>
        <button
          onClick={refreshLeaderboard}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>
      <LeaderboardTable players={players} leagueName={leagueName} />
    </div>
  )
}
