"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleJoinLeague = (gameType: 'fifa' | 'table-tennis') => {
    if (!session) {
      router.push('/auth/login')
      return
    }
    
    // For now, redirect to dashboard where they can join leagues
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-gray-950 mb-3">🏓 League Ladder</h1>
          <p className="text-lg text-gray-800 mt-2">Table Tennis & FIFA leagues with Elo rankings</p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold text-gray-950 mb-4">🎮 FIFA League</h2>
            <p className="text-base text-gray-800 mb-4 leading-relaxed">Challenge players, record matches, climb the FIFA rankings</p>
            <Button onClick={() => handleJoinLeague('fifa')}>
              {session ? 'Go to Dashboard' : 'Join FIFA League'}
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold text-gray-950 mb-4">🏓 Table Tennis</h2>
            <p className="text-base text-gray-800 mb-4 leading-relaxed">Compete in table tennis matches with Elo-based rankings</p>
            <Button onClick={() => handleJoinLeague('table-tennis')}>
              {session ? 'Go to Dashboard' : 'Join Table Tennis'}
            </Button>
          </div>
        </div>
        
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-950 mb-4">How it works</h3>
          <ol className="list-decimal pl-5 space-y-3 text-base text-gray-800 leading-relaxed">
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
