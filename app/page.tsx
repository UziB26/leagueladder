"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleJoinLeague = (gameType: 'fifa' | 'table-tennis') => {
    if (!session) {
      router.push('/auth/login')
      return
    }
    
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">🏓 League Ladder</h1>
          <p className="text-gray-600 mt-2">Table Tennis & FIFA leagues with Elo rankings</p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 !text-black">🎮 FIFA League</h2>
            <p className="text-gray-600 mb-4">Challenge players, record matches, climb the FIFA rankings</p>
            <div className="flex gap-3">
              <Button onClick={() => handleJoinLeague('fifa')}>
                {session ? 'Go to Dashboard' : 'Join FIFA League'}
              </Button>
              <Link href="/leaderboard/fifa_league">
                <Button variant="outline">View Leaderboard</Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 !text-black">🏓 Table Tennis League</h2>
            <p className="text-gray-600 mb-4">Compete in table tennis matches with Elo-based rankings</p>
            <div className="flex gap-3">
              <Button onClick={() => handleJoinLeague('table-tennis')}>
                {session ? 'Go to Dashboard' : 'Join Table Tennis'}
              </Button>
              <Link href="/leaderboard/tt_league">
                <Button variant="outline">View Leaderboard</Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold mb-4 !text-black">Quick Links</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/leaderboard">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium !text-black">All Leaderboards</div>
                <div className="text-sm text-gray-600">View rankings across all leagues</div>
              </div>
            </Link>
            <Link href={session ? "/dashboard" : "/auth/login"}>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium !text-black">Your Dashboard</div>
                <div className="text-sm text-gray-600">Manage your leagues and profile</div>
              </div>
            </Link>
            <Link href="/matches">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium !text-black">Recent Matches</div>
                <div className="text-sm text-gray-600">See latest match results</div>
              </div>
            </Link>
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
