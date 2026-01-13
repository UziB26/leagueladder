import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">🏓 League Ladder</h1>
          <p className="text-gray-600 mt-2">Table Tennis & FIFA leagues with Elo rankings</p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">🎮 FIFA League</h2>
            <p className="text-gray-600 mb-4">Challenge players, record matches, climb the FIFA rankings</p>
            <Button>Join FIFA League</Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">🏓 Table Tennis</h2>
            <p className="text-gray-600 mb-4">Compete in table tennis matches with Elo-based rankings</p>
            <Button variant="secondary">Join Table Tennis</Button>
          </div>
        </div>
        
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">How it works</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Register and create your player profile</li>
            <li>Join either FIFA or Table Tennis league (or both!)</li>
            <li>Challenge other players to matches</li>
            <li>Record match results to update Elo ratings</li>
            <li>Climb the leaderboard and become #1</li>
          </ol>
        </div>
      </div>
    </main>
  )
}