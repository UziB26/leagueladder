"use client"

import React from 'react'
import { Player } from "@/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayerMatchHistory } from "./player-match-history"
import { RatingHistory } from "./rating-history"
import { parseDatabaseDate } from "@/lib/utils"

interface AdminActivity {
  id: string
  type: 'admin_action'
  description: string
  created_at: string
  admin_name: string
}

interface PlayerProfileProps {
  player: Player
  ratings: any[]
  matches: any[]
  adminActivities?: AdminActivity[]
}

export function PlayerProfile({ player, ratings, matches, adminActivities = [] }: PlayerProfileProps) {
  const totalGames = ratings.reduce((sum, rating) => sum + rating.games_played, 0)
  const totalWins = ratings.reduce((sum, rating) => sum + rating.wins, 0)
  const totalLosses = ratings.reduce((sum, rating) => sum + rating.losses, 0)
  const totalDraws = ratings.reduce((sum, rating) => sum + rating.draws, 0)
  
  const winPercentage = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Player Header */}
      <div className="bg-black shadow rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-6">
          {player.avatar ? (
            <img className="h-24 w-24 rounded-full" src={player.avatar} alt={player.name} />
          ) : (
            <div className="h-24 w-24 rounded-full bg-blue-900 flex items-center justify-center border border-blue-700">
              <span className="text-3xl text-blue-400 font-bold">
                {player.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white">{player.name}</h1>
            <p className="text-gray-300">{player.email}</p>
            <p className="text-gray-400 text-sm mt-1">
              Member since {parseDatabaseDate(player.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Stats</CardTitle>
            <CardDescription>Across all leagues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                <div className="text-2xl font-bold text-blue-400">{totalGames}</div>
                <div className="text-sm text-gray-300">Games Played</div>
              </div>
              <div className="text-center p-3 bg-green-900/30 rounded-lg border border-green-700">
                <div className="text-2xl font-bold text-green-400">{totalWins}</div>
                <div className="text-sm text-gray-300">Wins</div>
              </div>
              <div className="text-center p-3 bg-red-900/30 rounded-lg border border-red-700">
                <div className="text-2xl font-bold text-red-400">{totalLosses}</div>
                <div className="text-sm text-gray-300">Losses</div>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-2xl font-bold text-gray-300">{totalDraws}</div>
                <div className="text-sm text-gray-300">Draws</div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Win Rate</span>
                <span className="text-sm font-bold text-white">{winPercentage}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${winPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* League Ratings Card */}
        <Card>
          <CardHeader>
            <CardTitle>League Ratings</CardTitle>
            <CardDescription>Elo ratings per league</CardDescription>
          </CardHeader>
          <CardContent>
            {ratings.length > 0 ? (
              <div className="space-y-3">
                {ratings.map((rating) => (
                  <div key={rating.id} className="flex justify-between items-center p-3 hover:bg-gray-800 rounded border border-gray-700">
                    <div>
                      <div className="font-medium text-white">{rating.league_name}</div>
                      <div className="text-sm text-gray-400">
                        {rating.games_played} games • {rating.wins}W {rating.losses}L {rating.draws > 0 && `${rating.draws}D`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">{rating.rating}</div>
                      <div className="text-xs text-gray-400">ELO</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-white">Not enrolled in any leagues yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest matches and admin changes</CardDescription>
          </CardHeader>
          <CardContent>
            {matches.length > 0 || adminActivities.length > 0 ? (
              <div className="space-y-3">
                {/* Combine matches and admin activities, sort by date, take top 5 */}
                {[
                  ...matches.slice(0, 5).map(m => ({ ...m, type: 'match', sort_date: m.played_at })),
                  ...adminActivities.slice(0, 5).map(a => ({ ...a, type: 'admin_action', sort_date: a.created_at }))
                ]
                  .sort((a, b) => new Date(b.sort_date).getTime() - new Date(a.sort_date).getTime())
                  .slice(0, 5)
                  .map((item) => {
                    if (item.type === 'match') {
                      const match = item as any
                      return (
                        <div key={match.id} className="p-3 border border-gray-700 rounded-lg bg-gray-900">
                          <div className="flex justify-between items-center">
                            <div className="font-medium text-white">{match.league_name}</div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              match.winner_id === player.id 
                                ? 'bg-green-900 text-green-300' 
                                : match.winner_id === null
                                ? 'bg-gray-800 text-gray-300'
                                : 'bg-red-900 text-red-300'
                            }`}>
                              {match.winner_id === player.id ? 'WIN' : match.winner_id === null ? 'DRAW' : 'LOSS'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-300 mt-1">
                            {match.player1_name} {match.player1_score} - {match.player2_score} {match.player2_name}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {parseDatabaseDate(match.played_at).toLocaleDateString()}
                          </div>
                        </div>
                      )
                    } else {
                      const activity = item as AdminActivity
                      return (
                        <div key={activity.id} className="p-3 border border-yellow-700 rounded-lg bg-yellow-900/20">
                          <div className="flex justify-between items-center">
                            <div className="font-medium text-yellow-300">Admin Adjustment</div>
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-900 text-yellow-300">
                              ADMIN
                            </span>
                          </div>
                          <div className="text-sm text-gray-300 mt-1">
                            {activity.description}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            by {activity.admin_name} • {parseDatabaseDate(activity.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      )
                    }
                  })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-white">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rating History Section */}
      <div className="mt-6">
        <RatingHistory playerId={player.id} limit={50} />
      </div>

      {/* Match History Section */}
      <div className="mt-6">
        <PlayerMatchHistory playerId={player.id} limit={50} />
      </div>
    </div>
  )
}