"use client"

import { Button } from "@/components/ui/button"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorState, ErrorMessage } from "@/components/ui/error-state"
import { SuccessMessage } from "@/components/ui/success-state"
import { EmptyState } from "@/components/ui/empty-state"
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
  const [error, setError] = useState<string | null>(null)
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
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/leagues')
      if (!response.ok) {
        throw new Error('Failed to fetch leagues')
      }
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
    } catch (error: any) {
      console.error('Error fetching leagues:', error)
      setError(error.message || 'Failed to load leagues. Please try again.')
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

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <LoadingState text="Loading your dashboard..." fullScreen />
        </div>
      </main>
    )
  }

  if (error && leagues.length === 0) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <ErrorState
            title="Failed to load dashboard"
            message={error}
            onRetry={fetchLeagues}
            fullScreen
          />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white">🏓 League Ladder Dashboard</h1>
          <p className="text-gray-300 mt-2">Welcome{session?.user?.name ? `, ${session.user.name}` : ''}!</p>
        </header>

        {message && (
          <div className="mb-6">
            {message.type === 'success' ? (
              <SuccessMessage 
                message={message.text}
                onDismiss={() => setMessage(null)}
              />
            ) : (
              <ErrorMessage 
                message={message.text}
                onDismiss={() => setMessage(null)}
              />
            )}
          </div>
        )}

        {error && (
          <div className="mb-6">
            <ErrorMessage 
              message={error}
              onDismiss={() => setError(null)}
            />
          </div>
        )}
        
        {leagues.length === 0 ? (
          <EmptyState
            title="No leagues available"
            description="There are currently no leagues to join. Please check back later."
            action={{
              label: "Refresh",
              onClick: fetchLeagues
            }}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {leagues.map((league) => {
            const isJoining = joining === league.id
            
            return (
              <div key={league.id} className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white">
                    {league.game_type === 'fifa' ? '🎮' : '🏓'} {league.name}
                  </h2>
                  {league.isMember && (
                    <span className="px-3 py-1 bg-green-900 text-green-100 text-sm font-medium rounded-full border border-green-700">
                      Member
                    </span>
                  )}
                </div>
                <p className="text-gray-300 mb-4">
                  {league.game_type === 'fifa' 
                    ? 'Challenge players, record matches, climb the FIFA rankings'
                    : 'Compete in table tennis matches with Elo-based rankings'}
                </p>
                {league.isMember ? (
                  <Link href={`/leaderboard/${league.id}`}>
                    <Button className="w-full text-white border-white hover:bg-white hover:text-black" variant="outline">
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
        )}
        
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-white">How it works</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-300">
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
