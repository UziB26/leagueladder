"use client"

import { LeaderboardEntry } from "@/types/database"
import Link from "next/link"
import { EmptyLeaderboardState } from "@/components/ui/empty-state"

interface LeaderboardTableProps {
  players: LeaderboardEntry[]
  leagueName: string
}

export function LeaderboardTable({ players, leagueName }: LeaderboardTableProps) {
  return (
    <div className="bg-black shadow-md rounded-lg overflow-hidden">
      {/* Mobile Card View - Visible on small screens, hidden on md and up */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-700">
          {players.map((player, index) => {
            const winPercentage = player.games_played > 0 
              ? Math.round((player.wins / player.games_played) * 100)
              : 0
            
            return (
              <div key={player.id} className="p-4 hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      <span className="font-bold text-lg">{index + 1}</span>
                    </span>
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 h-14 w-14">
                        {player.avatar ? (
                          <img className="h-14 w-14 rounded-full" src={player.avatar} alt="" />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-300 font-semibold text-lg">
                              {player.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link 
                          href={`/players/${player.id}`} 
                          className="block text-lg font-semibold text-white hover:text-blue-400 active:text-blue-500 py-2 -my-2"
                        >
                          {player.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-white mb-1">
                      {player.rating}
                      <span className="text-sm ml-1 text-gray-400 font-normal">ELO</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">
                      {player.games_played} {player.games_played === 1 ? 'game' : 'games'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base">
                    <span className="font-semibold text-green-400">{player.wins}W</span>
                    {" - "}
                    <span className="font-semibold text-red-400">{player.losses}L</span>
                    {player.draws > 0 && (
                      <>
                        {" - "}
                        <span className="font-semibold text-gray-400">{player.draws}D</span>
                      </>
                    )}
                  </div>
                  <div className="text-base font-semibold text-gray-300">
                    {winPercentage}%
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all" 
                      style={{ width: `${winPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Desktop Table View - Hidden on small screens, visible on md and up */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Player
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Games
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Record
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Win %
              </th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-gray-700">
            {players.map((player, index) => {
              const winPercentage = player.games_played > 0 
                ? Math.round((player.wins / player.games_played) * 100)
                : 0
                
              return (
                <tr key={player.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        <span className="font-bold">{index + 1}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {player.avatar ? (
                          <img className="h-10 w-10 rounded-full" src={player.avatar} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-300 font-semibold">
                              {player.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          <Link href={`/players/${player.id}`} className="hover:text-blue-400">
                            {player.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-white">
                      {player.rating}
                      <span className="text-xs ml-1 text-gray-400">ELO</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {player.games_played}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <span className="font-medium text-green-400">{player.wins}W</span>
                    {" - "}
                    <span className="font-medium text-red-400">{player.losses}L</span>
                    {player.draws > 0 && (
                      <>
                        {" - "}
                        <span className="font-medium text-gray-400">{player.draws}D</span>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${winPercentage}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-300">
                        {winPercentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {players.length === 0 && (
        <EmptyLeaderboardState leagueName={leagueName} />
      )}
    </div>
  )
}