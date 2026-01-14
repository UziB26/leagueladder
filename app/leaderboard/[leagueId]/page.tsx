import { db } from "@/lib/db"
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table"
import { notFound } from "next/navigation"
import { LeaderboardEntry } from "@/types/database"
import { League } from "@/types/database"
import Link from "next/link"

interface LeaguePageProps {
  params: Promise<{
    leagueId: string
  }>
}

export default async function LeagueLeaderboardPage({ params }: LeaguePageProps) {
  const { leagueId } = await params
  
  // Fetch league
  const league = db.prepare('SELECT * FROM leagues WHERE id = ?').get(leagueId) as League | undefined
  
  if (!league) {
    notFound()
  }
  
  // Fetch leaderboard
  const players = db.prepare(`
    SELECT 
      p.id, p.name, p.email, p.avatar,
      pr.rating, pr.games_played, pr.wins, pr.losses, pr.draws
    FROM players p
    JOIN player_ratings pr ON p.id = pr.player_id
    WHERE pr.league_id = ?
    ORDER BY pr.rating DESC
    LIMIT 100
  `).all(leagueId) as LeaderboardEntry[]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
            league.game_type === 'fifa' ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            <span className="text-2xl">
              {league.game_type === 'fifa' ? '🎮' : '🏓'}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-500">{league.name} Leaderboard</h1>
            <p className="text-gray-600 mt-1">
              {league.game_type === 'fifa' ? 'FIFA video game league' : 'Table tennis league'}
            </p>
          </div>
        </div>
      </div>

      <LeaderboardTable players={players} leagueName={league.name} />

      {/* Top 3 Players */}
      {players.length >= 3 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-blue-500 mb-6">Top 3 Players</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {players.slice(0, 3).map((player, index) => (
              <div key={player.id} className="text-center p-6 bg-white rounded-lg shadow">
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
                </div>
                <Link 
                  href={`/players/${player.id}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
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
