"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface League {
  id: string
  name: string
  game_type: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }
    fetchLeagues()
  }, [session, router])

  const fetchLeagues = async () => {
    try {
      const response = await fetch('/api/leagues')
      const data = await response.json()
      if (data.leagues) {
        setLeagues(data.leagues)
      }
    } catch (error) {
      console.error('Error fetching leagues:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinLeague = async (leagueId: string) => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    setJoining(leagueId)
    setMessage(null)

    try {
      const response = await fetch('/api/leagues/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leagueId }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Successfully joined league!' })
        // Refresh leagues to show updated status
        fetchLeagues()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to join league' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setJoining(null)
    }
  }

  if (!session) {
    return null
  }

  const fifaLeague = leagues.find(l => l.game_type === 'fifa')
  const tableTennisLeague = leagues.find(l => l.game_type === 'table-tennis')

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">🏓 League Ladder Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome{session?.user?.name ? `, ${session.user.name}` : ''}!</p>
        </header>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">🎮 FIFA League</h2>
            <p className="text-gray-600 mb-4">Challenge players, record matches, climb the FIFA rankings</p>
            <Button 
              onClick={() => fifaLeague && handleJoinLeague(fifaLeague.id)}
              disabled={loading || joining === (fifaLeague?.id)}
            >
              {joining === (fifaLeague?.id) ? 'Joining...' : 'Join FIFA League'}
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">🏓 Table Tennis</h2>
            <p className="text-gray-600 mb-4">Compete in table tennis matches with Elo-based rankings</p>
            <Button 
              onClick={() => tableTennisLeague && handleJoinLeague(tableTennisLeague.id)}
              disabled={loading || joining === (tableTennisLeague?.id)}
            >
              {joining === (tableTennisLeague?.id) ? 'Joining...' : 'Join Table Tennis'}
            </Button>
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
