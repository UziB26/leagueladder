"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2 } from "lucide-react"

interface League {
  id: string
  name: string
  game_type: string
}

interface LeagueWithMembership extends League {
  isMember: boolean
  playerCount: number
}

export default function LeaguesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [leagues, setLeagues] = useState<LeagueWithMembership[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const fetchLeagues = async () => {
    try {
      const response = await fetch('/api/leagues')
      const data = await response.json()
      if (data.leagues) {
        // Fetch membership status for each league if user is logged in
        const leaguesWithMembership = await Promise.all(
          data.leagues.map(async (league: League) => {
            let isMember = false
            let playerCount = 0

            // Get player count for this league (always fetch, even if not logged in)
            try {
              const statsResponse = await fetch(`/api/leagues/${league.id}/stats`)
              if (statsResponse.ok) {
                const statsData = await statsResponse.json()
                playerCount = statsData.playerCount || 0
              }
            } catch (error) {
              console.error(`Error fetching stats for ${league.id}:`, error)
            }

            if (session?.user?.email) {
              // Check if user is a member of this league
              try {
                const membershipResponse = await fetch(`/api/leagues/${league.id}/membership`)
                if (membershipResponse.ok) {
                  const membershipData = await membershipResponse.json()
                  isMember = membershipData.isMember || false
                }
              } catch (error) {
                console.error(`Error checking membership for ${league.id}:`, error)
              }
            }

            return {
              ...league,
              isMember,
              playerCount
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

  useEffect(() => {
    // If user is logged in, check email verification
    if (session) {
      const user = session.user as { email_verified?: boolean; email?: string } | undefined
      if (user && !user.email_verified) {
        router.push('/auth/verify-email-required')
        return
      }
    }
    fetchLeagues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, router])

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
        // Trigger leaderboard refresh so new player appears immediately
        window.dispatchEvent(new CustomEvent('leaderboard:refresh', { detail: { immediate: true } }))
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to join league' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setJoining(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-600">Loading leagues...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Available Leagues</h1>
        <p className="text-white mt-2">Join a league to start competing and climb the leaderboard</p>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {leagues.map((league) => (
          <Card key={league.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    league.game_type === 'fifa' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {league.game_type === 'fifa' ? (
                      <Gamepad2 className="h-6 w-6 text-blue-700" strokeWidth={2} />
                    ) : (
                      <span className="text-2xl">🏓</span>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{league.name}</CardTitle>
                    <CardDescription>
                      {league.game_type === 'fifa' ? 'FIFA video game league' : 'Table tennis league'}
                    </CardDescription>
                  </div>
                </div>
                {league.isMember && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Member
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Players</span>
                  <span className="font-semibold text-gray-900">{league.playerCount}</span>
                </div>

                <div className="flex gap-3 pt-2">
                  {league.isMember ? (
                    <Link href={`/leaderboard/${league.id}`} className="flex-1">
                      <Button className="w-full text-blue-600 hover:text-blue-700" variant="outline">
                        View Leaderboard
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={() => handleJoinLeague(league.id)}
                      disabled={!session || joining === league.id}
                      className="flex-1"
                    >
                      {!session
                        ? 'Login to Join'
                        : joining === league.id
                        ? 'Joining...'
                        : 'Join League'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {leagues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No leagues available at the moment.</p>
        </div>
      )}

      <div className="mt-12 bg-black border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-3">How Leagues Work</h2>
        <ul className="space-y-2 text-white">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">•</span>
            <span>Join any league to start competing with other players</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">•</span>
            <span>Your Elo rating starts at 1000 when you join</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">•</span>
            <span>Challenge other players and record match results</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">•</span>
            <span>Climb the leaderboard by winning matches</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">•</span>
            <span>You can join multiple leagues</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
