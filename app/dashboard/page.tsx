"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"

interface League {
  id: string
  name: string
  game_type: string
}

interface LeagueWithMembership extends League {
  isMember: boolean
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [leagues, setLeagues] = useState<LeagueWithMembership[]>([])
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
        // Check membership status for each league
        const leaguesWithMembership = await Promise.all(
          data.leagues.map(async (league: League) => {
            let isMember = false
            
            try {
              const membershipResponse = await fetch(`/api/leagues/${league.id}/membership`)
              if (membershipResponse.ok) {
                const membershipData = await membershipResponse.json()
                isMember = membershipData.isMember || false
              }
            } catch (error) {
              console.error(`Error checking membership for ${league.id}:`, error)
            }

            return {
              ...league,
              isMember
            }
          })
        )
        setLeagues(leaguesWithMembership)
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
        setTimeout(() => {
          fetchLeagues()
        }, 500)
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
          {leagues.map((league) => {
            const isJoining = joining === league.id
            
            return (
              <div key={league.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-black">
                    {league.game_type === 'fifa' ? '🎮' : '🏓'} {league.name}
                  </h2>
                  {league.isMember && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Member
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">
                  {league.game_type === 'fifa' 
                    ? 'Challenge players, record matches, climb the FIFA rankings'
                    : 'Compete in table tennis matches with Elo-based rankings'}
                </p>
                {league.isMember ? (
                  <Link href={`/leaderboard/${league.id}`}>
                    <Button className="w-full text-blue-600 hover:text-blue-700" variant="outline">
                      View Leaderboard
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => handleJoinLeague(league.id)}
                    disabled={loading || isJoining}
                    className="w-full"
                  >
                    {isJoining ? 'Joining...' : `Join ${league.name}`}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
        
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-black">How it works</h3>
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
