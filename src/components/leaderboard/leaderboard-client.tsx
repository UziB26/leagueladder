"use client"

import { useState, useEffect, useCallback } from "react"
import { LeaderboardTable } from "./leaderboard-table"
import { LeaderboardSkeleton } from "@/components/ui/leaderboard-skeleton"
import { LeaderboardEntry } from "@/types/database"
import Link from "next/link"

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

  const top3Players = players.slice(0, 3)

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
      {loading ? (
        <LeaderboardSkeleton />
      ) : (
        <LeaderboardTable players={players} leagueName={leagueName} />
      )}
      
      {/* Top 3 Players */}
      {top3Players.length >= 3 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-blue-500 mb-6">Top 3 Players</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {top3Players.map((player, index) => (
              <div key={player.id} className="text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  <span className="text-2xl font-bold">#{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{player.name}</h3>
                <div className="text-3xl font-bold text-gray-900 my-2">{player.rating}</div>
                <div className="text-sm text-gray-500">ELO Rating</div>
                <div className="mt-4 text-sm text-gray-600">
                  {player.games_played} games • {player.wins}W {player.losses}L
                  {player.draws > 0 && ` • ${player.draws}D`}
                </div>
                <Link 
                  href={`/players/${player.id}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  View Profile →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
