import { db } from "@/lib/db"
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LeaderboardEntry } from "@/types/database"
import { League } from "@/types/database"

export default async function LeaderboardPage() {
  // Fetch leagues
  const leagues = db.prepare('SELECT * FROM leagues').all() as League[]
  
  // Fetch leaderboard data for each league
  const leagueData = leagues.map((league) => {
    const players = db.prepare(`
      SELECT 
        p.id, p.name, p.email, p.avatar,
        pr.rating, pr.games_played, pr.wins, pr.losses, pr.draws
      FROM players p
      JOIN player_ratings pr ON p.id = pr.player_id
      WHERE pr.league_id = ?
      ORDER BY pr.rating DESC
      LIMIT 50
    `).all(league.id) as LeaderboardEntry[]
    
    return {
      league,
      players
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Leaderboards</h1>
        <p className="text-white mt-2">See who's on top in each league</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {leagueData.map(({ league, players }) => (
          <div key={league.id}>
            <LeaderboardTable 
              players={players} 
              leagueName={league.name}
            />
            
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
                {leagues.length}
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
