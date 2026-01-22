"use client"

import { Button } from "@/components/ui/button"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorState } from "@/components/ui/error-state"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Gamepad2 } from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Small delay to show loading state if session is being checked
    if (status !== 'loading') {
      setLoading(false)
    }
  }, [status])

  const handleJoinLeague = (gameType: 'fifa' | 'table-tennis') => {
    if (!session) {
      router.push('/auth/login')
      return
    }
    
    router.push('/dashboard')
  }

  if (loading || status === 'loading') {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <LoadingState text="Loading..." fullScreen />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <img 
              src="/APP LOGO.png" 
              alt="League Ladder Logo" 
              className="h-12 w-12 object-contain"
              loading="eager"
            />
            League Ladder
          </h1>
          <p className="text-gray-300 mt-2">Table Tennis & FIFA leagues with Elo rankings</p>
        </header>
        
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4 text-white">How it works</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-300">
            <li>Register and create your player profile</li>
            <li>Join either FIFA or Table Tennis league (or both!)</li>
            <li>Challenge other players to matches</li>
            <li>Record match results to update Elo ratings</li>
            <li>Climb the leaderboard and become #1</li>
          </ol>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-white" strokeWidth={2} /> FIFA League
            </h2>
            <p className="text-gray-300 mb-4">Challenge players, record matches, climb the FIFA rankings</p>
            <div className="flex gap-3">
              <Button onClick={() => handleJoinLeague('fifa')}>
                {session ? 'Go to Dashboard' : 'Join FIFA League'}
              </Button>
              <Link href="/leaderboard/fifa_league">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">View Leaderboard</Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-white">🏓 Table Tennis League</h2>
            <p className="text-gray-300 mb-4">Compete in table tennis matches with Elo-based rankings</p>
            <div className="flex gap-3">
              <Button onClick={() => handleJoinLeague('table-tennis')}>
                {session ? 'Go to Dashboard' : 'Join Table Tennis'}
              </Button>
              <Link href="/leaderboard/tt_league">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">View Leaderboard</Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg shadow mb-8 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/leaderboard">
              <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer">
                <div className="font-medium text-white">All Leaderboards</div>
                <div className="text-sm text-gray-300">View rankings across all leagues</div>
              </div>
            </Link>
            <Link href={session ? "/dashboard" : "/auth/login"}>
              <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer">
                <div className="font-medium text-white">Your Dashboard</div>
                <div className="text-sm text-gray-300">Manage your leagues and profile</div>
              </div>
            </Link>
            <Link href="/matches">
              <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer">
                <div className="font-medium text-white">Recent Matches</div>
                <div className="text-sm text-gray-300">See latest match results</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
